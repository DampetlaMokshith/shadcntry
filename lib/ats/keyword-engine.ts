// ─── ATS Keyword Extraction Engine ─────────────────────────────────────────
// Pure algorithmic keyword extraction — no AI, no external APIs.

import type { CategorizedKeywords, ParsedExperience } from "./types";

// ─── Stop Words ────────────────────────────────────────────────────────────
const STOP_WORDS = new Set([
  "a","about","above","after","again","against","all","am","an","and","any",
  "are","aren't","as","at","be","because","been","before","being","below",
  "between","both","but","by","can","can't","cannot","could","couldn't","did",
  "didn't","do","does","doesn't","doing","don't","down","during","each","few",
  "for","from","further","get","got","had","hadn't","has","hasn't","have",
  "haven't","having","he","he'd","he'll","he's","her","here","here's","hers",
  "herself","him","himself","his","how","how's","i","i'd","i'll","i'm","i've",
  "if","in","into","is","isn't","it","it's","its","itself","let's","me","more",
  "most","mustn't","my","myself","no","nor","not","of","off","on","once","only",
  "or","other","ought","our","ours","ourselves","out","over","own","per","same",
  "shan't","she","she'd","she'll","she's","should","shouldn't","so","some",
  "such","than","that","that's","the","their","theirs","them","themselves",
  "then","there","there's","these","they","they'd","they'll","they're",
  "they've","this","those","through","to","too","under","until","up","upon",
  "us","very","was","wasn't","we","we'd","we'll","we're","we've","were",
  "weren't","what","what's","when","when's","where","where's","which","while",
  "who","who's","whom","why","why's","will","with","won't","would","wouldn't",
  "you","you'd","you'll","you're","you've","your","yours","yourself",
  "yourselves","also","just","like","etc","use","using","used","work","working",
  "well","will","within","without","would","able","across","along","already",
  "among","around","based","best","better","bring","come","day","different",
  "even","every","first","go","good","great","help","high","however","include",
  "including","keep","know","last","long","look","make","many","may","might",
  "much","must","need","new","next","now","number","often","one","part",
  "people","place","point","possible","provide","right","say","set","show",
  "small","start","still","take","tell","thing","think","time","try","turn",
  "two","want","way","year","role","join","team","company","opportunity",
  "position","candidate","application","apply","job","looking","seeking",
  "responsibilities","qualifications","requirements","description","duties",
  "equal","employer","employment","status","race","color","religion","sex",
  "national","origin","age","disability","veteran","protected","class",
]);

// ─── Skill Dictionaries ───────────────────────────────────────────────────

const HARD_SKILLS: Set<string> = new Set([
  // Programming Languages
  "javascript","typescript","python","java","c++","c#","ruby","php","swift",
  "kotlin","go","golang","rust","scala","perl","r","matlab","dart","lua",
  "haskell","elixir","clojure","objective-c","assembly","fortran","cobol",
  "visual basic","vba","groovy","shell","bash","powershell","sql","nosql",
  "plsql","t-sql",
  // Web Frontend
  "react","reactjs","react.js","angular","angularjs","vue","vuejs","vue.js",
  "svelte","nextjs","next.js","nuxt","nuxtjs","gatsby","remix","astro",
  "html","html5","css","css3","sass","scss","less","tailwind","tailwindcss",
  "bootstrap","material ui","chakra ui","styled components","webpack","vite",
  "rollup","parcel","babel","eslint","prettier","storybook","chromatic",
  "playwright","cypress","selenium","jest","mocha","jasmine","karma",
  "enzyme","testing library","react testing library","vitest",
  // Web Backend
  "node","nodejs","node.js","express","expressjs","fastify","nestjs","koa",
  "hapi","django","flask","fastapi","spring","spring boot","rails",
  "ruby on rails","laravel","symfony","asp.net",".net","dotnet","gin",
  "echo","fiber","actix","rocket",
  // Databases
  "mysql","postgresql","postgres","mongodb","redis","elasticsearch",
  "cassandra","dynamodb","couchdb","neo4j","graphql","firebase","supabase",
  "prisma","sequelize","typeorm","knex","drizzle","sqlite","mariadb",
  "oracle","sql server","mssql","cockroachdb","planetscale","neon",
  // Cloud & DevOps
  "aws","amazon web services","azure","gcp","google cloud","google cloud platform",
  "docker","kubernetes","k8s","terraform","ansible","puppet","chef",
  "jenkins","circleci","github actions","gitlab ci","travis ci","bamboo",
  "cloudformation","pulumi","helm","istio","prometheus","grafana","datadog",
  "new relic","splunk","elk","logstash","kibana","nginx","apache","caddy",
  "linux","unix","windows server","vmware","vagrant","openstack",
  // Data & ML
  "machine learning","deep learning","neural networks","tensorflow",
  "pytorch","keras","scikit-learn","pandas","numpy","scipy","matplotlib",
  "seaborn","plotly","tableau","power bi","looker","data visualization",
  "data analysis","data science","data engineering","data mining",
  "data warehousing","etl","data pipeline","apache spark","hadoop",
  "hive","pig","airflow","kafka","rabbitmq","celery","dbt",
  "snowflake","redshift","bigquery","databricks","mlflow","kubeflow",
  "natural language processing","nlp","computer vision","reinforcement learning",
  "generative ai","large language models","llm","rag","embeddings",
  "transformers","bert","gpt","stable diffusion","langchain",
  // Mobile
  "react native","flutter","ionic","xamarin","android","ios","swiftui",
  "uikit","jetpack compose","android studio","xcode","cocoapods",
  "gradle","expo",
  // Design
  "figma","sketch","adobe xd","invision","zeplin","photoshop",
  "illustrator","after effects","premiere pro","blender","cinema 4d",
  "maya","autocad","solidworks","revit","rhino","grasshopper",
  "ui design","ux design","user research","wireframing","prototyping",
  "design systems","interaction design","visual design","motion design",
  "graphic design","brand design","typography","color theory",
  "responsive design","accessibility","wcag","aria",
  // Project Management
  "agile","scrum","kanban","waterfall","lean","six sigma","pmp","prince2",
  "jira","confluence","trello","asana","monday","notion","linear",
  "clickup","basecamp","microsoft project","rally","azure devops",
  "product management","product strategy","product roadmap","okr","kpi",
  // Security
  "cybersecurity","information security","network security","application security",
  "penetration testing","vulnerability assessment","soc","siem","ids","ips",
  "firewall","vpn","encryption","ssl","tls","oauth","saml","jwt","ldap",
  "active directory","iam","zero trust","devsecops","owasp","cissp","ceh",
  "comptia security+","iso 27001","gdpr","hipaa","pci dss","soc 2",
  // Finance & Accounting
  "financial analysis","financial modeling","financial reporting",
  "accounting","bookkeeping","accounts payable","accounts receivable",
  "general ledger","budgeting","forecasting","variance analysis",
  "cost accounting","tax","audit","compliance","sox","gaap","ifrs",
  "sap","oracle financials","quickbooks","xero","netsuite","bloomberg",
  "excel","advanced excel","pivot tables","vlookup","macros","vba",
  "cfa","cpa","acca","fmva",
  // Marketing
  "seo","sem","ppc","google ads","facebook ads","instagram ads",
  "linkedin ads","twitter ads","tiktok ads","programmatic advertising",
  "display advertising","retargeting","email marketing","mailchimp",
  "hubspot","marketo","salesforce","pardot","crm","marketing automation",
  "content marketing","social media marketing","influencer marketing",
  "brand marketing","growth marketing","performance marketing",
  "google analytics","google tag manager","mixpanel","amplitude",
  "hotjar","ahrefs","semrush","moz","copywriting","content strategy",
  "a/b testing","conversion optimization","cro","funnel optimization",
  // Healthcare
  "ehr","emr","epic","cerner","meditech","hl7","fhir","hipaa",
  "clinical trials","fda","gmp","gcp","pharmacovigilance","medical coding",
  "icd-10","cpt","medical billing","healthcare administration",
  "patient care","nursing","phlebotomy","radiology","laboratory",
  "clinical research","biostatistics","epidemiology","public health",
  // Engineering (Non-software)
  "mechanical engineering","electrical engineering","civil engineering",
  "chemical engineering","biomedical engineering","aerospace engineering",
  "industrial engineering","environmental engineering","structural engineering",
  "cad","cam","cae","fea","cfd","plc","scada","pid","hvac",
  "project engineering","process engineering","quality engineering",
  "manufacturing","lean manufacturing","3d printing","additive manufacturing",
  // Legal
  "contract law","corporate law","intellectual property","patent",
  "trademark","copyright","litigation","arbitration","mediation",
  "legal research","legal writing","westlaw","lexisnexis","case management",
  "regulatory compliance","due diligence","mergers and acquisitions",
  "securities law","employment law","real estate law","tax law",
  // HR
  "recruiting","talent acquisition","onboarding","employee relations",
  "performance management","compensation","benefits administration",
  "payroll","hris","workday","successfactors","bamboohr","adp",
  "talent management","succession planning","organizational development",
  "training and development","learning management","diversity and inclusion",
  // Operations
  "supply chain","logistics","procurement","inventory management",
  "warehouse management","distribution","transportation","fleet management",
  "demand planning","supply planning","erp","mrp","wms","tms",
  "continuous improvement","process improvement","business process",
  "operations management","facilities management","vendor management",
  // Sales
  "sales","business development","account management","key account",
  "enterprise sales","inside sales","outside sales","field sales",
  "sales strategy","sales operations","pipeline management","territory management",
  "cold calling","prospecting","negotiation","closing","quota attainment",
  "salesforce crm","hubspot crm","zoho crm","dynamics 365",
  // General Tech
  "api","rest","restful","soap","grpc","websocket","microservices",
  "monolith","serverless","lambda","cloud functions","event driven",
  "message queue","pub/sub","cqrs","domain driven design","ddd",
  "clean architecture","solid","design patterns","ci/cd","devops",
  "sre","infrastructure as code","iac","monitoring","observability",
  "logging","tracing","load balancing","caching","cdn","performance optimization",
  "scalability","high availability","disaster recovery","backup",
  "version control","git","github","gitlab","bitbucket","svn",
  "code review","pair programming","mob programming","tdd","bdd",
  "unit testing","integration testing","end-to-end testing","e2e",
  "load testing","stress testing","performance testing","security testing",
  "qa","quality assurance","test automation","manual testing",
  "technical writing","documentation","system design","architecture",
  "distributed systems","concurrency","multithreading","parallel computing",
  "blockchain","smart contracts","solidity","ethereum","web3",
  "iot","embedded systems","fpga","vhdl","verilog","rtos",
  "ar","vr","xr","unity","unreal engine","game development",
]);

const SOFT_SKILLS: Set<string> = new Set([
  "communication","verbal communication","written communication",
  "presentation","public speaking","interpersonal","collaboration",
  "teamwork","team player","leadership","management","mentoring",
  "coaching","delegation","motivation","empathy","emotional intelligence",
  "conflict resolution","problem solving","critical thinking",
  "analytical thinking","creative thinking","innovation","creativity",
  "decision making","judgment","strategic thinking","strategic planning",
  "time management","prioritization","multitasking","organization",
  "organizational skills","attention to detail","detail oriented",
  "self motivated","self starter","initiative","proactive","driven",
  "results oriented","goal oriented","adaptability","flexibility",
  "resilience","stress management","work ethic","reliability",
  "accountability","integrity","professionalism","customer service",
  "client relations","stakeholder management","cross functional",
  "cross-functional","remote work","virtual collaboration",
  "cultural awareness","diversity awareness","inclusive","inclusivity",
  "negotiation","persuasion","influence","relationship building",
  "networking","facilitation","mediation","active listening",
  "feedback","constructive criticism","continuous learning",
  "growth mindset","curiosity","research","resourcefulness",
  "independence","autonomy","ownership","entrepreneurial",
]);

const EDUCATION_KEYWORDS: Set<string> = new Set([
  "bachelor","bachelors","bachelor's","bs","ba","bsc","bba","bcom","btech",
  "master","masters","master's","ms","ma","msc","mba","mtech","med","mfa",
  "phd","doctorate","doctoral","postdoc","postdoctoral",
  "associate","associates","associate's","aa","as",
  "diploma","certificate","certification","certified","accredited",
  "degree","undergraduate","graduate","postgraduate",
  "computer science","information technology","information systems",
  "software engineering","electrical engineering","mechanical engineering",
  "civil engineering","chemical engineering","biomedical engineering",
  "data science","statistics","mathematics","physics","chemistry","biology",
  "business administration","economics","finance","accounting","marketing",
  "psychology","sociology","political science","international relations",
  "communications","journalism","english","history","philosophy",
  "law","medicine","nursing","pharmacy","public health",
  "education","liberal arts","fine arts","music","architecture",
  "gpa","cum laude","magna cum laude","summa cum laude","honors",
  "coursework","thesis","dissertation","research","publication",
  "university","college","institute","school","academy",
  // Common certifications
  "aws certified","azure certified","google certified","cisco certified",
  "ccna","ccnp","ccie","pmp","capm","scrum master","csm","psm",
  "togaf","itil","cobit","cissp","cism","ceh","comptia","a+","network+",
  "security+","cloud+","linux+","cka","ckad","cks",
  "google analytics certified","hubspot certified","salesforce certified",
  "microsoft certified","mcse","mcsa","rhce","rhcsa",
  "cfa","cpa","acca","cma","cia","frm","cfp",
  "six sigma","green belt","black belt","lean six sigma",
  "osha","first aid","cpr","bls","acls",
]);

const EXPERIENCE_PATTERNS = [
  /(\d+)\+?\s*(?:years?|yrs?)\s*(?:of\s+)?(?:experience|exp)/gi,
  /(\d+)\s*[-–]\s*(\d+)\s*(?:years?|yrs?)/gi,
  /(?:experience|exp)\s*(?:of\s+)?(\d+)\+?\s*(?:years?|yrs?)/gi,
  /(?:minimum|min|at\s+least)\s*(\d+)\s*(?:years?|yrs?)/gi,
  /(?:senior|junior|mid|entry)\s*(?:level|[-–]level)?/gi,
  /(\d+)\+?\s*(?:years?|yrs?)\s+(?:in|with|of)/gi,
];

// ─── Text Normalization ───────────────────────────────────────────────────

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\r\n]+/g, " ")
    .replace(/['']/g, "'")
    .replace(/[""]/g, '"')
    .replace(/[-–—]/g, " ")
    .replace(/[\/\\]/g, " ")
    .replace(/[^\w\s'.+#]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ─── Tokenization ─────────────────────────────────────────────────────────

function getUnigrams(text: string): string[] {
  return text.split(/\s+/).filter((w) => w.length > 1 && !STOP_WORDS.has(w));
}

function getNgrams(words: string[], n: number): string[] {
  const ngrams: string[] = [];
  for (let i = 0; i <= words.length - n; i++) {
    ngrams.push(words.slice(i, i + n).join(" "));
  }
  return ngrams;
}

// ─── Keyword Extraction ───────────────────────────────────────────────────

export function extractKeywords(text: string): CategorizedKeywords {
  const normalized = normalizeText(text);
  const words = normalized.split(/\s+/).filter((w) => w.length > 1);
  const unigrams = getUnigrams(normalized);
  const bigrams = getNgrams(words, 2);
  const trigrams = getNgrams(words, 3);

  const allTokens = [...unigrams, ...bigrams, ...trigrams];
  const seen = new Set<string>();

  const result: CategorizedKeywords = {
    hardSkills: [],
    softSkills: [],
    education: [],
    experience: [],
    jobSpecific: [],
  };

  // Extract experience patterns
  for (const pattern of EXPERIENCE_PATTERNS) {
    const regex = new RegExp(pattern.source, pattern.flags);
    let match;
    while ((match = regex.exec(normalized)) !== null) {
      const expStr = match[0].trim();
      if (!seen.has(expStr)) {
        seen.add(expStr);
        result.experience.push(expStr);
      }
    }
  }

  // Categorize tokens — check longest matches first (trigrams → bigrams → unigrams)
  const orderedTokens = [...trigrams, ...bigrams, ...unigrams];

  for (const token of orderedTokens) {
    if (seen.has(token)) continue;
    if (STOP_WORDS.has(token)) continue;

    // Check if this token is a sub-match of an already-found longer token
    const isSubMatch = Array.from(seen).some(
      (s) => s.length > token.length && s.includes(token)
    );
    if (isSubMatch) continue;

    if (HARD_SKILLS.has(token)) {
      seen.add(token);
      result.hardSkills.push(token);
    } else if (SOFT_SKILLS.has(token)) {
      seen.add(token);
      result.softSkills.push(token);
    } else if (EDUCATION_KEYWORDS.has(token)) {
      seen.add(token);
      result.education.push(token);
    }
  }

  // Job-specific: unigrams not in any dictionary, not stop words, length > 3
  for (const token of unigrams) {
    if (seen.has(token)) continue;
    if (token.length <= 3) continue;
    // Skip pure numbers
    if (/^\d+$/.test(token)) continue;
    // Skip very common words that aren't meaningful
    if (STOP_WORDS.has(token)) continue;

    seen.add(token);
    result.jobSpecific.push(token);
  }

  return result;
}

// ─── Required vs Preferred Detection ──────────────────────────────────────

const REQUIRED_SIGNALS = [
  "required","must have","must-have","mandatory","essential","necessary",
  "minimum requirement","key requirement","critical","non-negotiable",
  "need to have","expected","shall have","will have",
];

const PREFERRED_SIGNALS = [
  "preferred","nice to have","nice-to-have","bonus","desirable","plus",
  "advantage","beneficial","ideal","would be great","good to have",
  "not required but","optional","additionally",
];

export function detectRequiredVsPreferred(
  text: string,
  keywords: string[]
): { required: string[]; preferred: string[] } {
  const normalized = normalizeText(text);
  const sentences = normalized.split(/[.;!?\n]+/).map((s) => s.trim());

  const required: Set<string> = new Set();
  const preferred: Set<string> = new Set();

  for (const sentence of sentences) {
    const isRequired = REQUIRED_SIGNALS.some((signal) =>
      sentence.includes(signal)
    );
    const isPreferred = PREFERRED_SIGNALS.some((signal) =>
      sentence.includes(signal)
    );

    for (const keyword of keywords) {
      if (sentence.includes(keyword.toLowerCase())) {
        if (isPreferred) {
          preferred.add(keyword);
        } else if (isRequired) {
          required.add(keyword);
        } else {
          // Default to required if no signal detected
          required.add(keyword);
        }
      }
    }
  }

  // Any keyword not found in any sentence defaults to required
  for (const keyword of keywords) {
    if (!required.has(keyword) && !preferred.has(keyword)) {
      required.add(keyword);
    }
  }

  return {
    required: Array.from(required),
    preferred: Array.from(preferred),
  };
}

// ─── Get All Keywords as Flat List ────────────────────────────────────────

export function flattenKeywords(categorized: CategorizedKeywords): string[] {
  return [
    ...categorized.hardSkills,
    ...categorized.softSkills,
    ...categorized.education,
    ...categorized.experience,
    ...categorized.jobSpecific,
  ];
}

// ─── Structured Experience Parsing ────────────────────────────────────────
// Parses raw experience strings into structured numeric data for proper
// comparison (e.g., "3 years" should NOT match "4+ years").

export function parseExperience(text: string): ParsedExperience[] {
  const normalized = text
    .toLowerCase()
    .replace(/[\r\n]+/g, " ")
    .replace(/['']/g, "'")
    .replace(/[""]/g, '"')
    .replace(/\s+/g, " ")
    .trim();

  const results: ParsedExperience[] = [];
  const seenRanges = new Set<string>();

  // Pattern 1: "3-5 years" (range)
  const rangePattern = /(\d+)\s*[-–to]+\s*(\d+)\s*\+?\s*(?:years?|yrs?)(?:\s+(?:of\s+)?(?:experience|exp(?:erience)?|in|with))?/gi;
  let match;
  while ((match = rangePattern.exec(normalized)) !== null) {
    const key = `${match[1]}-${match[2]}`;
    if (!seenRanges.has(key)) {
      seenRanges.add(key);
      results.push({
        raw: match[0].trim(),
        minYears: parseInt(match[1]),
        maxYears: parseInt(match[2]),
        isMinimum: false,
        level: null,
      });
    }
  }

  // Pattern 2: "minimum/at least N years"
  const minimumPattern = /(?:minimum|min\.?|at\s+least)\s*(\d+)\s*\+?\s*(?:years?|yrs?)(?:\s+(?:of\s+)?(?:experience|exp(?:erience)?|in|with))?/gi;
  while ((match = minimumPattern.exec(normalized)) !== null) {
    const years = parseInt(match[1]);
    const key = `min-${years}`;
    if (!seenRanges.has(key)) {
      seenRanges.add(key);
      results.push({
        raw: match[0].trim(),
        minYears: years,
        maxYears: null,
        isMinimum: true,
        level: null,
      });
    }
  }

  // Pattern 3: "N+ years" or "N years of experience" (general)
  const generalPattern = /(\d+)\s*(\+)?\s*(?:years?|yrs?)\s*(?:of\s+)?(?:experience|exp(?:erience)?|in\s|with\s|of\s)/gi;
  while ((match = generalPattern.exec(normalized)) !== null) {
    const years = parseInt(match[1]);
    const hasPlus = !!match[2];
    const key = `gen-${years}-${hasPlus}`;
    if (!seenRanges.has(key)) {
      seenRanges.add(key);
      results.push({
        raw: match[0].trim(),
        minYears: years,
        maxYears: null,
        isMinimum: hasPlus,
        level: null,
      });
    }
  }

  // Pattern 4: Seniority level (no numeric years)
  const levelPattern = /\b(senior|junior|mid|entry)\s*[-–]?\s*level\b/gi;
  while ((match = levelPattern.exec(normalized)) !== null) {
    const level = match[1].toLowerCase();
    const key = `level-${level}`;
    if (!seenRanges.has(key)) {
      seenRanges.add(key);
      const impliedYears: Record<string, number> = {
        entry: 0,
        junior: 1,
        mid: 3,
        senior: 5,
      };
      results.push({
        raw: match[0].trim(),
        minYears: impliedYears[level] ?? 0,
        maxYears: null,
        isMinimum: false,
        level,
      });
    }
  }

  return results;
}

