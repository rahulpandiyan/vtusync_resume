/**
 * Job description ↔ resume matcher — 100% client-side heuristics, no AI/API.
 *
 * Follows the approach used by established ATS match checkers:
 *   1. Build the requirement set: extract hard skills, soft skills, tools,
 *      certifications and domain keywords from the job description.
 *   2. Detect each keyword's presence and context in the resume
 *      (Skills section vs experience bullets, presence only vs covered).
 *   3. Compute a weighted coverage match score (0–100).
 */

// ---------------------------------------------------------------------------
// Dictionaries
// ---------------------------------------------------------------------------

export type JDKeywordCategory = 'hard' | 'soft' | 'certification' | 'method' | 'domain'

// Hard skills / tools / technologies (normalized to lowercase forms)
const HARD_SKILLS = new Set([
  // Languages
  'python','java','javascript','typescript','golang','go','rust','c++','c#','ruby','php','scala','kotlin','swift','dart','r','matlab','bash','perl','elixir','clojure','haskell','groovy','assembly','objective-c','sql','pl/sql','tsql','graphql','latex',
  // Frontend
  'react','react.js','reactjs','next.js','nextjs','angular','vue','vue.js','svelte','jquery','backbone','ember','redux','mobx','zustand','tailwind css','scss','sass','css','html','webpack','vite','babel','rollup','esbuild','html5','css3','typescript jsx',
  // Backend & APIs
  'node.js','nodejs','express','django','flask','fastapi','spring','spring boot','rails','ruby on rails','laravel','asp.net','.net','fastapi','nestjs','nest','hapi','koa','grpc','rest','restful','websockets','soap','microservices','monolith','serverless',
  // Mobile
  'react native','flutter','android','ios','swift ui','swiftui','xcode','android studio','kotlin coroutines','cordova','ionic',
  // Data & ML
  'pandas','numpy','scipy','scikit-learn','sklearn','tensorflow','keras','pytorch','mlflow','jupyter','hadoop','spark','kafka','airflow','snowflake','bigquery','redshift','databricks','dbt','beam','flink','hive','pig','impala','tableau','power bi','looker','superset','metabase','data warehouse','etl','elt','data lake','lakehouse','model deployment','machine learning','deep learning','nlp','natural language processing','computer vision','llm','mlops','data science','data analysis','data analytics','statistics','a/b testing','feature engineering','model training',
  // Cloud & Infra
  'aws','ec2','s3','lambda','rds','dynamodb','ecs','eks','cloudfront','api gateway','iam','azure','gcp','google cloud','kubernetes','k8s','docker','terraform','ansible','chef','puppet','jenkins','github actions','gitlab ci','circleci','travis ci','argocd','helm','consul','vault','istio','linkerd','openshift','heroku','vercel','netlify','cloudflare','cloudformation','pulumi','prometheus','grafana','datadog','new relic','splunk','elk','elasticsearch','logstash','nagios','zendesk','nginx','apache','haproxy',
  // Databases
  'postgresql','postgres','mysql','mariadb','oracle','sql server','mssql','sqlite','mongodb','cassandra','dynamodb','redis','memcached','neo4j','couchdb','couchbase','mariadb','aurora','cockroachdb','timescaledb','clickhouse','fauna','supabase','firebase','prisma','sequelize','typeorm','hibernate','nhibernate','entity framework','jdbc','odbc','db2',
  // DevOps & Practices
  'ci/cd','continuous integration','continuous delivery','git','github','gitlab','bitbucket','svn','maven','gradle','npm','yarn','pnpm','jira','confluence','agile','scrum','kanban','devops','sre','site reliability','infrastructure as code','iac','monitoring','observability','logging','alerting','incident management','on-call','deployment','rollback','canary','blue green','zero downtime',
  // Testing
  'jest','mocha','cypress','selenium','playwright','junit','pytest','mocha','chai','jasmine','enzyme','testing','unit testing','integration testing','e2e','test driven development','tdd','bdd','qa','quality assurance','automation testing',
  // Design & Product
  'figma','sketch','adobe xd','photoshop','illustrator','invision','zeplin','ui/ux','user research','wireframing','prototyping','design systems','storybook','framer','wordpress','webflow','shopify','squarespace',
  // Office & General Business
  'excel','powerpoint','word','google sheets','google docs','outlook','sap','salesforce','crm','erp','oracle e-business','workday','service now','zendesk','google analytics','ga4','seo','sem','google ads','meta ads','social media marketing','content marketing','email marketing','marketing automation','hubspot','mailchimp','semrush','ahrefs','copywriting',
  // Engineering domains
  'linux','unix','windows server','networking','tcp/ip','dns','http','https','tls','ssl','vpn','firewall','cybersecurity','security','owasp','penetration testing','siem','encryption','cryptography','oauth','openid','jwt','saml','rbac','active directory','virtualization','vmware','hyper-v','embedded systems','iot','fpga','rtos','vhdl','verilog','autocad','solidworks','catia','ansys','matlab simulink','creo','revit','primo','crm dynamics',
  // Finance & Ops
  'financial modeling','valuation','dcf','accounting','ifrs','gaap','taxation','audit','risk management','underwriting','kyc','aml','commodities','forex','derivatives','equity research','budgeting','forecasting','procurement','supply chain','logistics','inventory management','six sigma','lean','kaizen','5s','iso 9001','iso 14001',
  // Legal & HR
  'contract management','compliance','regulatory','policy','hr','recruitment','talent acquisition','performance management','employee relations','payroll','benefits administration','learning and development','workforce planning',
])

const SOFT_SKILLS = new Set([
  'communication','leadership','teamwork','collaboration','problem solving','problem-solving','critical thinking','creativity','adaptability','flexibility','time management','organization','organizational skills','attention to detail','analytical','analytical skills','detail-oriented','self-motivation','self-motivated','fast learner','quick learner','multitasking','prioritisation','prioritization','decision making','decision-making','conflict resolution','negotiation','customer service','client relationship','public speaking','presentation','presentation skills','interpersonal','interpersonal skills','active listening','empathy','emotional intelligence','accountability','ownership','initiative','resilience','perseverance','mentoring','coaching','stakeholder management','stakeholder engagement','cross-functional','cross functional','team lead','leadership qualities','people skills','relationship building','influencing','management','planning','strategic thinking','big picture','design thinking','growth mindset','work ethic','integrity','dependability','reliability','verbal communication','written communication','listening','creativity','innovation','team building',
])

const CERTIFICATIONS = new Set([
  'aws certified','azure certified','gcp certified','google cloud certified','pmp','prince2','scrum master','csm','safe agilist','aws solutions architect','aws developer','azure administrator','azure developer','ccna','ccnp','cissp','cisa','ciso','ceh','oscp','gcp cloud engineer','comptia','a+','network+','security+','itil','cpa','cma','chartered','acca','cfa','frm','six sigma black belt','lean six sigma','google analytics certification','hubspot certification','salesforce administrator','salesforce certified','aws data analytics','tensorflow developer','kubernetes certification','ckad','cka','databricks certified','terraform associate',
])

const METHODS = new Set([
  'agile','scrum','kanban','waterfall','devops','ci/cd','tdd','bdd','pair programming','code review','design patterns','object oriented','functional programming','event driven','domain driven','microservices','soa','restful','lean','kaizen','six sigma','5s','design sprint','user testing','user research','customer development','a/b testing','okrs','kpis','gtm','go to market','product lifecycle',
])

// Domains / industry language (valuable keywords when present in JD)
const DOMAINS = new Set([
  'fintech','healthcare','healthtech','biotech','pharma','real estate','retail','e-commerce','saas','b2b','b2c','education','edtech','insurance','banking','telecom','telecommunications','logistics','supply chain','manufacturing','automotive','aerospace','climate tech','clean energy','gaming','media','entertainment','cybersecurity','government','public sector','nonprofit','hr tech','proptech','insurtech','legal tech','agritech','supplychain','high-traffic','enterprise','consumer','marketplace','platform',
])

const ALL_KEYWORDS = new Set([...HARD_SKILLS, ...SOFT_SKILLS, ...CERTIFICATIONS, ...METHODS, ...DOMAINS])
const SOFT_SET = new Set(SOFT_SKILLS)
const CERT_SET = new Set(CERTIFICATIONS)
const METHOD_SET = new Set(METHODS)
const DOMAIN_SET = new Set(DOMAINS)

function classifyKeyword(kw: string): JDKeywordCategory {
  if (CERT_SET.has(kw)) return 'certification'
  if (METHOD_SET.has(kw)) return 'method'
  if (DOMAIN_SET.has(kw)) return 'domain'
  if (SOFT_SET.has(kw)) return 'soft'
  return 'hard'
}

const STOPWORDS = new Set([
  'the','and','for','with','that','this','from','will','have','are','you','your','our','their','they','them','then','than','but','not','all','any','can','should','would','could','about','into','over','such','more','most','some','other','others','also','may','might','must','need','needs','required','preferred','plus','join','team','role','work','working','based','within','across','using','use','used','build','building','company','including','include','includes','ability','able','years','year','experience','experienced','strong','excellent','good','great','high','large','various','well','knowledge','understanding','familiarity','familiar','exposure','proficient','proficiency','expert','expertise','hands-on','hands','related','relevant','etc','e.g','i.e','per','via','etc.', 'like', 'key','part','new','help','make','made','take','taking','come','coming','give','given','known','knowns','known\'s',
])

// ---------------------------------------------------------------------------
// Tokenizing / parsing helpers
// ---------------------------------------------------------------------------

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[“”‘’]/g, "'")
    .replace(/[^a-z0-9+#./\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function escapeForRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Find a keyword in a normalized resume text. Handles multiword terms and symbol-heavy tokens (c++, c#, ci/cd, .net). */
function keywordAppears(resumeText: string, keyword: string): boolean {
  const esc = escapeForRegex(keyword)
  // Use word-ish boundaries but allow symbol-heavy tokens to match loosely
  const re = new RegExp(`(?:^|[^a-z0-9+#./-])${esc}(?:$|[^a-z0-9+#./-])`, 'i')
  return re.test(resumeText)
}

function tokenize(text: string): string[] {
  return text.split(' ').filter(Boolean)
}

export interface ExtractedKeyword {
  term: string
  category: JDKeywordCategory
  count: number
  weight: number
}

export interface KeywordMatchResult {
  extracted: ExtractedKeyword[]
  matched: ExtractedKeyword[]
  missing: ExtractedKeyword[]
  matchScore: number
  matchedHardSkills: string[]
  missingHardSkills: string[]
}

/**
 * Extract keywords from a JD using:
 *  - Dictionary matches (hard/soft skills, certifications, methods, domains)
 *  - Frequency n-grams (2–3 word phrases, capitalized tech tokens) as supporting context keywords
 * Returns normalized unique keywords with category + weight.
 */
export function extractKeywords(jd: string): ExtractedKeyword[] {
  const norm = normalizeText(jd)
  const found = new Map<string, ExtractedKeyword>()

  // 1) Dictionary scan — match longest terms first so multiword terms win
  const sorted = [...ALL_KEYWORDS].sort((a, b) => b.length - a.length)
  const masked = new Array(norm.length).fill(false)

  for (const kw of sorted) {
    const esc = escapeForRegex(kw)
    const re = new RegExp(`(?:^|[^a-z0-9+#./-])${esc}(?:$|[^a-z0-9+#./-])`, 'ig')
    let m: RegExpExecArray | null
    let count = 0
    while ((m = re.exec(norm)) !== null) {
      const start = m.index
      const end = start + m[0].length
      const slice = masked.slice(start, end)
      if (slice.every(Boolean)) continue // already claimed by a longer keyword
      for (let i = start; i < end; i++) if (norm[i].trim()) masked[i] = true
      count++
    }
    if (count > 0) {
      const weight = categoryWeight(kw, count)
      found.set(kw, { term: kw, category: classifyKeyword(kw), count, weight })
    }
  }

  // 2) Supporting n-grams — captures tool names we don't know yet
  //    Only non-stopword, >=4 chars, appears at least twice (or looks like a known tech token).
  const tokens = tokenize(norm)
  const ngrams = new Map<string, number>()
  for (let i = 0; i < tokens.length; i++) {
    for (let n = 2; n <= 3; n++) {
      const slice = tokens.slice(i, i + n)
      if (slice.length < n) continue
      const phrase = slice.join(' ')
      if (phrase.length < 6 || phrase.length > 40) continue
      if (STOPWORDS.has(slice[0]) || STOPWORDS.has(slice[slice.length - 1])) continue
      if (slice.some(t => STOPWORDS.has(t) && t.length > 4)) continue
      if (!/^[a-z0-9+#./-]+$/.test(slice[0])) continue
      ngrams.set(phrase, (ngrams.get(phrase) ?? 0) + 1)
    }
  }

  for (const [phrase, count] of ngrams) {
    if (count < 2) continue
    if (found.has(phrase)) continue
    // Only relevant technical-looking phrases (keep the bar high to avoid noise)
    if (!/(software|system|engineer|develop|platform|architecture|protocol|framework|database|cloud|deploy|integration|infrastructure|security|performance|scalab|test|automation|data|api|sdk|library|tool|services|sql|nosql|server)/.test(phrase)) continue
    found.set(phrase, { term: phrase, category: 'domain', count, weight: Math.min(4, count) })
  }

  return [...found.values()].sort((a, b) => b.weight - a.weight)
}

function categoryWeight(kw: string, count: number): number {
  const base = CERT_SET.has(kw) ? 5
    : HARD_SKILLS.has(kw) ? 4
    : DOMAIN_SET.has(kw) ? 3
    : METHOD_SET.has(kw) ? 3
    : SOFT_SET.has(kw) ? 2
    : 2
  // Frequency bonus capped so stuffing doesn't dominate
  return Math.min(base + Math.log2(count + 1), base + 4)
}

/**
 * Score the resume vs an extracted requirement set.
 * Placement multipliers: Skills section match → 1.2x, summary → 1.1x, bullets → 1.0x
 */
export function scoreJobMatch(resumeText: string, jd: string): KeywordMatchResult {
  const rNorm = normalizeText(resumeText)
  const extracted = extractKeywords(jd)

  const skillsIdx = indexOfAny(normalizeText(resumeText), ['skills', 'core competencies', 'technical skills', 'competencies'])
  const summaryIdx = indexOfAny(normalizeText(resumeText), ['summary', 'objective', 'profile', 'about me'])
  const sections = {
    skills: skillsIdx >= 0 ? skillsIdx : 0,
    summary: summaryIdx >= 0 ? summaryIdx : -1,
    bullets: 0,
  }

  const matched: ExtractedKeyword[] = []
  const missing: ExtractedKeyword[] = []

  for (const kw of extracted) {
    if (!keywordAppears(rNorm, normalizeText(kw.term))) {
      missing.push(kw)
      continue
    }
    // Placement bonus (approx via positions)
    let mult = 1.0
    if (sections.skills >= 0 && locateKeywordIn(rNorm, kw.term, sections.skills)) mult = 1.2
    else if (sections.summary >= 0 && locateKeywordIn(rNorm, kw.term, sections.summary)) mult = 1.1
    matched.push({ ...kw, weight: kw.weight * mult })
  }

  const total = extracted.reduce((s, k) => s + k.weight, 0)
  const got = matched.reduce((s, k) => s + k.weight, 0)
  const matchScore = total === 0 ? 0
    : Math.round(Math.max(0, Math.min(100, (got / total) * 100 - (total > 0 ? 0 : 0))))

  const byCategory = (list: ExtractedKeyword[], cat: JDKeywordCategory) =>
    list.filter(k => k.category === cat).map(k => k.term)

  return {
    extracted,
    matched,
    missing,
    matchScore,
    matchedHardSkills: byCategory(matched, 'hard').slice().sort(),
    missingHardSkills: byCategory(missing, 'hard').slice().sort(),
  }
}

function locateKeywordIn(text: string, keyword: string, startIdx: number): boolean {
  const esc = escapeForRegex(keyword)
  const re = new RegExp(`(?:^|[^a-z0-9+#./-])${esc}`, 'i')
  const segment = text.slice(startIdx, startIdx + 4000)
  return re.test(segment)
}

function indexOfAny(text: string, phrases: string[]): number {
  let best = -1
  for (const p of phrases) {
    const idx = text.indexOf(p)
    if (idx >= 0 && (best < 0 || idx < best)) best = idx
  }
  return best
}

export type JobMatchVerdict = 'strong' | 'partial' | 'weak' | 'none'

export function verdictFor(matchScore: number, extractedCount: number): JobMatchVerdict {
  if (extractedCount === 0) return 'none'
  if (matchScore >= 70) return 'strong'
  if (matchScore >= 40) return 'partial'
  return 'weak'
}

export interface JobMatchResult extends KeywordMatchResult {
  jdWordCount: number
  verdict: JobMatchVerdict
  verdictLabel: string
}

export function analyzeJobMatch(resumeText: string, jd: string): JobMatchResult {
  const base = scoreJobMatch(resumeText, jd)
  const verdict = verdictFor(base.matchScore, base.extracted.length)
  const labels: Record<JobMatchVerdict, string> = {
    strong: 'Strong match',
    partial: 'Partial match',
    weak: 'Weak match',
    none: 'No technical keywords detected',
  }
  return {
    ...base,
    jdWordCount: jd.trim().split(/\s+/).filter(Boolean).length,
    verdict,
    verdictLabel: labels[verdict],
  }
}
