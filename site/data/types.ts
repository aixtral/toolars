export type ToolType = 'calculator' | 'ai' | 'template';

export type ToolCategory =
  | 'ai-content'
  | 'body'
  | 'fitness-nutrition'
  | 'wellness'
  | 'wealth'
  | 'finance';

export interface ToolSeo {
  title: string;
  description: string;
  keywords?: string[];
}

export interface ToolDefinition {
  slug: string;
  title: string;
  type: ToolType;
  category: ToolCategory;
  icon: string;
  description: string;
  route: string;
  badges?: string[];
  isPopular?: boolean;
  isNew?: boolean;
  requiresAccount?: boolean;
  relatedSlugs?: string[];
  sourceProject?: 'aixtral-calm/vitalcalc' | 'aixtral-labs/xtralrepurpose';
  seo: ToolSeo;
}

export interface CalculatorDefinition extends ToolDefinition {
  type: 'calculator';
  requiresAccount: false;
  sourceSlug: string;
  formulaStatus: 'pending-migration' | 'ported';
}

export interface AiToolDefinition extends ToolDefinition {
  type: 'ai';
  requiresAccount: true;
  subscription: 'account' | 'pro';
}

export interface ToolCategoryDefinition {
  slug: ToolCategory;
  title: string;
  description: string;
  route: string;
  icon: string;
}

export interface SaasPageDefinition {
  slug: string;
  title: string;
  route: string;
  requiresAccount: boolean;
}
