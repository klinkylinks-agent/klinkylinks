// src/types/agentTypes.ts
// This file defines TypeScript types for KlinkyLinks AI agents, ensuring modularity, scorecard integration, and autonomous operations.
// All types enforce blueprint principles: cognitive, API-driven, self-optimizing, with full auditability and no assumptions.
// Generated as production-ready; no placeholders—use directly in agent modules, APIs, and dashboards.

export enum AgentType {
  MasterOrchestrator = 'MasterOrchestrator',
  StealthCrawler = 'StealthCrawler',
  PerceptualMatcher = 'PerceptualMatcher',
  DMCATakedown = 'DMCATakedown',
  UXOnboardingOptimizer = 'UXOnboardingOptimizer',
  GrowthRevenue = 'GrowthRevenue',
  ComplianceEthics = 'ComplianceEthics',
}

export enum AgentStatus {
  Active = 'active',
  Idle = 'idle',
  Error = 'error',
  Scaling = 'scaling',
  Retired = 'retired',
}

export type Domain =
  | 'OverrideGovernance'
  | 'EthicalIntent'
  | 'StripeRevenue'
  | 'UXSentiment'
  | 'ConversionVelocity'
  | 'Compliance'
  | 'CloneIPDefense'
  | 'IdentityContinuity'
  | 'SurgeGovernance'
  | 'FrugalityIndex'
  | 'SecurityResilience'
  | 'DataIntegrity'
  | 'AccessibilityInclusion'
  | 'Sustainability'
  | 'GrowthQuality'
  | 'ThirdPartyHealth'
  | 'HumanTransparency';

export type AdvancedModule =
  | 'MoralTradeoffTracker'
  | 'DecisionLatencyLogger'
  | 'RevenueDignityIndex'
  | 'StripeSurgePredictor'
  | 'RegretHeatmap'
  | 'SecurityPenetration'
  | 'DataFreshness';

export interface Scorecard {
  domainScores: Record<Domain, number>; // Quantitative scores (0-10) per domain, calculated from live data/formulas.
  advancedModuleScores: Record<AdvancedModule, number>; // Scores for advanced modules, e.g., regret <0.5.
  overallScore: number; // Aggregated score; agents auto-correct if <8.
  lastUpdated: Date; // Timestamp for real-time scoring.
  actionsTaken: string[]; // Logged corrective/creative actions (e.g., 'Invented new fallback strategy').
  trendline: number[]; // Historical scores for audit and learning.
}

export interface AgentLogEntry {
  timestamp: Date;
  action: string; // e.g., 'Deployed new scanner API'.
  rationale: string; // Explainable decision, per blueprint.
  outcome: 'success' | 'failure' | 'escalated'; // Traceable results.
  scorecardImpact: Partial<Record<Domain | AdvancedModule, number>>; // Delta from action.
}

export interface BaseAgent {
  type: AgentType;
  id: string; // Unique identifier, e.g., UUID for scalability.
  status: AgentStatus;
  description: string; // Blueprint-defined role, e.g., 'Manages all agents and CI/CD'.
  scorecard: Scorecard; // Embedded self-scoring; updated via live APIs/logs.
  logs: AgentLogEntry[]; // Audit trail; exported to central dashboard/API.
  apiEndpoints: string[]; // e.g., ['/api/agents/orchestrator/deploy'] for modularity.
  learningLibrary: Record<string, string>; // Key-value for adaptations, e.g., {'newTactic': 'Optimized UX flow'}.
}

export interface MasterOrchestratorAgent extends BaseAgent {
  type: AgentType.MasterOrchestrator;
  managedAgents: string[]; // IDs of child agents for dynamic management.
  ciCdTriggers: string[]; // e.g., ['github/webhook/deploy'] for automation.
}

export interface StealthCrawlerAgent extends BaseAgent {
  type: AgentType.StealthCrawler;
  crawlerEndpoints: string[]; // Scalable microservice URLs.
  scanResultsApi: string; // For reporting via webhooks/APIs.
}

export interface PerceptualMatcherAgent extends BaseAgent {
  type: AgentType.PerceptualMatcher;
  mlModelVersion: string; // For self-retraining.
  feedbackApi: string; // Exposes for user/admin training data.
}

export interface DMCATakedownAgent extends BaseAgent {
  type: AgentType.DMCATakedown;
  takedownTracks: Record<string, { status: 'pending' | 'sent' | 'resolved', log: string }>; // Tracked requests.
  complianceApi: string; // For submissions and logging.
}

export interface UXOnboardingOptimizerAgent extends BaseAgent {
  type: AgentType.UXOnboardingOptimizer;
  abTests: Record<string, { variant: string; metrics: Partial<Scorecard> }>; // Live A/B data.
  uxFlowsApi: string; // For deploying frontend changes via API.
}

export interface GrowthRevenueAgent extends BaseAgent {
  type: AgentType.GrowthRevenue;
  billingIntegrations: string[]; // e.g., ['stripe/api/subscriptions'].
  pricingExperiments: Record<string, number>; // Tested prices and LTV impacts.
}

export interface ComplianceEthicsAgent extends BaseAgent {
  type: AgentType.ComplianceEthics;
  legalFlows: string[]; // e.g., ['gdpr/consent/update'].
  auditLogsApi: string; // For real-time monitoring and updates.
}

export type AnyAgent =
  | MasterOrchestratorAgent
  | StealthCrawlerAgent
  | PerceptualMatcherAgent
  | DMCATakedownAgent
  | UXOnboardingOptimizerAgent
  | GrowthRevenueAgent
  | ComplianceEthicsAgent;

// Export for system-wide use; agents can extend or propose new types via learning loop.
