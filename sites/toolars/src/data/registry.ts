export type ToolType = "traditional" | "ai" | "workflow";
export type ProcessingMode = "local" | "cloud" | "ai-consent";
export type PricingMode = "free" | "freemium" | "paid";
export type ToolSource = "vitalcalc" | "aixtral-lab" | "toolars";
export type ToolGroup = "General" | "VitalCalc" | "AI Developer Lab" | "Toolars";

export interface ToolDefinition {
  slug: string;
  name: string;
  description: string;
  category: string;
  group: ToolGroup;
  type: ToolType;
  processing: ProcessingMode[];
  pricing: PricingMode;
  tags: string[];
  source: ToolSource;
  accent: string;
  featured?: boolean;
  href: string;
  aboutHref: string;
}

export interface WorkflowDefinition {
  slug: string;
  title: string;
  description: string;
  category: string;
  steps: string[];
  estimatedMinutes: number;
  aiRequired: boolean;
  localSteps: number;
  runCount: string;
  href: string;
}

export interface CollectionDefinition {
  slug: string;
  title: string;
  description: string;
  curator: string;
  visibility: "official" | "public" | "team" | "private";
  toolSlugs: string[];
  workflowSlugs: string[];
  tags: string[];
  href: string;
}

export const sourceInventory = {
  vitalcalc: {
    rootToolPages: 86,
    roughCategories: {
      finance: 30,
      health: 36,
      other: 20
    }
  },
  aixtralLab: {
    totalTools: 92,
    categories: {
      developerTools: 37,
      frontendDesign: 15,
      textProductivity: 14,
      aiSecurity: 10,
      ragMcpAgent: 6,
      llmCost: 5,
      promptEngineering: 5
    }
  }
} as const;

export const categories = [
  { label: "All", count: 2643 },
  { label: "AI", count: 487 },
  { label: "AI Security", count: 92 },
  { label: "Developer", count: 578 },
  { label: "RAG / MCP / Agent", count: 61 },
  { label: "LLM Cost", count: 42 },
  { label: "Prompt Engineering", count: 73 },
  { label: "Frontend & Design", count: 121 },
  { label: "PDF", count: 189 },
  { label: "Image", count: 256 },
  { label: "Finance", count: 235 },
  { label: "Health", count: 124 },
  { label: "Productivity", count: 326 },
  { label: "Writing", count: 312 },
  { label: "Data", count: 164 }
];

const makeHref = (slug: string) => `/tools/${slug}`;

const tool = (
  definition: Omit<ToolDefinition, "href" | "aboutHref">
): ToolDefinition => ({
  ...definition,
  href: makeHref(definition.slug),
  aboutHref: `/tools/${definition.slug}/about`
});

export const tools: ToolDefinition[] = [
  tool({
    slug: "pdf-toolkit",
    name: "PDF Toolkit",
    description: "Merge, split, compress, convert, summarize, and export PDFs in one workspace.",
    category: "PDF",
    group: "General",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["PDF", "Merge", "Compress"],
    source: "toolars",
    accent: "red",
    featured: true
  }),
  tool({
    slug: "ai-pdf-summarizer",
    name: "AI PDF Summarizer",
    description: "Turn long PDFs into cited summaries, action items, and email drafts.",
    category: "PDF",
    group: "General",
    type: "ai",
    processing: ["cloud", "ai-consent"],
    pricing: "freemium",
    tags: ["PDF", "Summary", "AI"],
    source: "toolars",
    accent: "emerald",
    featured: true
  }),
  tool({
    slug: "pdf-merger",
    name: "PDF Merger",
    description: "Combine multiple PDFs into one file in seconds.",
    category: "PDF",
    group: "General",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["PDF", "Merge", "Organize"],
    source: "toolars",
    accent: "purple"
  }),
  tool({
    slug: "pdf-compressor",
    name: "PDF Compressor",
    description: "Reduce PDF size without losing visual quality.",
    category: "PDF",
    group: "General",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["PDF", "Compress", "Optimize"],
    source: "toolars",
    accent: "orange"
  }),
  tool({
    slug: "pdf-to-word",
    name: "PDF to Word",
    description: "Convert PDF files to editable Word documents.",
    category: "PDF",
    group: "General",
    type: "traditional",
    processing: ["cloud"],
    pricing: "freemium",
    tags: ["PDF", "Convert", "Word"],
    source: "toolars",
    accent: "blue"
  }),
  tool({
    slug: "extract-tables",
    name: "Extract Tables",
    description: "Extract tables from PDFs to CSV using AI.",
    category: "PDF",
    group: "General",
    type: "ai",
    processing: ["cloud", "ai-consent"],
    pricing: "freemium",
    tags: ["PDF", "Tables", "AI"],
    source: "toolars",
    accent: "green"
  }),
  tool({
    slug: "pdf-signer",
    name: "PDF Signer",
    description: "Add signatures to PDF files online.",
    category: "PDF",
    group: "General",
    type: "traditional",
    processing: ["cloud"],
    pricing: "freemium",
    tags: ["PDF", "Sign", "Legal"],
    source: "toolars",
    accent: "sky"
  }),
  tool({
    slug: "pdf-password-remover",
    name: "PDF Password Remover",
    description: "Remove password protection from PDF files you own.",
    category: "PDF",
    group: "General",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["PDF", "Unlock", "Security"],
    source: "toolars",
    accent: "violet"
  }),
  tool({
    slug: "ocr-scanner",
    name: "OCR Scanner",
    description: "Scan images and PDFs into editable text with OCR.",
    category: "PDF",
    group: "General",
    type: "ai",
    processing: ["cloud", "ai-consent"],
    pricing: "freemium",
    tags: ["PDF", "OCR", "Text"],
    source: "toolars",
    accent: "cyan"
  }),
  tool({
    slug: "pdf-translator",
    name: "PDF Translator",
    description: "Translate PDF content into 100+ languages with AI.",
    category: "PDF",
    group: "General",
    type: "ai",
    processing: ["cloud", "ai-consent"],
    pricing: "freemium",
    tags: ["PDF", "Translate", "AI"],
    source: "toolars",
    accent: "orange"
  }),
  tool({
    slug: "mortgage-calculator",
    name: "Mortgage Calculator",
    description: "Calculate payments, total interest, and amortization schedules.",
    category: "Finance",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Finance", "Loan", "Home"],
    source: "vitalcalc",
    accent: "green",
    featured: true
  }),
  tool({
    slug: "bmi-calculator",
    name: "BMI Calculator",
    description: "Calculate body mass index and health ranges locally.",
    category: "Health",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Health", "BMI", "Body"],
    source: "vitalcalc",
    accent: "teal"
  }),
  tool({
    slug: "compound-interest",
    name: "Compound Interest Calculator",
    description: "Model investment growth and recurring contributions.",
    category: "Finance",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Finance", "Investing", "Growth"],
    source: "vitalcalc",
    accent: "emerald"
  }),
  tool({
    slug: "loan-calculator",
    name: "Loan Calculator",
    description: "Calculate monthly payments, total interest, and payoff schedules for personal, auto, or student loans.",
    category: "Finance",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Finance", "Loan", "Payments"],
    source: "vitalcalc",
    accent: "sky"
  }),
  tool({
    slug: "bmr-calculator",
    name: "BMR Calculator",
    description: "Estimate basal metabolic rate from age, sex, height, and weight using the Mifflin-St Jeor formula.",
    category: "Health",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Health", "Metabolism", "Calories"],
    source: "vitalcalc",
    accent: "orange"
  }),
  tool({
    slug: "water-intake",
    name: "Water Intake Calculator",
    description: "Estimate daily hydration needs from body and activity data.",
    category: "Health",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Health", "Hydration", "Daily"],
    source: "vitalcalc",
    accent: "cyan"
  }),
  tool({
    slug: "retirement-calculator",
    name: "Retirement Calculator",
    description: "Estimate how much you need to save for retirement and whether you are on track.",
    category: "Finance",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Finance", "Retirement", "Savings"],
    source: "vitalcalc",
    accent: "indigo"
  }),
  tool({
    slug: "debt-payoff",
    name: "Debt Payoff Calculator",
    description: "Compare avalanche and snowball payoff plans for credit cards, loans, and other debt.",
    category: "Finance",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Finance", "Debt", "Payoff"],
    source: "vitalcalc",
    accent: "orange"
  }),
  tool({
    slug: "roi-calculator",
    name: "ROI Calculator",
    description: "Calculate return on investment percentage and profit for any investment scenario.",
    category: "Finance",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Finance", "ROI", "Investing"],
    source: "vitalcalc",
    accent: "amber"
  }),
  tool({
    slug: "tdee-calculator",
    name: "TDEE Calculator",
    description: "Calculate total daily energy expenditure from BMR and activity level.",
    category: "Health",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Health", "Calories", "Energy"],
    source: "vitalcalc",
    accent: "blue"
  }),
  tool({
    slug: "body-fat-calculator",
    name: "Body Fat Calculator",
    description: "Estimate body fat percentage from body measurements using the US Navy method.",
    category: "Health",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Health", "Body", "Fitness"],
    source: "vitalcalc",
    accent: "pink"
  }),
  tool({
    slug: "protein-calculator",
    name: "Protein Calculator",
    description: "Calculate daily protein needs from weight, activity level, and fitness goals.",
    category: "Health",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Health", "Protein", "Nutrition"],
    source: "vitalcalc",
    accent: "lime"
  }),
  tool({
    slug: "income-tax",
    name: "Income Tax Calculator",
    description: "Estimate take-home pay from gross income, deductions, and tax assumptions.",
    category: "Finance",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Finance", "Tax", "Income"],
    source: "vitalcalc",
    accent: "rose"
  }),
  tool({
    slug: "fire-calculator",
    name: "FIRE Calculator",
    description: "Estimate the savings target needed to reach financial independence and retire early.",
    category: "Finance",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Finance", "FIRE", "Retirement"],
    source: "vitalcalc",
    accent: "red"
  }),
  tool({
    slug: "discount-calculator",
    name: "Discount Calculator",
    description: "Calculate sale price, discount amount, tax, and final checkout savings.",
    category: "Finance",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Finance", "Discount", "Shopping"],
    source: "vitalcalc",
    accent: "violet"
  }),
  tool({
    slug: "heart-rate-zone",
    name: "Heart Rate Zone Calculator",
    description: "Calculate target heart rate zones for training intensity and recovery planning.",
    category: "Health",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Health", "Fitness", "Heart rate"],
    source: "vitalcalc",
    accent: "red"
  }),
  tool({
    slug: "sleep-calculator",
    name: "Sleep Calculator",
    description: "Calculate bedtime and wake-up windows from sleep cycles and schedule goals.",
    category: "Health",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Health", "Sleep", "Wellness"],
    source: "vitalcalc",
    accent: "indigo"
  }),
  tool({
    slug: "ideal-weight-calculator",
    name: "Ideal Weight Calculator",
    description: "Estimate healthy weight ranges from height, sex, and reference formulas.",
    category: "Health",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Health", "Weight", "Body"],
    source: "vitalcalc",
    accent: "teal"
  }),
  tool({
    slug: "car-loan",
    name: "Car Loan Calculator",
    description: "Calculate monthly payments, total interest, and true vehicle financing cost.",
    category: "Finance",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Finance", "Auto", "Loan"],
    source: "vitalcalc",
    accent: "blue"
  }),
  tool({
    slug: "rent-vs-buy",
    name: "Rent vs Buy Calculator",
    description: "Compare renting and buying costs, break-even timing, and housing assumptions.",
    category: "Finance",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Finance", "Housing", "Compare"],
    source: "vitalcalc",
    accent: "emerald"
  }),
  tool({
    slug: "home-affordability-calculator",
    name: "Home Affordability Calculator",
    description: "Estimate affordable home price from income, debt, down payment, and rates.",
    category: "Finance",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Finance", "Home", "Affordability"],
    source: "vitalcalc",
    accent: "green"
  }),
  tool({
    slug: "waist-hip-ratio",
    name: "Waist-Hip Ratio Calculator",
    description: "Calculate waist-to-hip ratio and reference risk categories from body measurements.",
    category: "Health",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Health", "Body", "Measurement"],
    source: "vitalcalc",
    accent: "orange"
  }),
  tool({
    slug: "blood-pressure",
    name: "Blood Pressure Calculator",
    description: "Classify blood pressure ranges from systolic and diastolic readings.",
    category: "Health",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Health", "Blood pressure", "Reference"],
    source: "vitalcalc",
    accent: "rose"
  }),
  tool({
    slug: "child-growth",
    name: "Child Growth Calculator",
    description: "Estimate child BMI percentile context from age, sex, height, and weight inputs.",
    category: "Health",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Health", "Child", "Growth"],
    source: "vitalcalc",
    accent: "cyan"
  }),
  tool({
    slug: "student-loan-calculator",
    name: "Student Loan Calculator",
    description: "Compare student loan payments, interest, and repayment timeline assumptions.",
    category: "Finance",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Finance", "Student loan", "Debt"],
    source: "vitalcalc",
    accent: "purple"
  }),
  tool({
    slug: "apy-calculator",
    name: "APY Calculator",
    description: "Compare annual percentage yield across rates, balances, and compounding frequency.",
    category: "Finance",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Finance", "APY", "Savings"],
    source: "vitalcalc",
    accent: "emerald"
  }),
  tool({
    slug: "rule-of-72",
    name: "Rule of 72 Calculator",
    description: "Estimate how long it takes money to double from an annual return rate.",
    category: "Finance",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Finance", "Investing", "Growth"],
    source: "vitalcalc",
    accent: "amber"
  }),
  tool({
    slug: "calorie-deficit",
    name: "Calorie Deficit Calculator",
    description: "Estimate daily calorie targets for weight change from TDEE and goal pace.",
    category: "Health",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Health", "Calories", "Nutrition"],
    source: "vitalcalc",
    accent: "orange"
  }),
  tool({
    slug: "macro-calculator",
    name: "Macro Calculator",
    description: "Calculate protein, carbohydrate, and fat targets from calories and goals.",
    category: "Health",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Health", "Macros", "Nutrition"],
    source: "vitalcalc",
    accent: "lime"
  }),
  tool({
    slug: "lean-body-mass",
    name: "Lean Body Mass Calculator",
    description: "Estimate lean body mass from body weight and body fat assumptions.",
    category: "Health",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Health", "Body", "Fitness"],
    source: "vitalcalc",
    accent: "teal"
  }),
  tool({
    slug: "emergency-fund",
    name: "Emergency Fund Calculator",
    description: "Estimate emergency savings targets from monthly expenses and coverage months.",
    category: "Finance",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Finance", "Savings", "Emergency fund"],
    source: "vitalcalc",
    accent: "amber"
  }),
  tool({
    slug: "savings-goal",
    name: "Savings Goal Calculator",
    description: "Calculate how long it takes to reach a savings target from current and monthly savings.",
    category: "Finance",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Finance", "Savings", "Goal"],
    source: "vitalcalc",
    accent: "fuchsia"
  }),
  tool({
    slug: "dti-calculator",
    name: "DTI Calculator",
    description: "Estimate front-end and back-end debt-to-income ratios from income and monthly debts.",
    category: "Finance",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Finance", "Debt", "Mortgage"],
    source: "vitalcalc",
    accent: "cyan"
  }),
  tool({
    slug: "net-worth-calculator",
    name: "Net Worth Calculator",
    description: "Calculate assets minus liabilities to track personal financial position.",
    category: "Finance",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Finance", "Assets", "Planning"],
    source: "vitalcalc",
    accent: "sky"
  }),
  tool({
    slug: "budget-rule",
    name: "50/30/20 Budget Calculator",
    description: "Split monthly income into needs, wants, savings, and debt repayment targets.",
    category: "Finance",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Finance", "Budget", "Savings"],
    source: "vitalcalc",
    accent: "green"
  }),
  tool({
    slug: "side-income-tax",
    name: "Side Income Tax Calculator",
    description: "Estimate freelancer side income tax, self-employment tax, and quarterly payments.",
    category: "Finance",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Finance", "Tax", "Freelance"],
    source: "vitalcalc",
    accent: "blue"
  }),
  tool({
    slug: "intermittent-fasting",
    name: "Intermittent Fasting Calculator",
    description: "Calculate eating and fasting windows for 16:8, 18:6, 20:4, OMAD, and related protocols.",
    category: "Health",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Health", "Fasting", "Nutrition"],
    source: "vitalcalc",
    accent: "green"
  }),
  tool({
    slug: "creatine-calculator",
    name: "Creatine Calculator",
    description: "Estimate creatine monohydrate loading and maintenance doses from body weight and training context.",
    category: "Health",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Health", "Fitness", "Supplement"],
    source: "vitalcalc",
    accent: "amber"
  }),
  tool({
    slug: "vo2-max",
    name: "VO2 Max Calculator",
    description: "Estimate maximum oxygen uptake from Cooper test distance or resting heart rate assumptions.",
    category: "Health",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Health", "Cardio", "Fitness"],
    source: "vitalcalc",
    accent: "orange"
  }),
  tool({
    slug: "biological-age",
    name: "Biological Age Calculator",
    description: "Estimate biological age from BMI, blood pressure, exercise, sleep, and lifestyle factors.",
    category: "Health",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Health", "Lifestyle", "Reference"],
    source: "vitalcalc",
    accent: "cyan"
  }),
  tool({
    slug: "glycemic-load",
    name: "Glycemic Load Calculator",
    description: "Calculate glycemic load from a food's glycemic index, carbohydrate content, and serving size.",
    category: "Health",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Health", "Nutrition", "Glycemic load"],
    source: "vitalcalc",
    accent: "lime"
  }),
  tool({
    slug: "30-30-30-method",
    name: "30-30-30 Morning Method",
    description: "Estimate a morning protein target and low-intensity exercise burn for the 30-30-30 routine.",
    category: "Health",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Health", "Protein", "Routine"],
    source: "vitalcalc",
    accent: "teal"
  }),
  tool({
    slug: "tip-calculator",
    name: "Tip Calculator",
    description: "Calculate tip amount, total bill, and per-person split for restaurants, delivery, and group outings.",
    category: "Finance",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Finance", "Tip", "Split"],
    source: "vitalcalc",
    accent: "orange"
  }),
  tool({
    slug: "bill-split-calculator",
    name: "Bill Split Calculator",
    description: "Split group bills equally or by item with tips, taxes, and per-person breakdowns.",
    category: "Finance",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Finance", "Bill split", "Group"],
    source: "vitalcalc",
    accent: "teal"
  }),
  tool({
    slug: "unit-converter",
    name: "Unit Converter",
    description: "Convert length, weight, temperature, area, volume, speed, and data storage units.",
    category: "Data",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Data", "Units", "Conversion"],
    source: "vitalcalc",
    accent: "sky"
  }),
  tool({
    slug: "hourly-to-salary",
    name: "Hourly to Salary Calculator",
    description: "Convert hourly wage into annual, monthly, and weekly salary with overtime assumptions.",
    category: "Finance",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Finance", "Salary", "Work"],
    source: "vitalcalc",
    accent: "blue"
  }),
  tool({
    slug: "inflation-calculator",
    name: "Inflation Calculator",
    description: "Estimate future purchasing power and cumulative inflation from amount, rate, and years.",
    category: "Finance",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Finance", "Inflation", "Planning"],
    source: "vitalcalc",
    accent: "cyan"
  }),
  tool({
    slug: "habit-cost",
    name: "Habit Cost Calculator",
    description: "Estimate long-term spending and opportunity cost for repeated daily or weekly habits.",
    category: "Finance",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Finance", "Habits", "Opportunity cost"],
    source: "vitalcalc",
    accent: "rose"
  }),
  tool({
    slug: "caffeine-calculator",
    name: "Caffeine Safe Limit Calculator",
    description: "Calculate daily caffeine allowance from weight, pregnancy status, and common drink intake.",
    category: "Health",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Health", "Caffeine", "Sleep"],
    source: "vitalcalc",
    accent: "amber"
  }),
  tool({
    slug: "alcohol-metabolism",
    name: "Alcohol Metabolism Calculator",
    description: "Estimate BAC and alcohol metabolism time from drinks, weight, sex context, and drinking duration.",
    category: "Health",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Health", "BAC", "Reference"],
    source: "vitalcalc",
    accent: "orange"
  }),
  tool({
    slug: "blood-sugar-calculator",
    name: "Blood Sugar / A1C Calculator",
    description: "Convert fasting glucose, A1C, and estimated average glucose with reference risk bands.",
    category: "Health",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Health", "A1C", "Glucose"],
    source: "vitalcalc",
    accent: "rose"
  }),
  tool({
    slug: "drink-calories",
    name: "Drink Calories Calculator",
    description: "Calculate calories and sugar in boba tea, coffee, juice, alcohol, and other beverages.",
    category: "Health",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Health", "Drinks", "Calories"],
    source: "vitalcalc",
    accent: "pink"
  }),
  tool({
    slug: "fiber-intake",
    name: "Fiber Intake Calculator",
    description: "Estimate daily fiber recommendations from weight, age, and sex context with food-source guidance.",
    category: "Health",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Health", "Nutrition", "Fiber"],
    source: "vitalcalc",
    accent: "green"
  }),
  tool({
    slug: "steps-to-calories",
    name: "Steps to Calories Calculator",
    description: "Estimate calories burned from steps, weight, walking speed, and stride assumptions.",
    category: "Health",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Health", "Walking", "Calories"],
    source: "vitalcalc",
    accent: "cyan"
  }),
  tool({
    slug: "currency-converter",
    name: "Currency Converter",
    description: "Convert between major currencies with manually entered exchange rates and reference-rate context.",
    category: "Finance",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Finance", "Currency", "Exchange rate"],
    source: "vitalcalc",
    accent: "lime"
  }),
  tool({
    slug: "percentage-calculator",
    name: "Percentage Calculator",
    description: "Calculate percentages, percentage increase or decrease, and what percent one number is of another.",
    category: "Data",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Data", "Percent", "Calculation"],
    source: "vitalcalc",
    accent: "rose"
  }),
  tool({
    slug: "stock-average",
    name: "Stock Average Calculator",
    description: "Calculate average cost per share, total cost basis, and breakeven after multiple purchases.",
    category: "Finance",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Finance", "Stocks", "Cost basis"],
    source: "vitalcalc",
    accent: "amber"
  }),
  tool({
    slug: "credit-card-apr",
    name: "Credit Card APR Calculator",
    description: "Reveal the true annual percentage rate behind credit card installment monthly fees.",
    category: "Finance",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Finance", "Credit", "APR"],
    source: "vitalcalc",
    accent: "pink"
  }),
  tool({
    slug: "investment-fee",
    name: "Investment Fee Calculator",
    description: "Estimate how annual management fees erode long-term investment returns.",
    category: "Finance",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Finance", "Investing", "Fees"],
    source: "vitalcalc",
    accent: "fuchsia"
  }),
  tool({
    slug: "investment-goal",
    name: "Investment Goal Calculator",
    description: "Calculate the monthly investment needed to reach a financial target over time.",
    category: "Finance",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Finance", "Investing", "Goal"],
    source: "vitalcalc",
    accent: "violet"
  }),
  tool({
    slug: "credit-score-simulator",
    name: "Credit Score Simulator",
    description: "Simulate how debt payoff, new credit, missed payments, and utilization changes may affect a credit score.",
    category: "Finance",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Finance", "Credit", "Score"],
    source: "vitalcalc",
    accent: "blue"
  }),
  tool({
    slug: "crypto-tax",
    name: "Crypto Tax Calculator",
    description: "Estimate crypto cost basis, realized gains or losses, and unrealized PnL from buy and sell records.",
    category: "Finance",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Finance", "Crypto", "Tax"],
    source: "vitalcalc",
    accent: "sky"
  }),
  tool({
    slug: "freelance-rate",
    name: "Freelance Rate Calculator",
    description: "Calculate hourly, daily, and project rates from income goals, billable hours, taxes, and operating costs.",
    category: "Finance",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Finance", "Freelance", "Pricing"],
    source: "vitalcalc",
    accent: "emerald"
  }),
  tool({
    slug: "subscription-audit",
    name: "Subscription Audit Calculator",
    description: "Track recurring subscriptions, normalize monthly cost, and identify duplicate or unused services.",
    category: "Finance",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Finance", "Subscriptions", "Budget"],
    source: "vitalcalc",
    accent: "orange"
  }),
  tool({
    slug: "savings-challenge",
    name: "Savings Challenge Calculator",
    description: "Generate 52-week, envelope, no-spend month, or reverse savings plans for habit building.",
    category: "Finance",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Finance", "Savings", "Challenge"],
    source: "vitalcalc",
    accent: "teal"
  }),
  tool({
    slug: "city-cost-comparison",
    name: "City Cost Comparison",
    description: "Compare rent, food, transport, income, and surplus between two cities for relocation planning.",
    category: "Finance",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Finance", "Relocation", "Cost of living"],
    source: "vitalcalc",
    accent: "cyan"
  }),
  tool({
    slug: "social-insurance-calculator",
    name: "China Social Insurance Calculator",
    description: "Calculate employee and employer five-insurance plus housing-fund contributions from pre-tax salary.",
    category: "Finance",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Finance", "Payroll", "Social insurance"],
    source: "vitalcalc",
    accent: "cyan"
  }),
  tool({
    slug: "dividend-reinvestment",
    name: "Dividend Reinvestment Calculator",
    description: "Estimate DRIP growth, total dividends, tax drag, and reinvestment impact over long holding periods.",
    category: "Finance",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Finance", "Dividend", "DRIP"],
    source: "vitalcalc",
    accent: "green"
  }),
  tool({
    slug: "mortgage-refinance-calculator",
    name: "Mortgage Refinance Calculator",
    description: "Compare current and new mortgage terms to estimate monthly savings, interest savings, and break-even time.",
    category: "Finance",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Finance", "Mortgage", "Refinance"],
    source: "vitalcalc",
    accent: "blue"
  }),
  tool({
    slug: "coast-fire",
    name: "Coast FIRE Calculator",
    description: "Estimate the portfolio needed today to stop saving and coast to a future retirement target.",
    category: "Finance",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Finance", "FIRE", "Retirement"],
    source: "vitalcalc",
    accent: "sky"
  }),
  tool({
    slug: "sip-calculator",
    name: "Fund SIP Calculator",
    description: "Project systematic investment plan growth from monthly investment, expected return, duration, and principal.",
    category: "Finance",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Finance", "Investing", "SIP"],
    source: "vitalcalc",
    accent: "emerald"
  }),
  tool({
    slug: "smoke-free",
    name: "Quit Smoking Tracker",
    description: "Track smoke-free days, money saved, cigarettes avoided, life extension, and recovery milestones.",
    category: "Health",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Health", "Smoking", "Milestones"],
    source: "vitalcalc",
    accent: "green"
  }),
  tool({
    slug: "adhd-screener",
    name: "ADHD Adult Screener ASRS-v1.1",
    description: "Screen adult ADHD symptoms with the WHO ASRS-v1.1 6-item short form for reference only.",
    category: "Health",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Health", "ADHD", "Screening"],
    source: "vitalcalc",
    accent: "rose"
  }),
  tool({
    slug: "burnout-assessment",
    name: "Burnout Assessment",
    description: "Assess work burnout risk with a 10-item short form based on core MBI and OLBI dimensions.",
    category: "Health",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Health", "Burnout", "Work"],
    source: "vitalcalc",
    accent: "orange"
  }),
  tool({
    slug: "gad7-anxiety",
    name: "GAD-7 Anxiety Screening",
    description: "Estimate anxiety symptom severity over the last two weeks with the 7-question GAD-7 screener.",
    category: "Health",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Health", "Anxiety", "Screening"],
    source: "vitalcalc",
    accent: "sky"
  }),
  tool({
    slug: "phq9-depression",
    name: "PHQ-9 Depression Screening",
    description: "Estimate depression symptom severity over the last two weeks with the 9-question PHQ-9 screener.",
    category: "Health",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Health", "Depression", "Screening"],
    source: "vitalcalc",
    accent: "purple"
  }),
  tool({
    slug: "pss10-stress",
    name: "PSS-10 Perceived Stress Scale",
    description: "Assess perceived stress over the last month with the 10-question Cohen PSS-10 scale.",
    category: "Health",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Health", "Stress", "Screening"],
    source: "vitalcalc",
    accent: "amber"
  }),
  tool({
    slug: "glp1-eligibility",
    name: "GLP-1 Eligibility Check",
    description: "Check common BMI and comorbidity criteria for GLP-1 medication discussions with a clinician.",
    category: "Health",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Health", "GLP-1", "Eligibility"],
    source: "vitalcalc",
    accent: "emerald"
  }),
  tool({
    slug: "body-recomposition",
    name: "Body Recomposition Calculator",
    description: "Set simultaneous fat-loss and muscle-gain goals with TDEE, calorie target, and macro split estimates.",
    category: "Health",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Health", "Body composition", "Macros"],
    source: "vitalcalc",
    accent: "orange"
  }),
  tool({
    slug: "glp1-nutrition",
    name: "GLP-1 Nutrition Calculator",
    description: "Estimate calorie floor, protein target, fiber goal, and hydration needs while using GLP-1 medication.",
    category: "Health",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Health", "GLP-1", "Nutrition"],
    source: "vitalcalc",
    accent: "emerald"
  }),
  tool({
    slug: "homa-ir",
    name: "HOMA-IR Calculator",
    description: "Estimate insulin resistance from fasting glucose and fasting insulin values for reference-only review.",
    category: "Health",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Health", "Insulin", "Metabolic"],
    source: "vitalcalc",
    accent: "red"
  }),
  tool({
    slug: "one-rep-max",
    name: "1RM Calculator",
    description: "Estimate one-repetition maximum and percentage-based working sets from lifted weight and reps.",
    category: "Health",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Fitness", "Strength", "Training"],
    source: "vitalcalc",
    accent: "rose"
  }),
  tool({
    slug: "ovulation-calculator",
    name: "Ovulation Calculator",
    description: "Predict ovulation day, fertile window, next period, and cycle milestones from last period date.",
    category: "Health",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Health", "Fertility", "Cycle"],
    source: "vitalcalc",
    accent: "pink"
  }),
  tool({
    slug: "pregnancy-due-date",
    name: "Pregnancy Due Date Calculator",
    description: "Estimate due date, gestational week, trimester, and days remaining from last menstrual period.",
    category: "Health",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Health", "Pregnancy", "Due date"],
    source: "vitalcalc",
    accent: "pink"
  }),
  tool({
    slug: "running-pace",
    name: "Running Pace Calculator",
    description: "Calculate race pace, speed, track splits, and equivalent performance estimates from distance and time.",
    category: "Health",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Fitness", "Running", "Pace"],
    source: "vitalcalc",
    accent: "blue"
  }),
  tool({
    slug: "testosterone-calculator",
    name: "Testosterone Calculator",
    description: "Calculate free and bioavailable testosterone from total testosterone, SHBG, albumin, and gender.",
    category: "Health",
    group: "VitalCalc",
    type: "traditional",
    processing: ["local"],
    pricing: "free",
    tags: ["Health", "Hormones", "Reference"],
    source: "vitalcalc",
    accent: "indigo"
  }),
  ...[
    ["json-repair", "JSON Repair", "Fix malformed LLM JSON output, trailing commas, quotes, and arrays.", "AI Security", "traditional", ["local"], "free", ["JSON", "AI Security", "Local"], "yellow", true],
    ["prompt-injection-scanner", "Prompt Injection Scanner", "Scan prompts for jailbreaks, instruction overrides, and hidden payloads.", "AI Security", "ai", ["local", "ai-consent"], "freemium", ["Prompt", "Security", "AI"], "rose", true],
    ["pii-scanner", "PII Scanner", "Detect emails, phone numbers, IDs, and sensitive entities before AI upload.", "AI Security", "traditional", ["local"], "free", ["PII", "Privacy", "Local"], "purple", false],
    ["hallucination-checker", "Hallucination Checker", "Compare claims against sources and flag unsupported output.", "AI Security", "ai", ["cloud", "ai-consent"], "freemium", ["Evidence", "Safety", "AI"], "green", false],
    ["schema-validator", "Schema Validator", "Validate JSON schema and function-calling payloads before production.", "Developer", "traditional", ["local"], "free", ["Schema", "JSON", "Validation"], "blue", false],
    ["llm-cost-calculator", "LLM Cost Calculator", "Estimate token cost across providers, models, context windows, and traffic.", "LLM Cost", "traditional", ["local"], "free", ["Cost", "Tokens", "Models"], "emerald", true],
    ["model-comparator", "Model Comparator", "Compare model price, latency, context, and fit for a workload.", "LLM Cost", "traditional", ["local"], "freemium", ["Models", "Cost", "Latency"], "indigo", false],
    ["context-window", "Context Window Visualizer", "See how prompt, retrieval, tools, and output fit into context.", "LLM Cost", "traditional", ["local"], "free", ["Context", "Tokens", "RAG"], "teal", false],
    ["token-budget-planner", "Token Budget Planner", "Plan context allocation across system, user, retrieval, tools, and output.", "LLM Cost", "traditional", ["local"], "free", ["Tokens", "Planning", "LLM"], "cyan", false],
    ["mcp-server-builder", "MCP Server Builder", "Build manifests, tool schemas, prompts, resources, and launch docs.", "RAG / MCP / Agent", "traditional", ["local"], "freemium", ["MCP", "Agent", "Tools"], "violet", true],
    ["mcp-tester", "MCP Tester", "Validate MCP manifests, sample payloads, and tool response contracts.", "RAG / MCP / Agent", "traditional", ["local"], "freemium", ["MCP", "Testing", "Payload"], "blue", false],
    ["agent-workflow-builder", "Agent Workflow Builder", "Map multi-agent steps, tools, handoffs, and review gates.", "RAG / MCP / Agent", "workflow", ["local"], "freemium", ["Agent", "Workflow", "Review"], "green", false],
    ["rag-eval-bench", "RAG Eval Bench", "Create retrieval evaluation sets and compare grounded answer quality.", "RAG / MCP / Agent", "ai", ["cloud", "ai-consent"], "freemium", ["RAG", "Eval", "AI"], "orange", false],
    ["prompt-templates", "Prompt Templates", "Browse production prompt structures for common AI tasks.", "Prompt Engineering", "traditional", ["local"], "free", ["Prompt", "Templates", "AI"], "amber", false],
    ["function-call-builder", "Function Call Builder", "Turn API payloads into tool schemas and function-calling specs.", "Prompt Engineering", "traditional", ["local"], "free", ["Function", "Schema", "API"], "pink", false],
    ["structured-output-formatter", "Structured Output Formatter", "Normalize model output into typed JSON response formats.", "Prompt Engineering", "traditional", ["local"], "free", ["Output", "JSON", "Schema"], "lime", false],
    ["vision-prompt-builder", "Vision Prompt Builder", "Draft multimodal prompts with camera, crop, and object instructions.", "Prompt Engineering", "ai", ["cloud", "ai-consent"], "freemium", ["Vision", "Prompt", "AI"], "sky", false],
    ["synthetic-dataset-generator", "Synthetic Dataset Generator", "Generate structured sample rows for testing apps and prompts.", "Developer", "ai", ["cloud", "ai-consent"], "freemium", ["Dataset", "Testing", "AI"], "fuchsia", false],
    ["json-formatter", "JSON Formatter", "Format, validate, and beautify JSON data.", "Developer", "traditional", ["local"], "free", ["JSON", "Format", "Validate"], "slate", false],
    ["json-tree-viewer", "JSON Tree Viewer", "Inspect nested JSON with collapsible tree views.", "Developer", "traditional", ["local"], "free", ["JSON", "Tree", "Inspect"], "blue", false],
    ["json-path-tester", "JSON Path Tester", "Test JSONPath expressions against sample payloads.", "Developer", "traditional", ["local"], "free", ["JSONPath", "Query", "JSON"], "indigo", false],
    ["css-gradient-generator", "CSS Gradient Generator", "Create implementation-ready gradients for UI surfaces.", "Frontend & Design", "traditional", ["local"], "free", ["CSS", "Gradient", "Design"], "orange", false]
  ].map(([slug, name, description, category, type, processing, pricing, tags, accent, featured]) =>
    tool({
      slug: slug as string,
      name: name as string,
      description: description as string,
      category: category as string,
      group: "AI Developer Lab",
      type: type as ToolType,
      processing: processing as ProcessingMode[],
      pricing: pricing as PricingMode,
      tags: tags as string[],
      source: "aixtral-lab",
      accent: accent as string,
      featured: Boolean(featured)
    })
  )
];

export const workflows: WorkflowDefinition[] = [
  {
    slug: "pdf-summary",
    title: "Turn PDF into summary",
    description: "Extract PDF content, summarize with AI consent, and export key points.",
    category: "PDF",
    steps: ["Extract content", "AI summarize", "Export and share"],
    estimatedMinutes: 4,
    aiRequired: true,
    localSteps: 1,
    runCount: "+1,240",
    href: "/workflows/pdf-summary"
  },
  {
    slug: "ai-prompt-hardening",
    title: "AI Prompt Hardening",
    description: "Scan, redact, and strengthen prompt surfaces before launch.",
    category: "AI Security",
    steps: ["Scan injection", "Detect PII", "Review risks", "Export report"],
    estimatedMinutes: 4,
    aiRequired: true,
    localSteps: 2,
    runCount: "+764",
    href: "/workflows/ai-prompt-hardening"
  },
  {
    slug: "llm-cost-review",
    title: "LLM Cost Review",
    description: "Estimate monthly model spend and compare launch options.",
    category: "LLM Cost",
    steps: ["Estimate tokens", "Compare models", "Review budget", "Export plan"],
    estimatedMinutes: 5,
    aiRequired: false,
    localSteps: 4,
    runCount: "+689",
    href: "/workflows/llm-cost-review"
  },
  {
    slug: "mcp-tool-launch",
    title: "MCP Tool Launch",
    description: "Build manifest, test payloads, and ship MCP docs.",
    category: "RAG / MCP / Agent",
    steps: ["Define tools", "Build manifest", "Run MCP tests", "Export docs"],
    estimatedMinutes: 8,
    aiRequired: false,
    localSteps: 4,
    runCount: "+534",
    href: "/workflows/mcp-tool-launch"
  }
];

export const collections: CollectionDefinition[] = [
  {
    slug: "pdf-ops-kit",
    title: "PDF Ops Kit",
    description: "Local PDF operations plus consent-gated AI summaries.",
    curator: "Toolars",
    visibility: "official",
    toolSlugs: ["pdf-toolkit", "pdf-merger", "pdf-compressor", "ai-pdf-summarizer"],
    workflowSlugs: ["pdf-summary"],
    tags: ["PDF", "Local", "AI"],
    href: "/collections/pdf-ops-kit"
  },
  {
    slug: "ai-developer-lab",
    title: "AI Developer Lab",
    description: "Security, cost, prompt, RAG, MCP, and agent tools from the Aixtral Lab inventory.",
    curator: "Toolars",
    visibility: "official",
    toolSlugs: ["json-repair", "prompt-injection-scanner", "llm-cost-calculator", "mcp-server-builder"],
    workflowSlugs: ["ai-prompt-hardening", "llm-cost-review", "mcp-tool-launch"],
    tags: ["AI Security", "MCP", "LLM Cost"],
    href: "/collections/ai-developer-lab"
  }
];

export const featuredTools = tools.filter((item) => item.featured);
export const pdfTools = tools.filter((item) => item.category === "PDF");
export const aiDeveloperLabTools = tools.filter((item) => item.group === "AI Developer Lab");

export function getToolsByGroup(group: ToolGroup): ToolDefinition[] {
  return tools.filter((item) => item.group === group);
}

export function getToolsByCategory(category: string): ToolDefinition[] {
  return tools.filter((item) => item.category === category);
}

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return tools.find((item) => item.slug === slug);
}
