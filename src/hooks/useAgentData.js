import { useEffect } from "react";
import { useAgentContext } from "@/context/AgentContext";

const AGENT_DATA = {
  meridian: {
    agents: [
      { id: "ag-1", name: "DMA Scanner", task: "Scanning regulatory feeds for new topics", progress: 72, status: "running", pageKey: "dma" },
      { id: "ag-2", name: "Factor Mapper", task: "Auto-mapping procurement categories", progress: 45, status: "running", pageKey: "factors" },
      { id: "ag-3", name: "Evidence Processor", task: "OCR extraction on 3 invoices", progress: 88, status: "running", pageKey: "evidence" },
      { id: "ag-4", name: "Risk Monitor", task: "Monitoring EU regulatory changes", progress: 30, status: "running", pageKey: "risks" },
      { id: "ag-5", name: "Benchmark Analyst", task: "Updating peer emissions data", progress: 60, status: "idle", pageKey: "benchmarks" },
    ],
    activityLog: [
      { id: "act-1", actor: "DMA Scanner", actorType: "agent", action: "Identified 2 new material topics from EU taxonomy update", result: "pending_review", timestamp: "2025-01-17T14:32:00Z" },
      { id: "act-2", actor: "Anna Mueller", actorType: "human", action: "Approved IRO-007 impact assessment", result: "completed", timestamp: "2025-01-17T14:15:00Z" },
      { id: "act-3", actor: "Factor Mapper", actorType: "agent", action: "Mapped 34 procurement categories to emission factors", result: "completed", timestamp: "2025-01-17T13:45:00Z" },
      { id: "act-4", actor: "Evidence Processor", actorType: "agent", action: "Extracted 12 fields from supplier invoice #INV-2024-089", result: "completed", timestamp: "2025-01-17T13:20:00Z" },
      { id: "act-5", actor: "Thomas Weber", actorType: "human", action: "Updated Scope 3 emission factors for FY2024", result: "completed", timestamp: "2025-01-17T12:00:00Z" },
      { id: "act-6", actor: "Risk Monitor", actorType: "agent", action: "Flagged CSRD deadline change for Q2 reporting", result: "pending_review", timestamp: "2025-01-17T11:30:00Z" },
      { id: "act-7", actor: "Benchmark Analyst", actorType: "agent", action: "Refreshed peer benchmark data for 8 companies", result: "completed", timestamp: "2025-01-17T10:45:00Z" },
      { id: "act-8", actor: "Lisa Schmidt", actorType: "human", action: "Uploaded Q4 energy consumption data", result: "completed", timestamp: "2025-01-17T10:00:00Z" },
      { id: "act-9", actor: "DMA Scanner", actorType: "agent", action: "Completed materiality scan across 12 regulatory sources", result: "completed", timestamp: "2025-01-17T09:30:00Z" },
      { id: "act-10", actor: "Factor Mapper", actorType: "agent", action: "Identified 3 unmapped categories requiring manual review", result: "needs_attention", timestamp: "2025-01-17T09:00:00Z" },
    ],
    insights: {
      dma: [
        { id: "ins-dma-1", title: "New EU Taxonomy alignment gap", description: "3 material topics may need reclassification under updated EU Taxonomy criteria effective Q2 2025.", suggestedAction: "Review and reclassify flagged topics", severity: "warning", confidence: 0.87 },
        { id: "ins-dma-2", title: "Stakeholder sentiment shift detected", description: "Investor group feedback indicates growing concern about water usage disclosure.", suggestedAction: "Escalate E3 water topic priority", severity: "info", confidence: 0.72 },
      ],
      iro: [
        { id: "ins-iro-1", title: "3 IROs approaching review deadline", description: "IRO-003, IRO-007, IRO-012 haven't been reviewed in 90+ days.", suggestedAction: "Schedule review for stale IROs", severity: "warning", confidence: 0.95 },
      ],
      stakeholders: [
        { id: "ins-sh-1", title: "Engagement gap with NGO partners", description: "No recorded engagement with 2 key NGO stakeholders in the past quarter.", suggestedAction: "Plan outreach for Q2", severity: "info", confidence: 0.80 },
      ],
      esrs: [
        { id: "ins-esrs-1", title: "E1 disclosure completeness at risk", description: "Missing Scope 3 category 11 data may affect E1 compliance score.", suggestedAction: "Prioritize Category 11 data collection", severity: "critical", confidence: 0.92 },
      ],
      risks: [
        { id: "ins-risk-1", title: "Emerging regulatory risk", description: "CSRD delegated acts update may affect current reporting boundary.", suggestedAction: "Review reporting boundary assumptions", severity: "warning", confidence: 0.85 },
      ],
      ingest: [
        { id: "ins-ing-1", title: "Data freshness alert", description: "3 procurement data sources haven't been refreshed in 30+ days.", suggestedAction: "Trigger data refresh for stale sources", severity: "warning", confidence: 0.90 },
      ],
      factors: [
        { id: "ins-fac-1", title: "New emission factors available", description: "DEFRA 2025 factors released. 12 mappings could be updated.", suggestedAction: "Apply updated DEFRA factors", severity: "info", confidence: 0.88 },
      ],
      emissions: [
        { id: "ins-em-1", title: "Scope 3 concentration risk", description: "Top 3 categories account for 78% of Scope 3 emissions.", suggestedAction: "Diversify reduction efforts across categories", severity: "info", confidence: 0.82 },
      ],
      hotspots: [
        { id: "ins-hot-1", title: "Hotspot pattern detected", description: "Purchased goods emissions trending up 12% QoQ despite reduction targets.", suggestedAction: "Investigate procurement category shifts", severity: "critical", confidence: 0.91 },
      ],
      reduce: [
        { id: "ins-red-1", title: "Initiative ROI opportunity", description: "Renewable energy switch initiative has highest projected ROI at 340%.", suggestedAction: "Accelerate renewable energy transition", severity: "info", confidence: 0.78 },
      ],
      suppliers: [
        { id: "ins-sup-1", title: "Supplier engagement stalled", description: "5 top-spend suppliers haven't responded to SBTi engagement requests.", suggestedAction: "Escalate with procurement team", severity: "warning", confidence: 0.86 },
      ],
      evidence: [
        { id: "ins-ev-1", title: "Document verification backlog", description: "8 documents pending verification for more than 14 days.", suggestedAction: "Process verification queue", severity: "warning", confidence: 0.93 },
      ],
      benchmarks: [
        { id: "ins-bm-1", title: "Peer performance gap closing", description: "Your intensity ratio improved 8% while peer median remained flat.", suggestedAction: "Highlight in next board report", severity: "info", confidence: 0.75 },
      ],
      reports: [
        { id: "ins-rpt-1", title: "Report readiness at 73%", description: "4 ESRS standards still below 80% completion threshold.", suggestedAction: "Focus on E1 and S1 gaps", severity: "warning", confidence: 0.88 },
      ],
      export: [
        { id: "ins-exp-1", title: "XBRL tagging completeness", description: "92% of mandatory tags applied. 8 tags need manual review.", suggestedAction: "Review missing XBRL tags", severity: "info", confidence: 0.90 },
      ],
      audit: [
        { id: "ins-aud-1", title: "Audit trail anomaly", description: "Unusual spike in system-triggered actions detected on Jan 15.", suggestedAction: "Investigate automated action spike", severity: "info", confidence: 0.70 },
      ],
      dashboard: [
        { id: "ins-dash-1", title: "Overall compliance trajectory positive", description: "Current pace suggests 85% ESRS readiness by Q2 deadline.", suggestedAction: "Maintain current velocity", severity: "info", confidence: 0.83 },
      ],
    },
    handoffs: {
      dma: { agentName: "DMA Scanner", description: "Scan regulatory feeds and academic sources for emerging material topics", estimatedTime: "~3 min" },
      iro: { agentName: "IRO Reviewer", description: "Review stale IROs and flag those needing re-assessment", estimatedTime: "~2 min" },
      stakeholders: { agentName: "Engagement Planner", description: "Draft engagement plan based on stakeholder priorities", estimatedTime: "~4 min" },
      esrs: { agentName: "ESRS Gap Mapper", description: "Identify gaps across ESRS disclosure requirements", estimatedTime: "~5 min" },
      risks: { agentName: "Risk Scanner", description: "Scan regulatory and news sources for emerging risk signals", estimatedTime: "~3 min" },
      ingest: { agentName: "Data Importer", description: "Import latest procurement data from connected sources", estimatedTime: "~2 min" },
      factors: { agentName: "Factor Mapper", description: "Auto-map unmapped procurement categories to emission factors", estimatedTime: "~3 min" },
      emissions: { agentName: "Emissions Engine", description: "Recompute all emission calculations with latest data", estimatedTime: "~5 min" },
      hotspots: { agentName: "Hotspot Analyzer", description: "Run hotspot detection across all emission categories", estimatedTime: "~4 min" },
      reduce: { agentName: "Gap Finder", description: "Identify reduction gaps and suggest new initiatives", estimatedTime: "~3 min" },
      suppliers: { agentName: "Outreach Agent", description: "Draft and send engagement requests to pending suppliers", estimatedTime: "~4 min" },
      evidence: { agentName: "Doc Processor", description: "Process pending documents through OCR and field extraction", estimatedTime: "~3 min" },
      benchmarks: { agentName: "Benchmark Updater", description: "Refresh peer benchmark data from public sources", estimatedTime: "~5 min" },
      reports: { agentName: "Report Generator", description: "Generate comprehensive ESRS report draft", estimatedTime: "~8 min" },
      export: { agentName: "XBRL Formatter", description: "Format and validate XBRL tags for all disclosures", estimatedTime: "~6 min" },
      audit: { agentName: "Audit Compiler", description: "Compile comprehensive audit pack for external review", estimatedTime: "~4 min" },
      dashboard: { agentName: "Dashboard Summarizer", description: "Generate executive summary across all modules", estimatedTime: "~3 min" },
    },
  },
  heidelberg: {
    agents: [
      { id: "ag-h1", name: "Cement Analyzer", task: "Processing cement plant emission data", progress: 55, status: "running", pageKey: "emissions" },
      { id: "ag-h2", name: "Supply Chain Scanner", task: "Mapping aggregate supplier emissions", progress: 38, status: "running", pageKey: "suppliers" },
      { id: "ag-h3", name: "Regulatory Monitor", task: "Tracking EU ETS changes", progress: 90, status: "running", pageKey: "risks" },
      { id: "ag-h4", name: "Report Drafter", task: "Preparing E1 disclosure narrative", progress: 15, status: "idle", pageKey: "esrs" },
      { id: "ag-h5", name: "Data Validator", task: "Validating Q4 production data", progress: 67, status: "running", pageKey: "ingest" },
    ],
    activityLog: [
      { id: "act-h1", actor: "Cement Analyzer", actorType: "agent", action: "Processed emission data for 12 cement plants", result: "completed", timestamp: "2025-01-17T15:00:00Z" },
      { id: "act-h2", actor: "Klaus Richter", actorType: "human", action: "Approved Scope 1 emission recalculation", result: "completed", timestamp: "2025-01-17T14:30:00Z" },
      { id: "act-h3", actor: "Supply Chain Scanner", actorType: "agent", action: "Identified 5 high-emission aggregate suppliers", result: "pending_review", timestamp: "2025-01-17T14:00:00Z" },
      { id: "act-h4", actor: "Regulatory Monitor", actorType: "agent", action: "EU ETS Phase IV compliance check completed", result: "completed", timestamp: "2025-01-17T13:00:00Z" },
      { id: "act-h5", actor: "Maria Fischer", actorType: "human", action: "Updated concrete mix emission factors", result: "completed", timestamp: "2025-01-17T12:30:00Z" },
      { id: "act-h6", actor: "Data Validator", actorType: "agent", action: "Flagged 3 data anomalies in Q4 production data", result: "needs_attention", timestamp: "2025-01-17T11:00:00Z" },
      { id: "act-h7", actor: "Cement Analyzer", actorType: "agent", action: "Updated clinker ratio calculations for 2024", result: "completed", timestamp: "2025-01-17T10:30:00Z" },
      { id: "act-h8", actor: "Stefan Lang", actorType: "human", action: "Exported Q3 sustainability report draft", result: "completed", timestamp: "2025-01-17T10:00:00Z" },
    ],
    insights: {
      dma: [{ id: "ins-h-dma", title: "Construction sector taxonomy update", description: "Updated EU taxonomy for construction materials requires new disclosure items.", suggestedAction: "Review new disclosure requirements", severity: "warning", confidence: 0.84 }],
      emissions: [{ id: "ins-h-em", title: "Clinker factor improvement", description: "Reducing clinker-to-cement ratio by 2% could save 180k tCO2e annually.", suggestedAction: "Model clinker ratio scenarios", severity: "info", confidence: 0.89 }],
      reduce: [{ id: "ins-h-red", title: "Carbon capture opportunity", description: "Pilot CCS project at Lengfurt plant shows promising results.", suggestedAction: "Evaluate CCS expansion plan", severity: "info", confidence: 0.76 }],
      dashboard: [{ id: "ins-h-dash", title: "EU ETS compliance on track", description: "Current emissions trajectory aligned with Phase IV allocation.", suggestedAction: "Continue monitoring", severity: "info", confidence: 0.88 }],
    },
    handoffs: {
      dma: { agentName: "DMA Scanner", description: "Scan for construction-specific material topics", estimatedTime: "~4 min" },
      emissions: { agentName: "Cement Analyzer", description: "Recompute all plant-level emission calculations", estimatedTime: "~8 min" },
      reduce: { agentName: "Reduction Planner", description: "Model reduction scenarios for cement operations", estimatedTime: "~6 min" },
      dashboard: { agentName: "Dashboard Summarizer", description: "Generate executive summary across all modules", estimatedTime: "~3 min" },
    },
  },
  danone: {
    agents: [
      { id: "ag-d1", name: "Supply Chain Mapper", task: "Mapping dairy supply chain emissions", progress: 42, status: "running", pageKey: "suppliers" },
      { id: "ag-d2", name: "Water Analyst", task: "Analyzing water usage across facilities", progress: 78, status: "running", pageKey: "hotspots" },
      { id: "ag-d3", name: "Packaging Optimizer", task: "Evaluating packaging material alternatives", progress: 25, status: "idle", pageKey: "reduce" },
      { id: "ag-d4", name: "CDP Reporter", task: "Preparing CDP questionnaire responses", progress: 55, status: "running", pageKey: "reports" },
      { id: "ag-d5", name: "Nutrition Tracker", task: "Tracking S4 nutrition-related metrics", progress: 65, status: "running", pageKey: "esrs" },
    ],
    activityLog: [
      { id: "act-d1", actor: "Supply Chain Mapper", actorType: "agent", action: "Mapped emissions for 45 dairy suppliers across 3 regions", result: "completed", timestamp: "2025-01-17T15:30:00Z" },
      { id: "act-d2", actor: "Sophie Martin", actorType: "human", action: "Approved water reduction targets for 2025", result: "completed", timestamp: "2025-01-17T15:00:00Z" },
      { id: "act-d3", actor: "Water Analyst", actorType: "agent", action: "Identified 4 facilities exceeding water intensity thresholds", result: "needs_attention", timestamp: "2025-01-17T14:00:00Z" },
      { id: "act-d4", actor: "Packaging Optimizer", actorType: "agent", action: "Evaluated 6 alternative packaging materials for yogurt line", result: "completed", timestamp: "2025-01-17T13:00:00Z" },
      { id: "act-d5", actor: "Jean Dupont", actorType: "human", action: "Updated Scope 3 Category 1 emission factors", result: "completed", timestamp: "2025-01-17T12:00:00Z" },
      { id: "act-d6", actor: "CDP Reporter", actorType: "agent", action: "Pre-filled 78% of CDP Climate questionnaire", result: "completed", timestamp: "2025-01-17T11:30:00Z" },
      { id: "act-d7", actor: "Nutrition Tracker", actorType: "agent", action: "Updated S4 nutrition metrics for 12 product categories", result: "completed", timestamp: "2025-01-17T11:00:00Z" },
      { id: "act-d8", actor: "Marie Laurent", actorType: "human", action: "Reviewed and approved B Corp assessment update", result: "completed", timestamp: "2025-01-17T10:00:00Z" },
    ],
    insights: {
      dma: [{ id: "ins-d-dma", title: "Food safety materiality update", description: "New EFSA guidance impacts S4 materiality scoring.", suggestedAction: "Reassess S4 materiality scores", severity: "info", confidence: 0.81 }],
      suppliers: [{ id: "ins-d-sup", title: "Dairy supply chain concentration", description: "Top 5 dairy suppliers account for 62% of Category 1 emissions.", suggestedAction: "Diversify supplier base", severity: "warning", confidence: 0.87 }],
      reduce: [{ id: "ins-d-red", title: "Packaging reduction impact", description: "Switching to rPET could reduce packaging emissions by 35%.", suggestedAction: "Pilot rPET transition", severity: "info", confidence: 0.83 }],
      dashboard: [{ id: "ins-d-dash", title: "B Corp certification on track", description: "Current scores align with recertification requirements.", suggestedAction: "Finalize documentation", severity: "info", confidence: 0.85 }],
    },
    handoffs: {
      dma: { agentName: "DMA Scanner", description: "Scan for food & beverage material topics", estimatedTime: "~3 min" },
      suppliers: { agentName: "Supply Chain Mapper", description: "Map dairy supply chain emission hotspots", estimatedTime: "~6 min" },
      reduce: { agentName: "Packaging Optimizer", description: "Evaluate alternative packaging materials", estimatedTime: "~5 min" },
      dashboard: { agentName: "Dashboard Summarizer", description: "Generate executive summary across all modules", estimatedTime: "~3 min" },
    },
  },
};

export function useAgentBootstrap(companyId) {
  const { dispatch } = useAgentContext();

  useEffect(() => {
    const data = AGENT_DATA[companyId] || AGENT_DATA.meridian;
    dispatch({ type: "SET_AGENTS", payload: data.agents });
    dispatch({ type: "SET_ACTIVITY_LOG", payload: data.activityLog });
    dispatch({ type: "SET_INSIGHTS", payload: data.insights || {} });
    dispatch({ type: "SET_HANDOFFS", payload: data.handoffs || {} });
  }, [companyId, dispatch]);
}
