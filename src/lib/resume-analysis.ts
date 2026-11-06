/**
 * Free, client-side resume analysis engine.
 *
 * This is a pure heuristic analyzer — it runs entirely in the browser with no
 * API keys, no server calls, and no cost. It implements resume best practices
 * (ATS-friendliness, actionable bullet points, quantified impact, proper
 * structure) and tailors the rubric to the candidate's experience level.
 */

export type ResumeLevel = 'fresher' | 'mid' | 'experienced'

export interface CategoryResult {
  key: string
  label: string
  score: number // 0-100
  reason: string
  tips: string[]
}

export interface ResumeAnalysis {
  overall: number
  level: ResumeLevel
  wordCount: number
  categories: CategoryResult[]
  positives: string[]
  improvements: string[]
  atsFlags: string[]
  levelLabel: string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function countOccurrences(text: string, re: RegExp): number {
  const flags = re.flags.includes('g') ? re.flags : re.flags + 'g'
  const matches = text.match(new RegExp(re.source, flags))
  return matches ? matches.length : 0
}

function hasAny(text: string, re: RegExp): boolean {
  return re.test(text)
}

function stripNormalize(text: string): string {
  return text
    .replace(/[•·◦▪‑‒–—→>|:;]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// Action verbs and weak-phrase dictionaries (from common resume best practices)
const ACTION_VERBS = new Set([
  'implemented','designed','developed','created','launched','led','managed',
  'increased','reduced','improved','optimized','delivered','built','architected',
  'engineered','coordinated','spearheaded','introduced','drove','achieved',
  'generated','trained','mentored','automated','streamlined','resolved',
  'negotiated','analyzed','researched','published','presented','collaborated',
  'shipped','scaled','migrated','integrated','deployed','configured','maintained',
  'wrote','conducted','established','directed','oversaw','handled','produced',
  'executed','facilitated','organized','supervised','initiated','founded',
  'transformed','boosted','accelerated','expanded','saved','tripled','doubled',
  'grew','cut','slashed','lifted','raised','won','awarded','certified',
  'mastered','volunteered','interned','assisted','contributed','supported',
  'provided','delivered','coordinated','collaborated','drove','launched',
  'performed','improved','increased','reduced','enhanced','developed','built',
  'created','designed','implemented','tested','maintained','managed','led',
  'trained','negotiated','researched','analyzed','wrote','presented','taught',
  'authored','programmed','coded','debugged','configured','deployed',
  'migrated','integrated','automated','documented','reported','forecasted',
  'budgeted','supervised','recruited','hired','mentored','coached','guided',
  'accelerated','maximized','minimized','streamlined','rationalized','centralized',
  'restructured','reorganized','revamped','rebranded','launched','piloted',
  'grew','acquired','retained','partnered','negotiated','closed','won','secured',
  'delivered','exceeded','beat','outperformed','ranked','selected','honored',
])

const WEAK_OPENERS = [
  'responsible for', 'worked on', 'helped with', 'assisted in', 'assisted with',
  'tasked with', 'involved in', 'participated in', 'exposure to', 'familiar with',
  'worked with', 'helped', 'stuff', 'things', 'various', 'etc',
]

const METRIC_PATTERNS = [
  /\d+%/, /(?:%\s|\$)\s?\d/, /(?:rs|inr)\s?\d/i,
  /\d[\d,]*\s*(?:\+|more|plus)\b/,
  /\b(increased|reduced|improved|grew|boosted|cut|slashed|saved|raised|doubled|tripled|grew|reached|served|handled|managed|processed|delivered|closed|won)\b/i,
  /\b(users|customers|clients|revenue|sales|budget|team|projects|requests|tickets|invoices|orders|students|members|followers|downloads|transactions|conversions|leads|enquiries|inquiries)\b/i,
  /\b(million|thousand|months|years|quarter|weekly|monthly|daily)\b/i,
]

const SKILL_KEYWORDS = new Set([
  'python','java','javascript','typescript','c++','c#','ruby','go','rust','sql','mysql','postgresql','mongo','mongodb','react','angular','vue','node','node.js','next.js','html','css','sass','tailwind','bootstrap','git','docker','kubernetes','aws','azure','gcp','firebase','redis','graphql','rest','api','linux','swift','kotlin','flutter','react native','django','flask','spring','express','laravel','php','excel','powerpoint','word','power bi','tableau','pandas','numpy','tensorflow','pytorch','scikit','machine learning','deep learning','data analysis','data science','nlp','excel','word','outlook','photoshop','figma','sketch','sap','salesforce','hadoop','spark','kafka','terraform','jenkins','ci/cd','agile','scrum','jira','confluence','project management','marketing','seo','sem','content','copywriting','ui/ux','design','testing','qa','cybersecurity','networking','security','linux','windows','hardware','cad','ansys','matlab','simulink','solidworks','autocad','latex','r','stata','spss','epidata','zotero','endnote','git','github','gitlab',
  'communication','leadership','teamwork','problem-solving','critical thinking','creativity','adaptability','time management','organization','presentation','public speaking','negotiation','conflict resolution','decision making','analytical','detail-oriented','self-motivated','fast learner','multitasking','customer service','collaboration','mentoring','planning','prioritization',
])

// Section heading detectors (regex on the extracted text)
const SECTION_DETECTORS: { key: string; label: string; re: RegExp }[] = [
  { key: 'summary', label: 'Summary / Objective', re: /(?:\b(summary|objective|profile|about me|career (?:objective|summary)|professional summary|highlights)\b)/i },
  { key: 'experience', label: 'Experience', re: /(?:\b(experience|work experience|employment|professional experience|career history|work history)\b)/i },
  { key: 'education', label: 'Education', re: /(?:\b(education|academic|academic background|schooling)\b)/i },
  { key: 'skills', label: 'Skills', re: /(?:\b(skills|core competencies|technical skills|competencies|expertise|skill set)\b)/i },
  { key: 'projects', label: 'Projects', re: /(?:\b(projects|project work|academic projects|personal projects|key projects)\b)/i },
  { key: 'certifications', label: 'Certifications', re: /(?:\b(certifications|certificates|licenses|licences|credentials|professional development)\b)/i },
  { key: 'achievements', label: 'Achievements / Awards', re: /(?:\b(achievements|awards|honors|honours|accomplishments)\b)/i },
  { key: 'languages', label: 'Languages', re: /(?:\b(languages)\b)/i },
  { key: 'interests', label: 'Interests', re: /(?:\b(interests|hobbies|activities)\b)/i },
]

function detectSections(text: string): Set<string> {
  const found = new Set<string>()
  for (const s of SECTION_DETECTORS) {
    if (hasAny(text, s.re)) found.add(s.key)
  }
  return found
}

function detectContact(text: string): { email: boolean; phone: boolean; linkedin: boolean; github: boolean; portfolio: boolean; location: boolean } {
  return {
    email: hasAny(text, /[\w.+-]+@[\w-]+\.[\w.]+/),
    phone: hasAny(text, /(?:\+?\d[\d\s().-]{7,}\d)/),
    linkedin: hasAny(text, /linkedin\.com|linked-in|in\/[\w-]+/i),
    github: hasAny(text, /github\.com|github\.io|gitlab\.com/i),
    portfolio: hasAny(text, /(?:portfolio|website|blog|personal site)(?:\s*[:.]?)\s*(?:https?:\/\/)?[\w-]+\.\w{2,}/i),
    location: hasAny(text, /\b(?:city|state|counter|india|usa|uk|germany|canada|australia|singapore|dubai|uae|remote)\b/i),
  }
}

function getActionVerbStats(text: string): { actionBullets: number; bullets: number; weakLines: number; totalLines: number } {
  const lines = text.split(/\r?\n/)
  let actionBullets = 0
  let bullets = 0
  let weakLines = 0
  const bulletRe = /^\s*[•·◦▪‑‒–—>|→-]|\d+[.)]\s|[-–—]\s/
  const contentLines = lines.filter(l => l.trim().length > 0)
  for (const rawLine of contentLines) {
    const line = rawLine.trim()
    const isBullet = bulletRe.test(line)
    const cleaned = line.replace(/^[\s•·◦▪‑‒–—>|:\d.)-]+/, '')
    const firstWord = cleaned.split(/\s+/)[0]?.toLowerCase() ?? ''
    if (isBullet) {
      bullets += 1
      if (ACTION_VERBS.has(firstWord)) actionBullets += 1
    }
    if (WEAK_OPENERS.some(w => line.toLowerCase().includes(w))) weakLines += 1
  }
  return { actionBullets, bullets, weakLines, totalLines: contentLines.length }
}

function countMetrics(text: string): number {
  let count = 0
  for (const re of METRIC_PATTERNS) count += countOccurrences(text, re)
  return count
}

function countSkills(text: string): number {
  const lower = text.toLowerCase()
  let hits = 0
  for (const skill of SKILL_KEYWORDS) {
    // word-boundary-ish match to avoid substring false positives
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    if (new RegExp(`(?:^|[^a-z0-9+/])${escaped}(?:$|[^a-z0-9+/])`, 'i').test(lower)) {
      hits += 1
    }
  }
  return hits
}

function bulletUsage(text: string): { bulletLines: number; totalLines: number; ratio: number } {
  const lines = text.split(/\r?\n/)
  const bulletRe = /^\s*[•·◦▪‑‒–—>|→-]|\d+[.)]\s|[-–—]\s/
  let bulletLines = 0
  let total = 0
  for (const line of lines) {
    const t = line.trim()
    if (t.length < 3) continue
    total += 1
    if (bulletRe.test(t)) bulletLines += 1
  }
  return { bulletLines, totalLines: total, ratio: total ? bulletLines / total : 0 }
}

// ---------------------------------------------------------------------------
// Level profiles
// ---------------------------------------------------------------------------

interface LevelProfile {
  label: string
  description: string
  weightCaps: { min: number; max: number }
  weights: Record<string, number>
  coreSections: string[]
  niceSections: string[]
  focusNote: string
}

const LEVEL_PROFILES: Record<ResumeLevel, LevelProfile> = {
  fresher: {
    label: 'Fresher',
    description: 'Students & recent graduates (0–1 years)',
    weightCaps: { min: 280, max: 550 },
    weights: { contact: 0.12, structure: 0.18, content: 0.26, ats: 0.14, skills: 0.16, length: 0.06, impact: 0.08 },
    coreSections: ['education', 'skills', 'projects'],
    niceSections: ['summary', 'certifications', 'achievements', 'experience'],
    focusNote: 'For a fresher, recruiters look for a strong education section, relevant projects, internships, and a clear skills list.',
  },
  mid: {
    label: 'Mid-level',
    description: '1–3 years of professional experience',
    weightCaps: { min: 350, max: 750 },
    weights: { contact: 0.1, structure: 0.16, content: 0.3, ats: 0.14, skills: 0.14, length: 0.06, impact: 0.1 },
    coreSections: ['experience', 'education', 'skills'],
    niceSections: ['summary', 'projects', 'achievements', 'certifications'],
    focusNote: 'At mid-level, focus shifts to measurable impact, ownership, and career progression in your experience section.',
  },
  experienced: {
    label: 'Experienced',
    description: '3+ years of professional experience',
    weightCaps: { min: 400, max: 1000 },
    weights: { contact: 0.08, structure: 0.14, content: 0.32, ats: 0.14, skills: 0.12, length: 0.06, impact: 0.14 },
    coreSections: ['experience', 'summary', 'achievements'],
    niceSections: ['education', 'skills', 'certifications', 'projects'],
    focusNote: 'For experienced professionals, emphasize leadership, large-scale impact, and quantified business results.',
  },
}

// ---------------------------------------------------------------------------
// Category scorers
// ---------------------------------------------------------------------------

function scoreContact(text: string): CategoryResult {
  const c = detectContact(text)
  let score = 0
  const tips: string[] = []
  if (c.email) score += 30
  else tips.push('Add a professional email address (firstname.lastname@example.com).')
  if (c.phone) score += 20
  else tips.push('Include a phone number — most recruiters expect one.')
  if (c.location) score += 15
  else tips.push('Add your city & state (or "Remote") so recruiters know your location.')
  if (c.linkedin) score += 15
  else tips.push('Add a LinkedIn profile URL (update the link to reflect your actual profile).')
  if (c.github || c.portfolio) score += 20
  else tips.push('Add a GitHub / portfolio / personal website link for practical proof of your work.')
  score = Math.min(100, score)
  const reason = c.email && c.phone && (c.linkedin || c.github)
    ? 'Great — your contact header is complete.'
    : 'Your resume is missing some key contact details.'
  return { key: 'contact', label: 'Contact Information', score, reason, tips }
}

function scoreStructure(text: string, level: ResumeLevel): CategoryResult {
  const sections = detectSections(text)
  const profile = LEVEL_PROFILES[level]
  let score = 0
  const tips: string[] = []

  for (const s of profile.coreSections) {
    if (sections.has(s)) score += 18
    else tips.push(`Add a "${SECTION_DETECTORS.find(x => x.key === s)?.label ?? s}" section.`)
  }
  for (const s of profile.niceSections) {
    if (sections.has(s)) score += 8
  }
  // Reward a summary/objective for clarity
  if (sections.has('summary')) score += 8
  else if (level === 'experienced') tips.push('Add a 2–3 line professional summary at the top.')
  else if (level === 'fresher') tips.push('Consider a short objective or summary tailored to the role you want.')

  score = Math.min(100, score)
  const missingCore = profile.coreSections.filter(s => !sections.has(s))
  const reason = missingCore.length === 0
    ? 'Your resume has the core sections recruiters expect.'
    : `Missing key section(s): ${missingCore.map(s => SECTION_DETECTORS.find(x => x.key === s)?.label ?? s).join(', ')}.`
  return { key: 'structure', label: 'Structure & Sections', score, reason, tips }
}

function scoreContent(text: string, level: ResumeLevel): CategoryResult {
  const { actionBullets, bullets, weakLines } = getActionVerbStats(text)
  const tips: string[] = []
  let score = 0

  // Score based on action verbs on bullet lines (not prose ratios).
  if (bullets === 0) {
    score = 25
    tips.push('Break dense paragraphs into bullet points, each starting with a strong action verb.')
  } else {
    const ratio = actionBullets / bullets
    if (ratio >= 0.7) score += 55
    else if (ratio >= 0.5) score += 42
    else if (ratio >= 0.3) score += 30
    else score += 20
    if (actionBullets >= 3) score += 15
    if (ratio < 0.5) tips.push('Start each bullet with a strong action verb (e.g. "Led", "Built", "Increased").')
  }

  if (weakLines > 0) {
    score -= Math.min(25, weakLines * 4)
    tips.push(`Avoid weak phrases like "${WEAK_OPENERS[0]}" / "worked on" (found ${weakLines} instance(s)).`)
  }

  score = Math.max(5, Math.min(100, score))

  const reason = bullets > 0 && actionBullets / bullets >= 0.7 && weakLines === 0
    ? 'Strong action-oriented bullet points. Excellent.'
    : bullets === 0
      ? 'Use bullet points with action verbs — paragraphs are hard to scan.'
      : 'Some bullets lack strong action verbs or contain weak phrasing — tighten them up.'
  return { key: 'content', label: 'Content & Action Verbs', score, reason, tips }
}

function scoreImpact(text: string, level: ResumeLevel): CategoryResult {
  const metrics = countMetrics(text)
  const { bulletLines, totalLines } = bulletUsage(text)
  const tips: string[] = []
  let score = 0

  if (metrics >= 8) score += 55
  else if (metrics >= 4) score += 40
  else if (metrics >= 2) score += 25
  else score += 10

  if (metrics < 3) tips.push('Quantify your achievements — add numbers, percentages, or dollar/rupee figures (e.g. "increased signups by 30%").')

  if (totalLines > 0 && bulletLines > 0) {
    score += 25
  } else {
    score += 5
    tips.push('Use bullet points instead of dense paragraphs — they are far easier for ATS and recruiters to scan.')
  }

  score = Math.min(100, score)
  const reason = metrics >= 4 && bulletLines > 0
    ? 'Good — you use bullet points and measurable achievements.'
    : metrics < 3
      ? 'Add quantified results (%, ₹, counts) to make your contributions concrete.'
      : 'Add more measurable impact to strengthen this.'
  return { key: 'impact', label: `Impact & Measurable Results (${LEVEL_PROFILES[level].focusNote.split(',')[0]})`, score, reason, tips }
}

function scoreSkills(text: string): CategoryResult {
  const skillCount = countSkills(text)
  const tips: string[] = []
  let score = 0
  if (skillCount >= 15) score = 95
  else if (skillCount >= 10) score = 80
  else if (skillCount >= 6) score = 60
  else if (skillCount >= 3) score = 40
  else score = 20

  if (skillCount < 6) tips.push('List your hard skills as a dedicated, scannable skills section (languages, frameworks, tools).')
  const reason = skillCount >= 10
    ? 'Strong, relevant skill set present.'
    : `Only ~${skillCount} common skills detected. Add a dedicated skills section.`
  return { key: 'skills', label: 'Skills & Keywords', score, reason, tips }
}

function scoreLength(text: string, level: ResumeLevel): CategoryResult {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  const { min, max } = LEVEL_PROFILES[level].weightCaps
  const tips: string[] = []
  let score = 100
  if (words > max) {
    score = Math.max(30, 100 - ((words - max) / max) * 50)
    tips.push(`Your resume is ~${words} words. For a ${LEVEL_PROFILES[level].label.toLowerCase()} this is longer than ideal (target ${max} words / ${level === 'experienced' ? '1–2' : '1'} page). Trim filler.`)
  } else if (words < min) {
    score = Math.max(30, 100 - ((min - words) / min) * 50)
    tips.push(`Your resume is only ~${words} words. Add more detail to reach ~${min} words (about one page).`)
  } else {
    tips.push(`Good length (~${words} words) — appropriate for a ${LEVEL_PROFILES[level].label.toLowerCase()} resume.`)
  }
  const reason = words >= min && words <= max
    ? `Length is appropriate (~${words} words).`
    : words > max ? 'Your resume is too long — tighten it up.' : 'Your resume is quite short — add relevant detail.'
  return { key: 'length', label: 'Length & Readability', score, reason, tips }
}

function scoreATS(text: string): CategoryResult {
  const tips: string[] = []
  let check = 0
  const flags: string[] = []

  // Email present is almost mandatory for ATS
  if (detectContact(text).email) check += 25
  else { flags.push('No email found'); tips.push('Add an email — ATS systems need it to route your application.') }

  // Excessive special-character separators can break parsing
  const denseSymbols = countOccurrences(text, /[|]|▌|▍|▎|▏|◤|◢|╞|═|█|▓|▒|░|◆|●|■/g)
  if (denseSymbols > 20) {
    check -= 20
    flags.push('Unusual decorative characters detected')
    tips.push('Remove decorative borders/symbols — they can confuse ATS parsers.')
  } else {
    check += 15
  }

  // Very long continuous lines (likely tables/two-column layout)
  const longLines = text.split(/\r?\n/).filter(l => l.trim().length > 160).length
  if (longLines > 0) {
    check -= 10
    flags.push('Very long lines detected (possible multi-column layout)')
    tips.push('Use a single-column layout — tables and multi-column designs often break ATS parsing.')
  } else {
    check += 10
  }

  // Standard section headings help parsers
  const sections = detectSections(text)
  if (sections.has('education') && sections.has('skills')) check += 15
  else { flags.push('Missing standard headings (education/skills)'); tips.push('Use standard section headings (Education, Skills, Experience) — ATS maps these.') }

  check = Math.max(0, Math.min(100, check))
  const reason = flags.length === 0
    ? 'Looks ATS-friendly: standard headings, no obvious parsing hazards.'
    : `Potential ATS issues: ${flags.join('; ')}.`
  return { key: 'ats', label: 'ATS-Friendliness', score: check, reason, tips }
}

function scoreGrammar(text: string): CategoryResult {
  const tips: string[] = []
  let score = 85
  const doubleSpaces = countOccurrences(text, /[^ ]  +/)
  if (doubleSpaces > 5) { score -= 10; tips.push('Fix double spaces between words.') }
  const repeatedWords = countOccurrences(text, /\b(\w+)\s+\1\b/i)
  if (repeatedWords > 0) { score -= 8; tips.push(`Fix ${repeatedWords} repeated-word typo(s).`) }
  const longRun = countOccurrences(text, /[A-Z]{10,}/)
  if (longRun > 0) { score -= 8; tips.push('Avoid long all-caps blocks — use title case for headings.') }
  score = Math.max(40, score)
  const reason = score >= 80 ? 'Clean typography – no obvious issues.' : 'A few typographical issues to clean up.'
  return { key: 'grammar', label: 'Typography & Polishing', score, reason, tips }
}

// ---------------------------------------------------------------------------
// Main analyzer
// ---------------------------------------------------------------------------

export function analyzeResume(text: string, level: ResumeLevel): ResumeAnalysis {
  const trimmed = text.trim()
  if (!trimmed) {
    return {
      overall: 0, level, wordCount: 0, categories: [], positives: [], improvements: [],
      atsFlags: ['No text could be extracted from this file.'], levelLabel: LEVEL_PROFILES[level].label,
    }
  }

  const profile = LEVEL_PROFILES[level]
  const scorers: Record<string, () => CategoryResult> = {
    contact: () => scoreContact(trimmed),
    structure: () => scoreStructure(trimmed, level),
    content: () => scoreContent(trimmed, level),
    impact: () => scoreImpact(trimmed, level),
    skills: () => scoreSkills(trimmed),
    length: () => scoreLength(trimmed, level),
    ats: () => scoreATS(trimmed),
    grammar: () => scoreGrammar(trimmed),
  }

  const categories: CategoryResult[] = Object.keys(profile.weights).map(k => scorers[k]())

  let weighted = 0
  for (const cat of categories) {
    weighted += cat.score * (profile.weights[cat.key] ?? 0)
  }

  const overall = Math.round(Math.max(0, Math.min(100, weighted)))

  // Derive positives and improvements
  const positives: string[] = []
  const improvements: string[] = []
  const atsFlags: string[] = []

  for (const cat of categories) {
    if (cat.tips.length === 0) {
      positives.push(`${cat.label}: strong (${cat.score}/100).`)
    } else {
      const strongTip = cat.tips[0]
      if (!improvements.includes(strongTip)) improvements.push(strongTip)
    }
    if (cat.key === 'ats' && cat.score < 70) {
      for (const tip of cat.tips) if (!atsFlags.includes(tip)) atsFlags.push(tip)
    }
  }

  return {
    overall,
    level,
    wordCount: trimmed.split(/\s+/).filter(Boolean).length,
    categories,
    positives: positives.slice(0, 4),
    improvements: improvements.slice(0, 6),
    atsFlags,
    levelLabel: profile.label,
  }
}

export const LEVELS: { value: ResumeLevel; label: string; description: string }[] = [
  { value: 'fresher', label: 'Fresher', description: 'Students & new grads (0–1 yrs)' },
  { value: 'mid', label: 'Mid-level', description: '1–3 yrs experience' },
  { value: 'experienced', label: 'Experienced', description: '3+ yrs experience' },
]
