import { lookup } from 'dns/promises'

/**
 * Public endpoint to fetch a job posting's readable text.
 * Used by the free resume scanner to let users paste a URL instead of the
 * full job description text.
 *
 * No AI involved — we fetch the page, strip markup and return plain text.
 *
 * SSRF guards:
 *   - http/https only
 *   - DNS resolved and private/loopback/link-local ranges rejected
 *   - 8s timeout, 512KB cap, 30k char output cap
 *   - only HTML / plain-text pages accepted
 */

const MAX_BYTES = 512 * 1024
const MAX_TEXT = 30000
const TIMEOUT_MS = 8000

function isPrivateIp(ip: string): boolean {
  if (ip.includes(':')) {
    const normalized = ip.toLowerCase()
    if (normalized === '::1' || normalized === '::') return true
    // fc00::/7 (unique local) and fe80::/10 (link-local)
    if (/^f[cd][0-9a-f]{2}:/.test(normalized)) return true
    if (/^fe[89ab][0-9a-f]:/.test(normalized)) return true
    if (normalized.startsWith('::ffff:')) return isPrivateIp(normalized.slice(7))
    return false
  }
  const parts = ip.split('.').map(Number)
  if (parts.length !== 4 || parts.some(n => Number.isNaN(n))) return true
  const [a, b] = parts
  if (a === 0 || a === 10 || a === 127) return true
  if (a === 169 && b === 254) return true
  if (a === 172 && b >= 16 && b <= 31) return true
  if (a === 192 && b === 168) return true
  if (a === 100 && b >= 64 && b <= 127) return true // CGNAT
  if (a >= 224) return true // multicast / reserved
  return false
}

async function resolvePublicAddress(hostname: string): Promise<string | null> {
  try {
    const { address } = await lookup(hostname)
    if (isPrivateIp(address)) return null
    return address
  } catch {
    return null
  }
}

function stripHtml(html: string): string {
  let text = html
  // Remove non-content blocks entirely
  text = text.replace(/<script[\s\S]*?<\/script>/gi, ' ')
  text = text.replace(/<style[\s\S]*?<\/style>/gi, ' ')
  text = text.replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
  text = text.replace(/<!--[\s\S]*?-->/g, ' ')
  text = text.replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
  // Break tags into lines-ish structure
  text = text.replace(/<\/(p|div|li|tr|h[1-6]|section|article|header|footer|br|ul|ol|table)>/gi, '\n')
  text = text.replace(/<li[^>]*>/gi, '\n- ')
  // Strip remaining tags
  text = text.replace(/<[^>]+>/g, ' ')
  // Decode basic entities
  const entities: Record<string, string> = {
    amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'", apos: "'", nbsp: ' ', '#x27': "'", '#x2F': '/',
  }
  text = text.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (m, code) => {
    const lower = code.toLowerCase()
    if (entities[lower]) return entities[lower]
    if (lower.startsWith('#x')) return String.fromCodePoint(parseInt(lower.slice(2), 16) || 32)
    if (lower.startsWith('#')) return String.fromCodePoint(parseInt(lower.slice(1), 10) || 32)
    return ' '
  })
  text = text
    .split('\n')
    .map(line => line.replace(/\s+/g, ' ').trim())
    .filter(line => line.length > 0 && line.length > 1 || /[a-zA-Z0-9]/.test(line))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
  return text.trim().slice(0, MAX_TEXT)
}

export async function POST(req: Request) {
  let body: { url?: string }
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const raw = (body?.url || '').trim()
  if (!raw) return Response.json({ error: 'Missing url' }, { status: 400 })
  if (raw.length > 2048) return Response.json({ error: 'URL too long' }, { status: 400 })

  let url: URL
  try {
    url = new URL(raw)
  } catch {
    return Response.json({ error: 'Invalid URL — paste the full link, e.g. https://company.com/jobs/123' }, { status: 400 })
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return Response.json({ error: 'Only http:// and https:// URLs are supported' }, { status: 400 })
  }

  const allowed = await resolvePublicAddress(url.hostname)
  if (!allowed) {
    return Response.json({ error: 'This address is not allowed (internal/private network)' }, { status: 400 })
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(url.toString(), {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'user-agent': 'Mozilla/5.0 (compatible; ResumeScanner/1.0; +https://resume.vtusync.in)',
        'accept': 'text/html,application/xhtml+xml,text/plain;q=0.9,*/*;q=0.5',
      },
    })

    if (!res.ok) {
      return Response.json({ error: `The job page returned ${res.status}. Try copying the job description text instead.` }, { status: 502 })
    }

    const contentType = (res.headers.get('content-type') || '').toLowerCase()
    if (!contentType.includes('text/html') && !contentType.includes('xhtml') && !contentType.includes('text/plain')) {
      return Response.json({ error: 'That URL is not a readable page — copy the job description text instead.' }, { status: 415 })
    }

    const lengthHeader = Number(res.headers.get('content-length') || '0')
    if (lengthHeader > MAX_BYTES) {
      return Response.json({ error: 'The page is too large to read — copy the job description text instead.' }, { status: 413 })
    }

    // Read with byte cap
    const reader = res.body?.getReader()
    if (!reader) return Response.json({ error: 'The page could not be read.' }, { status: 502 })

    const chunks: Uint8Array[] = []
    let received = 0
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      received += value?.length ?? 0
      if (received > MAX_BYTES) {
        chunks.push(value.subarray(0, Math.max(0, value.length - (received - MAX_BYTES))))
        break
      }
      chunks.push(value)
    }

    const rawHtml = new TextDecoder('utf-8').decode(concatUint8(chunks))
    const text = stripHtml(rawHtml)
    if (text.length < 50) {
      return Response.json({ error: 'Could not extract readable text (the page may require login). Copy the job description text instead.' }, { status: 422 })
    }

    return Response.json({ text, source: url.host })
  } catch (e) {
    if (e instanceof Error && e.name === 'AbortError') {
      return Response.json({ error: 'The page took too long to load — copy the job description text instead.' }, { status: 504 })
    }
    return Response.json({ error: 'Could not fetch the job page. Check the URL or paste the job description text instead.' }, { status: 502 })
  } finally {
    clearTimeout(timer)
  }
}

function concatUint8(chunks: Uint8Array[]): Uint8Array {
  const total = chunks.reduce((n, c) => n + c.length, 0)
  const out = new Uint8Array(total)
  let offset = 0
  for (const chunk of chunks) {
    out.set(chunk, offset)
    offset += chunk.length
  }
  return out
}
