import { useState, useEffect, useMemo } from 'react';

const simulateDelay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

const iroRegisterData = [
  { id: 'IRO-001', topicCode: 'E1', topicName: 'Climate Change', iroType: 'Impact', title: 'GHG emissions from operations', description: 'Direct and indirect greenhouse gas emissions from manufacturing processes, energy consumption, and company vehicle fleet operations across all facilities.', impactMateriality: 92, financialMateriality: 85, isMaterial: true, timeHorizon: 'Short-term', status: 'Assessed' },
  { id: 'IRO-002', topicCode: 'E1', topicName: 'Climate Change', iroType: 'Risk', title: 'Carbon pricing exposure', description: 'Potential financial impact from expanding carbon pricing mechanisms including EU ETS phase 4, CBAM implementation, and emerging national carbon taxes in key operating markets.', impactMateriality: 78, financialMateriality: 88, isMaterial: true, timeHorizon: 'Medium-term', status: 'Assessed' },
  { id: 'IRO-003', topicCode: 'E1', topicName: 'Climate Change', iroType: 'Opportunity', title: 'Low-carbon product innovation', description: 'Revenue growth opportunity through development of carbon-neutral product lines leveraging proprietary green chemistry processes and bio-based materials.', impactMateriality: 65, financialMateriality: 72, isMaterial: true, timeHorizon: 'Medium-term', status: 'Assessed' },
  { id: 'IRO-004', topicCode: 'E2', topicName: 'Pollution', iroType: 'Impact', title: 'Air pollutant emissions', description: 'NOx, SOx, and particulate matter emissions from industrial processes impacting local air quality in surrounding communities near production facilities.', impactMateriality: 71, financialMateriality: 45, isMaterial: true, timeHorizon: 'Short-term', status: 'Assessed' },
  { id: 'IRO-005', topicCode: 'E2', topicName: 'Pollution', iroType: 'Risk', title: 'Regulatory non-compliance fines', description: 'Risk of financial penalties and operational disruptions from potential non-compliance with evolving EU Industrial Emissions Directive and national BAT requirements.', impactMateriality: 55, financialMateriality: 62, isMaterial: true, timeHorizon: 'Short-term', status: 'Assessed' },
  { id: 'IRO-006', topicCode: 'E3', topicName: 'Water & Marine Resources', iroType: 'Impact', title: 'Water consumption in water-stressed regions', description: 'Significant freshwater withdrawal and consumption at facilities located in regions classified as high or extremely high water stress by WRI Aqueduct.', impactMateriality: 68, financialMateriality: 52, isMaterial: true, timeHorizon: 'Medium-term', status: 'Assessed' },
  { id: 'IRO-007', topicCode: 'E3', topicName: 'Water & Marine Resources', iroType: 'Risk', title: 'Water scarcity operational disruption', description: 'Potential production shutdowns and capacity constraints due to increasing water scarcity driven by climate change and competing demand in key manufacturing regions.', impactMateriality: 48, financialMateriality: 58, isMaterial: true, timeHorizon: 'Long-term', status: 'In Progress' },
  { id: 'IRO-008', topicCode: 'E4', topicName: 'Biodiversity & Ecosystems', iroType: 'Impact', title: 'Land use change from operations', description: 'Habitat fragmentation and ecosystem degradation associated with raw material sourcing, facility expansion, and supply chain land use practices.', impactMateriality: 56, financialMateriality: 32, isMaterial: true, timeHorizon: 'Long-term', status: 'In Progress' },
  { id: 'IRO-009', topicCode: 'E5', topicName: 'Circular Economy', iroType: 'Opportunity', title: 'Waste valorization revenue', description: 'Revenue opportunity from implementing industrial symbiosis and waste-to-value programs converting production waste streams into marketable by-products.', impactMateriality: 60, financialMateriality: 55, isMaterial: true, timeHorizon: 'Medium-term', status: 'Assessed' },
  { id: 'IRO-010', topicCode: 'E5', topicName: 'Circular Economy', iroType: 'Impact', title: 'Product end-of-life waste', description: 'Environmental impact of product disposal at end-of-life stage including non-recyclable components and hazardous material content requiring special treatment.', impactMateriality: 52, financialMateriality: 38, isMaterial: true, timeHorizon: 'Long-term', status: 'Not Started' },
  { id: 'IRO-011', topicCode: 'S1', topicName: 'Own Workforce', iroType: 'Impact', title: 'Employee health & safety incidents', description: 'Occupational health and safety impacts including lost-time injuries, occupational diseases, and near-miss events across manufacturing and logistics operations.', impactMateriality: 85, financialMateriality: 60, isMaterial: true, timeHorizon: 'Short-term', status: 'Assessed' },
  { id: 'IRO-012', topicCode: 'S1', topicName: 'Own Workforce', iroType: 'Risk', title: 'Talent retention challenges', description: 'Risk of increased employee turnover and difficulty attracting skilled talent due to competitive labor market and evolving workforce expectations around sustainability.', impactMateriality: 62, financialMateriality: 70, isMaterial: true, timeHorizon: 'Short-term', status: 'Assessed' },
  { id: 'IRO-013', topicCode: 'S2', topicName: 'Workers in Value Chain', iroType: 'Impact', title: 'Supply chain labor standards', description: 'Potential adverse human rights impacts including forced labor risks, inadequate wages, and poor working conditions in tier 2+ supply chain operations.', impactMateriality: 75, financialMateriality: 48, isMaterial: true, timeHorizon: 'Medium-term', status: 'In Progress' },
  { id: 'IRO-014', topicCode: 'S3', topicName: 'Affected Communities', iroType: 'Impact', title: 'Community displacement concerns', description: 'Potential negative impacts on local communities from facility expansion, including noise pollution, traffic congestion, and changes to local economic dynamics.', impactMateriality: 42, financialMateriality: 28, isMaterial: false, timeHorizon: 'Long-term', status: 'Assessed' },
  { id: 'IRO-015', topicCode: 'S4', topicName: 'Consumers & End-users', iroType: 'Risk', title: 'Product safety recalls', description: 'Financial and reputational risk from potential product safety issues leading to recalls, litigation, and loss of customer trust in key consumer markets.', impactMateriality: 58, financialMateriality: 75, isMaterial: true, timeHorizon: 'Short-term', status: 'Assessed' },
  { id: 'IRO-016', topicCode: 'G1', topicName: 'Business Conduct', iroType: 'Risk', title: 'Anti-corruption compliance', description: 'Risk of bribery and corruption incidents in high-risk operating jurisdictions potentially leading to regulatory penalties and reputational damage.', impactMateriality: 70, financialMateriality: 82, isMaterial: true, timeHorizon: 'Short-term', status: 'Assessed' },
  { id: 'IRO-017', topicCode: 'G1', topicName: 'Business Conduct', iroType: 'Impact', title: 'Tax transparency practices', description: 'Impact of corporate tax planning strategies on public finances in operating jurisdictions and alignment with responsible tax principles and country-by-country reporting.', impactMateriality: 45, financialMateriality: 55, isMaterial: false, timeHorizon: 'Medium-term', status: 'In Progress' },
  { id: 'IRO-018', topicCode: 'E1', topicName: 'Climate Change', iroType: 'Risk', title: 'Physical climate risk to assets', description: 'Exposure of manufacturing facilities and logistics infrastructure to acute and chronic physical climate hazards including flooding, heat stress, and extreme weather events.', impactMateriality: 72, financialMateriality: 78, isMaterial: true, timeHorizon: 'Long-term', status: 'Assessed' },
  { id: 'IRO-019', topicCode: 'S1', topicName: 'Own Workforce', iroType: 'Opportunity', title: 'Diversity & inclusion value creation', description: 'Opportunity to enhance innovation and market performance through improved workforce diversity, inclusive culture, and equitable compensation practices.', impactMateriality: 55, financialMateriality: 42, isMaterial: true, timeHorizon: 'Medium-term', status: 'In Progress' },
  { id: 'IRO-020', topicCode: 'E2', topicName: 'Pollution', iroType: 'Opportunity', title: 'Clean technology leadership', description: 'Market differentiation and premium pricing opportunity through investment in best-available pollution control technologies and zero-emission production processes.', impactMateriality: 48, financialMateriality: 58, isMaterial: true, timeHorizon: 'Medium-term', status: 'Not Started' },
];

const stakeholderData = [
  { id: 'SH-001', name: 'European Commission DG ENV', type: 'Regulator', role: 'Primary regulatory authority', engagementMethod: 'Formal consultation', lastEngaged: '2025-12-15', sentiment: 'Neutral', keyTopics: ['CSRD compliance', 'ESRS alignment', 'EU Taxonomy'] },
  { id: 'SH-002', name: 'BlackRock ESG Team', type: 'Investor', role: 'Top 3 institutional shareholder', engagementMethod: 'Quarterly briefing', lastEngaged: '2026-01-20', sentiment: 'Positive', keyTopics: ['Climate targets', 'Scope 3 data', 'Transition plan'] },
  { id: 'SH-003', name: 'IG Metall Works Council', type: 'Employee Rep', role: 'Workforce representative body', engagementMethod: 'Monthly dialogue', lastEngaged: '2026-01-28', sentiment: 'Positive', keyTopics: ['Just transition', 'Training programs', 'Safety standards'] },
  { id: 'SH-004', name: 'Greenpeace International', type: 'NGO', role: 'Environmental advocacy watchdog', engagementMethod: 'Annual roundtable', lastEngaged: '2025-11-08', sentiment: 'Critical', keyTopics: ['Deforestation', 'Pollution targets', 'Net zero credibility'] },
  { id: 'SH-005', name: 'BASF SE', type: 'Supplier', role: 'Tier 1 chemical feedstock supplier', engagementMethod: 'Supplier sustainability audit', lastEngaged: '2025-10-22', sentiment: 'Positive', keyTopics: ['Scope 3 collaboration', 'PCF data exchange', 'Circular economy'] },
  { id: 'SH-006', name: 'CDP Climate Program', type: 'Rating Agency', role: 'ESG disclosure platform', engagementMethod: 'Annual questionnaire', lastEngaged: '2025-09-30', sentiment: 'Neutral', keyTopics: ['Climate disclosure', 'Water security', 'Forest risk'] },
  { id: 'SH-007', name: 'Local Community Board - Duisburg', type: 'Community', role: 'Local affected stakeholder group', engagementMethod: 'Community forum', lastEngaged: '2025-12-05', sentiment: 'Concerned', keyTopics: ['Air quality', 'Noise pollution', 'Local employment'] },
  { id: 'SH-008', name: 'Norges Bank Investment Mgmt', type: 'Investor', role: 'Major sovereign wealth fund investor', engagementMethod: 'Annual engagement letter', lastEngaged: '2026-01-10', sentiment: 'Positive', keyTopics: ['Human rights due diligence', 'Board oversight', 'Climate risk'] },
  { id: 'SH-009', name: 'Unilever Sustainable Sourcing', type: 'Customer', role: 'Key B2B customer sustainability team', engagementMethod: 'Quarterly review', lastEngaged: '2026-01-15', sentiment: 'Positive', keyTopics: ['Product carbon footprint', 'Circular packaging', 'Supplier code'] },
  { id: 'SH-010', name: 'German Federal Environment Agency', type: 'Regulator', role: 'National environmental authority', engagementMethod: 'Regulatory filing', lastEngaged: '2025-11-28', sentiment: 'Neutral', keyTopics: ['BImSchG compliance', 'PRTR reporting', 'BAT reference'] },
  { id: 'SH-011', name: 'WWF Germany', type: 'NGO', role: 'Nature conservation partner', engagementMethod: 'Partnership programme', lastEngaged: '2025-12-20', sentiment: 'Positive', keyTopics: ['Biodiversity strategy', 'Science-based targets', 'Water stewardship'] },
  { id: 'SH-012', name: 'Employee Sustainability Network', type: 'Employee Rep', role: 'Internal grassroots sustainability group', engagementMethod: 'Bi-weekly meetings', lastEngaged: '2026-02-01', sentiment: 'Positive', keyTopics: ['Green commuting', 'Office sustainability', 'Volunteering'] },
];

const reportingBoundaryData = [
  { id: 'RB-001', entityName: 'Scope3 GmbH (Parent)', country: 'Germany', ownershipPct: 100, consolidation: 'Full', inScope: true, division: 'Corporate' },
  { id: 'RB-002', entityName: 'Scope3 Manufacturing DE', country: 'Germany', ownershipPct: 100, consolidation: 'Full', inScope: true, division: 'Manufacturing' },
  { id: 'RB-003', entityName: 'Scope3 France SAS', country: 'France', ownershipPct: 100, consolidation: 'Full', inScope: true, division: 'Sales' },
  { id: 'RB-004', entityName: 'Scope3 Iberia SL', country: 'Spain', ownershipPct: 80, consolidation: 'Full', inScope: true, division: 'Sales' },
  { id: 'RB-005', entityName: 'Scope3 Polska Sp.z.o.o.', country: 'Poland', ownershipPct: 100, consolidation: 'Full', inScope: true, division: 'Manufacturing' },
  { id: 'RB-006', entityName: 'Scope3 Asia Pacific Pte Ltd', country: 'Singapore', ownershipPct: 75, consolidation: 'Proportional', inScope: true, division: 'Sales' },
  { id: 'RB-007', entityName: 'GreenChem JV Ltd', country: 'Netherlands', ownershipPct: 50, consolidation: 'Equity method', inScope: false, division: 'R&D' },
  { id: 'RB-008', entityName: 'Scope3 North America Inc.', country: 'United States', ownershipPct: 100, consolidation: 'Full', inScope: true, division: 'Sales' },
];

const esrsKPIsData = [
  { id: 'KPI-001', standard: 'E1', metric: 'Total GHG emissions (Scope 1+2)', value: 124500, unit: 'tCO2e', target: 95000, baselineYear: 2022, trend: 'down', confidence: 'High' },
  { id: 'KPI-002', standard: 'E1', metric: 'Scope 3 emissions', value: 892000, unit: 'tCO2e', target: 670000, baselineYear: 2022, trend: 'down', confidence: 'Medium' },
  { id: 'KPI-003', standard: 'E1', metric: 'Renewable energy share', value: 62, unit: '%', target: 80, baselineYear: 2022, trend: 'up', confidence: 'High' },
  { id: 'KPI-004', standard: 'E1', metric: 'Energy intensity', value: 0.85, unit: 'MWh/t product', target: 0.65, baselineYear: 2022, trend: 'down', confidence: 'High' },
  { id: 'KPI-005', standard: 'E2', metric: 'NOx emissions', value: 342, unit: 'tonnes', target: 250, baselineYear: 2022, trend: 'down', confidence: 'High' },
  { id: 'KPI-006', standard: 'E2', metric: 'SOx emissions', value: 128, unit: 'tonnes', target: 90, baselineYear: 2022, trend: 'down', confidence: 'Medium' },
  { id: 'KPI-007', standard: 'E2', metric: 'Hazardous waste generated', value: 4850, unit: 'tonnes', target: 3500, baselineYear: 2022, trend: 'up', confidence: 'High' },
  { id: 'KPI-008', standard: 'E3', metric: 'Total water withdrawal', value: 2.8, unit: 'million m3', target: 2.2, baselineYear: 2022, trend: 'down', confidence: 'High' },
  { id: 'KPI-009', standard: 'E3', metric: 'Water recycling rate', value: 45, unit: '%', target: 60, baselineYear: 2022, trend: 'up', confidence: 'Medium' },
  { id: 'KPI-010', standard: 'E4', metric: 'Sites near protected areas', value: 3, unit: 'sites', target: 0, baselineYear: 2022, trend: 'stable', confidence: 'High' },
  { id: 'KPI-011', standard: 'E5', metric: 'Waste diversion rate', value: 78, unit: '%', target: 90, baselineYear: 2022, trend: 'up', confidence: 'High' },
  { id: 'KPI-012', standard: 'E5', metric: 'Recycled input material rate', value: 34, unit: '%', target: 50, baselineYear: 2022, trend: 'up', confidence: 'Medium' },
  { id: 'KPI-013', standard: 'S1', metric: 'Lost-time injury rate (LTIR)', value: 1.8, unit: 'per 200k hrs', target: 1.0, baselineYear: 2022, trend: 'down', confidence: 'High' },
  { id: 'KPI-014', standard: 'S1', metric: 'Gender pay gap', value: 8.2, unit: '%', target: 3.0, baselineYear: 2022, trend: 'down', confidence: 'Medium' },
  { id: 'KPI-015', standard: 'S1', metric: 'Employee engagement score', value: 72, unit: '%', target: 80, baselineYear: 2022, trend: 'up', confidence: 'High' },
  { id: 'KPI-016', standard: 'S1', metric: 'Training hours per employee', value: 32, unit: 'hours/yr', target: 40, baselineYear: 2022, trend: 'up', confidence: 'High' },
  { id: 'KPI-017', standard: 'S2', metric: 'Supplier social audits completed', value: 156, unit: 'audits', target: 200, baselineYear: 2022, trend: 'up', confidence: 'High' },
  { id: 'KPI-018', standard: 'S3', metric: 'Community investment spend', value: 2.4, unit: 'EUR million', target: 3.0, baselineYear: 2022, trend: 'up', confidence: 'Medium' },
  { id: 'KPI-019', standard: 'S4', metric: 'Product safety incidents', value: 2, unit: 'incidents', target: 0, baselineYear: 2022, trend: 'down', confidence: 'High' },
  { id: 'KPI-020', standard: 'G1', metric: 'Ethics hotline reports resolved', value: 94, unit: '%', target: 100, baselineYear: 2022, trend: 'up', confidence: 'High' },
  { id: 'KPI-021', standard: 'G1', metric: 'Anti-corruption training completion', value: 97, unit: '%', target: 100, baselineYear: 2022, trend: 'up', confidence: 'High' },
  { id: 'KPI-022', standard: 'G1', metric: 'Board ESG competence ratio', value: 40, unit: '%', target: 50, baselineYear: 2022, trend: 'up', confidence: 'High' },
];

const riskSignalsData = [
  { id: 'RS-001', source: 'EU Official Journal', title: 'CSRD Delegated Acts Update - Enhanced Scope 3 Requirements', description: 'The European Commission has published updated delegated acts under the CSRD framework, introducing more granular Scope 3 reporting requirements effective FY2026. Companies must now report value chain emissions by category with third-party verification.', relevance: 'High', category: 'Regulatory', date: '2026-01-28', linkedIROs: ['IRO-001', 'IRO-002'] },
  { id: 'RS-002', source: 'Munich Re Climate Risk Index', title: 'Flooding Risk Upgrade for Rhine-Ruhr Industrial Zone', description: 'Munich Re has upgraded flood risk classification for the Rhine-Ruhr metropolitan area from "moderate" to "elevated" based on updated climate models projecting increased precipitation intensity and frequency through 2040.', relevance: 'High', category: 'Physical', date: '2026-01-15', linkedIROs: ['IRO-018'] },
  { id: 'RS-003', source: 'IEA World Energy Outlook', title: 'Accelerated Phase-out of Unabated Fossil Fuels in EU Industry', description: 'IEA analysis indicates EU industrial sector must accelerate fossil fuel phase-out by 40% faster than current trajectory to align with 1.5C pathway. Carbon pricing expected to reach EUR 150/tCO2 by 2030.', relevance: 'High', category: 'Transition', date: '2026-01-10', linkedIROs: ['IRO-002', 'IRO-003'] },
  { id: 'RS-004', source: 'Reuters ESG Watch', title: 'Greenwashing Litigation Wave Targets European Manufacturers', description: 'A surge in greenwashing lawsuits across EU jurisdictions is targeting sustainability claims by manufacturing companies. Three major cases filed in Q4 2025 resulted in combined penalties exceeding EUR 50M.', relevance: 'Medium', category: 'Reputational', date: '2026-01-05', linkedIROs: ['IRO-016'] },
  { id: 'RS-005', source: 'EU ETS Registry', title: 'CBAM Transitional Phase Compliance Deadline Extended', description: 'The European Commission has granted a 6-month extension for CBAM transitional reporting obligations, with full implementation now expected from January 2027. Importers must complete embedded emissions calculations.', relevance: 'Medium', category: 'Regulatory', date: '2025-12-20', linkedIROs: ['IRO-002'] },
  { id: 'RS-006', source: 'Copernicus Climate Service', title: 'Record Heat Stress Days Projected for Central European Manufacturing', description: 'Copernicus seasonal forecast indicates 2026 summer may see 15-20 additional heat stress days above historical average for Central European industrial regions, potentially impacting worker safety and equipment performance.', relevance: 'High', category: 'Physical', date: '2025-12-18', linkedIROs: ['IRO-011', 'IRO-018'] },
  { id: 'RS-007', source: 'EFRAG Technical Guidance', title: 'Updated ESRS Implementation Guidance on Value Chain Materiality', description: 'EFRAG has released new technical guidance clarifying expectations for value chain data collection under ESRS, including minimum data quality thresholds and use of sector-specific proxies for upstream emissions.', relevance: 'Medium', category: 'Regulatory', date: '2025-12-12', linkedIROs: ['IRO-001', 'IRO-013'] },
  { id: 'RS-008', source: 'S&P Global ESG Ratings', title: 'Sector Peer Analysis: Chemical Industry ESG Score Convergence', description: 'S&P analysis shows ESG score convergence among top-quartile chemical companies, with differentiation increasingly driven by Scope 3 data quality, biodiversity commitments, and just transition planning.', relevance: 'Medium', category: 'Reputational', date: '2025-12-08', linkedIROs: ['IRO-003', 'IRO-008'] },
  { id: 'RS-009', source: 'World Resources Institute', title: 'Aqueduct 4.0: Water Stress Projections for Key Manufacturing Basins', description: 'WRI Aqueduct 4.0 update reclassifies two of our key manufacturing regions from "high" to "extremely high" water stress by 2030, driven by agricultural demand growth and reduced glacial meltwater.', relevance: 'High', category: 'Physical', date: '2025-11-30', linkedIROs: ['IRO-006', 'IRO-007'] },
  { id: 'RS-010', source: 'European Parliament', title: 'Corporate Sustainability Due Diligence Directive (CSDDD) Final Text', description: 'European Parliament adopted final CSDDD text requiring mandatory human rights and environmental due diligence across full value chains. Companies with >1000 employees and >EUR 450M turnover are in scope from 2027.', relevance: 'High', category: 'Regulatory', date: '2025-11-22', linkedIROs: ['IRO-013', 'IRO-016'] },
];

const companyProfileData = {
  name: 'Scope3 Industries GmbH',
  hq: 'Dusseldorf, Germany',
  sector: 'Specialty Chemicals & Advanced Materials',
  revenue: 'EUR 4.2B',
  employees: 12400,
  reportingYear: 2025,
  divisions: ['Corporate', 'Manufacturing', 'Sales', 'R&D'],
};

function createHook(data) {
  return function useHook() {
    const [state, setState] = useState({ data: null, loading: true });
    useEffect(() => {
      let cancelled = false;
      simulateDelay(600 + Math.random() * 400).then(() => {
        if (!cancelled) {
          setState({ data, loading: false });
        }
      });
      return () => { cancelled = true; };
    }, []);
    return state;
  };
}

export const useIRORegister = createHook(iroRegisterData);
export const useStakeholders = createHook(stakeholderData);
export const useReportingBoundary = createHook(reportingBoundaryData);
export const useESRSKPIs = createHook(esrsKPIsData);
export const useRiskSignals = createHook(riskSignalsData);
export const useCompanyProfile = createHook(companyProfileData);

/* ==========================================================================
   Supplier Profiles
   ========================================================================== */
const supplierProfilesData = [
  { id: 's1', name: 'Bosch Rexroth', country: 'Germany', category: 'Purchased Goods', annualSpend: 4200000, tCO2e: 18400, engagementStatus: 'Active', responseRate: 92, lastContact: '2024-11-15', sciTarget: true, reductionCommitment: '15% by 2028', riskLevel: 'Low' },
  { id: 's2', name: 'Schneider Electric', country: 'France', category: 'Capital Goods', annualSpend: 3100000, tCO2e: 14200, engagementStatus: 'Active', responseRate: 88, lastContact: '2024-11-10', sciTarget: true, reductionCommitment: '25% by 2030', riskLevel: 'Low' },
  { id: 's3', name: 'BASF SE', country: 'Germany', category: 'Purchased Goods', annualSpend: 2800000, tCO2e: 22600, engagementStatus: 'Invited', responseRate: 45, lastContact: '2024-10-20', sciTarget: false, reductionCommitment: 'Under review', riskLevel: 'Medium' },
  { id: 's4', name: 'Tata Steel Europe', country: 'Netherlands', category: 'Raw Materials', annualSpend: 5600000, tCO2e: 41200, engagementStatus: 'Active', responseRate: 78, lastContact: '2024-11-12', sciTarget: false, reductionCommitment: '10% by 2027', riskLevel: 'High' },
  { id: 's5', name: 'Maersk Logistics', country: 'Denmark', category: 'Transportation', annualSpend: 1900000, tCO2e: 12800, engagementStatus: 'Active', responseRate: 95, lastContact: '2024-11-18', sciTarget: true, reductionCommitment: 'Net zero by 2040', riskLevel: 'Low' },
  { id: 's6', name: 'Samsung SDI', country: 'South Korea', category: 'Components', annualSpend: 3400000, tCO2e: 19800, engagementStatus: 'Invited', responseRate: 30, lastContact: '2024-09-28', sciTarget: false, reductionCommitment: 'None declared', riskLevel: 'High' },
  { id: 's7', name: 'Siemens Energy', country: 'Germany', category: 'Energy Services', annualSpend: 2200000, tCO2e: 8900, engagementStatus: 'Completed', responseRate: 100, lastContact: '2024-11-20', sciTarget: true, reductionCommitment: '30% by 2030', riskLevel: 'Low' },
  { id: 's8', name: 'ArcelorMittal', country: 'Luxembourg', category: 'Raw Materials', annualSpend: 4800000, tCO2e: 38500, engagementStatus: 'Not Started', responseRate: 0, lastContact: null, sciTarget: false, reductionCommitment: 'None', riskLevel: 'High' },
  { id: 's9', name: 'DHL Supply Chain', country: 'Germany', category: 'Transportation', annualSpend: 1600000, tCO2e: 9400, engagementStatus: 'Active', responseRate: 82, lastContact: '2024-11-14', sciTarget: true, reductionCommitment: '20% by 2029', riskLevel: 'Low' },
  { id: 's10', name: 'Foxconn Industrial', country: 'Taiwan', category: 'Electronics', annualSpend: 2700000, tCO2e: 16300, engagementStatus: 'Not Started', responseRate: 0, lastContact: null, sciTarget: false, reductionCommitment: 'None', riskLevel: 'Medium' },
];
export const useSupplierProfiles = createHook(supplierProfilesData);

/* ==========================================================================
   Evidence Documents
   ========================================================================== */
const evidenceDocumentsData = [
  { id: 'd1', fileName: 'Bosch_EF_Report_2024.pdf', type: 'Report', supplier: 'Bosch Rexroth', uploadDate: '2024-11-15', ocrStatus: 'Complete', extractedFields: [{ field: 'Total Emissions', value: '18,400 tCO2e', confidence: 0.97 }, { field: 'Scope 1', value: '4,200 tCO2e', confidence: 0.95 }, { field: 'Reporting Year', value: '2024', confidence: 0.99 }], provenance: { hash: 'a3f8c2d1e4b5a6c7d8e9f0a1b2c3d4e5f6a7b8c9', source: 'Supplier Portal', verifiedBy: 'Internal Audit' } },
  { id: 'd2', fileName: 'Schneider_ISO14064_Cert.pdf', type: 'Certificate', supplier: 'Schneider Electric', uploadDate: '2024-11-10', ocrStatus: 'Complete', extractedFields: [{ field: 'Certificate Number', value: 'ISO14064-2024-FR-0892', confidence: 0.99 }, { field: 'Valid Until', value: '2025-12-31', confidence: 0.98 }, { field: 'Certifying Body', value: 'Bureau Veritas', confidence: 0.97 }], provenance: { hash: 'b4e9d3a2f5c6b7a8d9e0f1a2b3c4d5e6f7a8b9c0', source: 'Email Attachment', verifiedBy: 'Bureau Veritas' } },
  { id: 'd3', fileName: 'BASF_Invoice_Q3_2024.xlsx', type: 'Invoice', supplier: 'BASF SE', uploadDate: '2024-10-22', ocrStatus: 'Complete', extractedFields: [{ field: 'Invoice Total', value: 'EUR 842,000', confidence: 0.96 }, { field: 'Period', value: 'Q3 2024', confidence: 0.98 }, { field: 'Goods Category', value: 'Chemical Compounds', confidence: 0.91 }], provenance: { hash: 'c5f0e4b3a6d7c8b9e0f1a2b3c4d5e6f7a8b9c0d1', source: 'ERP Integration', verifiedBy: 'Finance Team' } },
  { id: 'd4', fileName: 'Tata_Steel_EcoDeclaration.pdf', type: 'Declaration', supplier: 'Tata Steel Europe', uploadDate: '2024-11-01', ocrStatus: 'Pending', extractedFields: [{ field: 'Product Type', value: 'Hot-rolled coil', confidence: 0.88 }, { field: 'Carbon Intensity', value: '1.89 tCO2/t steel', confidence: 0.85 }], provenance: { hash: 'd6a1f5c4b7e8d9c0f1a2b3c4d5e6f7a8b9c0d1e2', source: 'Supplier Portal', verifiedBy: 'Pending' } },
  { id: 'd5', fileName: 'Maersk_Shipping_Report_2024.pdf', type: 'Report', supplier: 'Maersk Logistics', uploadDate: '2024-11-18', ocrStatus: 'Complete', extractedFields: [{ field: 'Total Shipments', value: '2,340 TEU', confidence: 0.97 }, { field: 'Emissions Factor', value: '0.0165 tCO2e/TEU-km', confidence: 0.94 }, { field: 'Distance', value: '324,000 km', confidence: 0.96 }], provenance: { hash: 'e7b2a6d5c8f9e0d1f2a3b4c5d6e7f8a9b0c1d2e3', source: 'API Integration', verifiedBy: 'Maersk Digital' } },
  { id: 'd6', fileName: 'Samsung_SDI_EnergyAudit.pdf', type: 'Report', supplier: 'Samsung SDI', uploadDate: '2024-09-30', ocrStatus: 'Failed', extractedFields: [], provenance: { hash: 'f8c3b7e6d9a0f1e2a3b4c5d6e7f8a9b0c1d2e3f4', source: 'Email Attachment', verifiedBy: 'N/A' } },
  { id: 'd7', fileName: 'Siemens_CDP_Response_2024.pdf', type: 'Report', supplier: 'Siemens Energy', uploadDate: '2024-11-20', ocrStatus: 'Complete', extractedFields: [{ field: 'CDP Score', value: 'A-', confidence: 0.99 }, { field: 'Scope 1+2', value: '6,200 tCO2e', confidence: 0.96 }, { field: 'Scope 3', value: '2,700 tCO2e', confidence: 0.93 }], provenance: { hash: 'a9d4c8f7e0b1a2f3b4c5d6e7f8a9b0c1d2e3f4a5', source: 'CDP Platform', verifiedBy: 'CDP' } },
  { id: 'd8', fileName: 'DHL_GreenLogistics_Cert.pdf', type: 'Certificate', supplier: 'DHL Supply Chain', uploadDate: '2024-11-14', ocrStatus: 'Complete', extractedFields: [{ field: 'Program', value: 'GoGreen Plus', confidence: 0.98 }, { field: 'Offset Verified', value: 'Yes', confidence: 0.97 }, { field: 'Valid Until', value: '2025-06-30', confidence: 0.99 }], provenance: { hash: 'b0e5d9a8f1c2b3a4c5d6e7f8a9b0c1d2e3f4a5b6', source: 'DHL Portal', verifiedBy: 'SGS' } },
];
export const useEvidenceDocuments = createHook(evidenceDocumentsData);

/* ==========================================================================
   Peer Benchmarks
   ========================================================================== */
const peerBenchmarksData = [
  { id: 'p0', company: 'Meridian GmbH', sector: 'Industrial Manufacturing', revenue: 420, tCO2eTotal: 391800, intensityPerRevenue: 932.9, scope3Pct: 78, sciApproved: true, cdpScore: 'A-', reductionTarget: '30% by 2030' },
  { id: 'p1', company: 'Voith Group', sector: 'Industrial Manufacturing', revenue: 510, tCO2eTotal: 485000, intensityPerRevenue: 951.0, scope3Pct: 72, sciApproved: true, cdpScore: 'B', reductionTarget: '25% by 2030' },
  { id: 'p2', company: 'GEA Group', sector: 'Industrial Manufacturing', revenue: 530, tCO2eTotal: 410000, intensityPerRevenue: 773.6, scope3Pct: 81, sciApproved: false, cdpScore: 'A-', reductionTarget: '35% by 2030' },
  { id: 'p3', company: 'Konecranes', sector: 'Industrial Manufacturing', revenue: 380, tCO2eTotal: 342000, intensityPerRevenue: 900.0, scope3Pct: 75, sciApproved: true, cdpScore: 'B', reductionTarget: '20% by 2028' },
  { id: 'p4', company: 'Andritz AG', sector: 'Industrial Manufacturing', revenue: 780, tCO2eTotal: 680000, intensityPerRevenue: 871.8, scope3Pct: 69, sciApproved: false, cdpScore: 'C', reductionTarget: '15% by 2030' },
  { id: 'p5', company: 'Metso Outotec', sector: 'Industrial Manufacturing', revenue: 490, tCO2eTotal: 395000, intensityPerRevenue: 806.1, scope3Pct: 82, sciApproved: true, cdpScore: 'A', reductionTarget: '42% by 2030' },
  { id: 'p6', company: 'Sulzer Ltd', sector: 'Industrial Manufacturing', revenue: 340, tCO2eTotal: 298000, intensityPerRevenue: 876.5, scope3Pct: 77, sciApproved: false, cdpScore: 'B', reductionTarget: '22% by 2029' },
];
export const usePeerBenchmarks = createHook(peerBenchmarksData);

/* ==========================================================================
   Recommendations
   ========================================================================== */
const recommendationsData = [
  { id: 'r1', title: 'Switch to renewable energy suppliers', description: 'Transition top 5 energy-intensive suppliers to certified renewable energy sources, reducing Scope 3 Category 1 emissions.', category: 'Energy Transition', estimatedReduction: 28400, estimatedCost: 180000, paybackYears: 2.4, priority: 'Critical', status: 'In Progress', linkedSuppliers: ['s1', 's4', 's8'] },
  { id: 'r2', title: 'Implement supplier carbon scorecards', description: 'Deploy quarterly carbon performance scorecards for all tier-1 suppliers with >EUR 1M annual spend.', category: 'Supplier Engagement', estimatedReduction: 15200, estimatedCost: 45000, paybackYears: 1.2, priority: 'High', status: 'Approved', linkedSuppliers: ['s1', 's2', 's3', 's4', 's5'] },
  { id: 'r3', title: 'Optimize logistics network', description: 'Consolidate shipping routes and shift 30% of freight from air to rail/sea to reduce transportation emissions.', category: 'Transportation', estimatedReduction: 9800, estimatedCost: 120000, paybackYears: 3.1, priority: 'High', status: 'In Progress', linkedSuppliers: ['s5', 's9'] },
  { id: 'r4', title: 'Circular materials program', description: 'Increase recycled material content to 40% across raw material suppliers, focusing on steel and aluminum.', category: 'Materials', estimatedReduction: 22100, estimatedCost: 250000, paybackYears: 4.5, priority: 'Medium', status: 'Proposed', linkedSuppliers: ['s4', 's8'] },
  { id: 'r5', title: 'Digital twin for process optimization', description: 'Deploy digital twins at top 3 manufacturing suppliers to identify and eliminate energy waste in production.', category: 'Process Optimization', estimatedReduction: 11600, estimatedCost: 350000, paybackYears: 5.2, priority: 'Medium', status: 'Under Review', linkedSuppliers: ['s1', 's2'] },
  { id: 'r6', title: 'Low-carbon procurement policy', description: 'Mandate carbon disclosure for all new supplier contracts and set maximum intensity thresholds.', category: 'Policy', estimatedReduction: 18900, estimatedCost: 25000, paybackYears: 0.8, priority: 'Critical', status: 'Approved', linkedSuppliers: [] },
  { id: 'r7', title: 'Warehouse electrification', description: 'Convert 5 key distribution warehouses from gas-powered to fully electric HVAC and material handling.', category: 'Energy Transition', estimatedReduction: 6400, estimatedCost: 890000, paybackYears: 7.2, priority: 'Low', status: 'Proposed', linkedSuppliers: ['s5', 's9'] },
  { id: 'r8', title: 'Supplier SBTi onboarding program', description: 'Fund and support 10 key suppliers in setting validated Science Based Targets.', category: 'Supplier Engagement', estimatedReduction: 34500, estimatedCost: 95000, paybackYears: 1.8, priority: 'Critical', status: 'In Progress', linkedSuppliers: ['s3', 's4', 's6', 's8', 's10'] },
];
export const useRecommendations = createHook(recommendationsData);

/* ==========================================================================
   Quality Anomalies
   ========================================================================== */
const qualityAnomaliesData = [
  { id: 'q1', type: 'Outlier', description: 'Tata Steel emissions 3.2x higher than sector median', severity: 'High', affectedRows: 14, suggestedAction: 'Verify emission factor applied for hot-rolled steel', status: 'Open' },
  { id: 'q2', type: 'Missing Data', description: 'Samsung SDI Q2 2024 data not submitted', severity: 'Medium', affectedRows: 0, suggestedAction: 'Send follow-up request to supplier', status: 'Open' },
  { id: 'q3', type: 'Duplicate', description: 'Two identical invoices from BASF for Q3', severity: 'Low', affectedRows: 2, suggestedAction: 'Remove duplicate entry ID-4821', status: 'Resolved' },
  { id: 'q4', type: 'Unit Mismatch', description: 'Maersk report uses TEU-miles instead of TEU-km', severity: 'Medium', affectedRows: 340, suggestedAction: 'Apply conversion factor 1.60934', status: 'In Progress' },
  { id: 'q5', type: 'Outlier', description: 'DHL shipping emissions dropped 82% YoY - verify', severity: 'High', affectedRows: 28, suggestedAction: 'Cross-reference with logistics volume data', status: 'Open' },
];
export const useQualityAnomalies = createHook(qualityAnomaliesData);

/* ==========================================================================
   Engagement Tracking
   ========================================================================== */
const engagementTrackingData = [
  { id: 'e1', supplierId: 's1', supplierName: 'Bosch Rexroth', action: 'Sent carbon disclosure questionnaire', date: '2024-10-01', status: 'Completed', channel: 'Email', notes: 'Full response received within 14 days.' },
  { id: 'e2', supplierId: 's1', supplierName: 'Bosch Rexroth', action: 'SBTi alignment workshop', date: '2024-10-28', status: 'Completed', channel: 'Meeting', notes: 'Agreed on 15% reduction by 2028.' },
  { id: 'e3', supplierId: 's1', supplierName: 'Bosch Rexroth', action: 'Q3 performance review', date: '2024-11-15', status: 'Completed', channel: 'Portal', notes: 'Scorecard published. Rating: A.' },
  { id: 'e4', supplierId: 's2', supplierName: 'Schneider Electric', action: 'Initial outreach - CDP alignment', date: '2024-09-15', status: 'Completed', channel: 'Email', notes: 'Positive response. Already CDP participant.' },
  { id: 'e5', supplierId: 's2', supplierName: 'Schneider Electric', action: 'Joint decarbonization roadmap meeting', date: '2024-10-22', status: 'Completed', channel: 'Meeting', notes: 'Roadmap aligned with 25% target by 2030.' },
  { id: 'e6', supplierId: 's3', supplierName: 'BASF SE', action: 'Sent carbon disclosure questionnaire', date: '2024-09-01', status: 'Pending', channel: 'Email', notes: 'Follow-up sent on Oct 5. No response yet.' },
  { id: 'e7', supplierId: 's3', supplierName: 'BASF SE', action: 'Escalation to procurement lead', date: '2024-10-20', status: 'In Progress', channel: 'Internal', notes: 'Procurement team engaging BASF account manager.' },
  { id: 'e8', supplierId: 's4', supplierName: 'Tata Steel Europe', action: 'Data quality issue flagged', date: '2024-10-15', status: 'In Progress', channel: 'Portal', notes: 'Emissions figure 3.2x above sector median.' },
  { id: 'e9', supplierId: 's4', supplierName: 'Tata Steel Europe', action: 'Verification request sent', date: '2024-11-01', status: 'Pending', channel: 'Email', notes: 'Requested breakdown by product line.' },
  { id: 'e10', supplierId: 's5', supplierName: 'Maersk Logistics', action: 'Green logistics program enrollment', date: '2024-09-20', status: 'Completed', channel: 'Meeting', notes: 'Enrolled in Maersk ECO Delivery program.' },
  { id: 'e11', supplierId: 's5', supplierName: 'Maersk Logistics', action: 'Route optimization analysis', date: '2024-11-18', status: 'Completed', channel: 'Portal', notes: 'Identified 12% reduction via rail shift.' },
  { id: 'e12', supplierId: 's6', supplierName: 'Samsung SDI', action: 'Initial outreach email', date: '2024-09-10', status: 'Pending', channel: 'Email', notes: 'No response after 2 follow-ups.' },
  { id: 'e13', supplierId: 's7', supplierName: 'Siemens Energy', action: 'SBTi validation completed', date: '2024-08-15', status: 'Completed', channel: 'External', notes: 'Targets validated by SBTi. 30% by 2030.' },
  { id: 'e14', supplierId: 's7', supplierName: 'Siemens Energy', action: 'Annual review - full compliance', date: '2024-11-20', status: 'Completed', channel: 'Meeting', notes: 'All deliverables met. Exemplary partner.' },
  { id: 'e15', supplierId: 's9', supplierName: 'DHL Supply Chain', action: 'GoGreen Plus certification review', date: '2024-11-14', status: 'Completed', channel: 'Portal', notes: 'Certificate verified via SGS.' },
];
export const useEngagementTracking = createHook(engagementTrackingData);

/* ==========================================================================
   Emissions Summary (computed, no loading)
   ========================================================================== */
export function useEmissionsSummary() {
  return useMemo(
    () => ({ scope1: 45200, scope2: 28100, scope3: 318500, total: 391800 }),
    []
  );
}

/* ==========================================================================
   Hotspots (Calculation Stage 2)
   ========================================================================== */
const hotspotsData = [
  { id: "HS-001", category: "Capital Goods", tCO2e: 168900, pctOfTotal: 43.1, trend: "up", topSupplier: "Siemens AG", reductionPotential: "Medium" },
  { id: "HS-002", category: "Transport", tCO2e: 100620, pctOfTotal: 25.7, trend: "down", topSupplier: "Maersk Line", reductionPotential: "High" },
  { id: "HS-003", category: "Steel & Metals", tCO2e: 76322, pctOfTotal: 19.5, trend: "down", topSupplier: "Rio Tinto Alcan", reductionPotential: "High" },
  { id: "HS-004", category: "Chemicals", tCO2e: 57330, pctOfTotal: 14.6, trend: "stable", topSupplier: "Covestro AG", reductionPotential: "Medium" },
  { id: "HS-005", category: "Energy", tCO2e: 10622, pctOfTotal: 2.7, trend: "down", topSupplier: "TotalEnergies SE", reductionPotential: "High" },
  { id: "HS-006", category: "Packaging", tCO2e: 7644, pctOfTotal: 2.0, trend: "stable", topSupplier: "Smurfit Kappa", reductionPotential: "Low" },
  { id: "HS-007", category: "Waste Management", tCO2e: 2275, pctOfTotal: 0.6, trend: "down", topSupplier: "Veolia Environnement", reductionPotential: "Low" },
];
export const useHotspots = createHook(hotspotsData);

/* ==========================================================================
   Calculation (Stage 2) -- Procurement Data
   ========================================================================== */
const procurementData = [
  { id: "PR-001", supplier: "BASF SE", category: "Chemicals", subcategory: "Industrial Chemicals", description: "Polyurethane raw materials", amount: 12450000, currency: "EUR", unit: "tonnes", quantity: 8500, period: "FY2024", division: "Manufacturing", country: "Germany", emissionFactorId: "EF-001" },
  { id: "PR-002", supplier: "ThyssenKrupp AG", category: "Steel & Metals", subcategory: "Flat Steel", description: "Hot-rolled coil steel sheets", amount: 9800000, currency: "EUR", unit: "tonnes", quantity: 15000, period: "FY2024", division: "Manufacturing", country: "Germany", emissionFactorId: "EF-002" },
  { id: "PR-003", supplier: "TotalEnergies SE", category: "Energy", subcategory: "Natural Gas", description: "Pipeline natural gas supply", amount: 7200000, currency: "EUR", unit: "MWh", quantity: 42000, period: "FY2024", division: "Operations", country: "France", emissionFactorId: "EF-003" },
  { id: "PR-004", supplier: "Maersk Line", category: "Transport", subcategory: "Ocean Freight", description: "Container shipping - Asia to EU route", amount: 5600000, currency: "EUR", unit: "TEU", quantity: 12000, period: "FY2024", division: "Logistics", country: "Denmark", emissionFactorId: "EF-004" },
  { id: "PR-005", supplier: "DHL Supply Chain", category: "Transport", subcategory: "Road Freight", description: "EU last-mile distribution", amount: 3400000, currency: "EUR", unit: "shipments", quantity: 85000, period: "FY2024", division: "Logistics", country: "Germany", emissionFactorId: "EF-005" },
  { id: "PR-006", supplier: "Covestro AG", category: "Chemicals", subcategory: "Polymers", description: "Polycarbonate resins", amount: 8100000, currency: "EUR", unit: "tonnes", quantity: 6200, period: "FY2024", division: "Manufacturing", country: "Germany", emissionFactorId: "EF-006" },
  { id: "PR-007", supplier: "Vattenfall AB", category: "Energy", subcategory: "Electricity", description: "Renewable electricity supply contract", amount: 4500000, currency: "EUR", unit: "MWh", quantity: 38000, period: "FY2024", division: "Operations", country: "Sweden", emissionFactorId: "EF-007" },
  { id: "PR-008", supplier: "Rio Tinto Alcan", category: "Steel & Metals", subcategory: "Aluminium", description: "Aluminium ingots & billets", amount: 6700000, currency: "EUR", unit: "tonnes", quantity: 4800, period: "FY2024", division: "Manufacturing", country: "Australia", emissionFactorId: "EF-008" },
  { id: "PR-009", supplier: "DB Schenker", category: "Transport", subcategory: "Rail Freight", description: "European rail freight services", amount: 2100000, currency: "EUR", unit: "shipments", quantity: 22000, period: "FY2024", division: "Logistics", country: "Germany", emissionFactorId: "EF-009" },
  { id: "PR-010", supplier: "LANXESS AG", category: "Chemicals", subcategory: "Specialty Chemicals", description: "Flame retardant additives", amount: 3200000, currency: "EUR", unit: "tonnes", quantity: 1200, period: "FY2024", division: "Manufacturing", country: "Germany", emissionFactorId: "EF-010" },
  { id: "PR-011", supplier: "Schneider Electric", category: "Capital Goods", subcategory: "Electrical Equipment", description: "Factory automation systems", amount: 4800000, currency: "EUR", unit: "units", quantity: 45, period: "FY2024", division: "Manufacturing", country: "France", emissionFactorId: "EF-011" },
  { id: "PR-012", supplier: "Linde plc", category: "Chemicals", subcategory: "Industrial Gases", description: "Nitrogen & argon supply", amount: 1900000, currency: "EUR", unit: "m\u00B3", quantity: 850000, period: "FY2024", division: "Operations", country: "Ireland", emissionFactorId: "EF-012" },
  { id: "PR-013", supplier: "Veolia Environnement", category: "Waste Management", subcategory: "Industrial Waste", description: "Hazardous waste treatment", amount: 1400000, currency: "EUR", unit: "tonnes", quantity: 3500, period: "FY2024", division: "Operations", country: "France", emissionFactorId: "EF-013" },
  { id: "PR-014", supplier: "Smurfit Kappa", category: "Packaging", subcategory: "Corrugated Board", description: "Product packaging materials", amount: 2800000, currency: "EUR", unit: "tonnes", quantity: 9800, period: "FY2024", division: "Manufacturing", country: "Ireland", emissionFactorId: "EF-014" },
  { id: "PR-015", supplier: "Air Liquide SA", category: "Chemicals", subcategory: "Industrial Gases", description: "Hydrogen supply for processes", amount: 2300000, currency: "EUR", unit: "m\u00B3", quantity: 420000, period: "FY2024", division: "Operations", country: "France", emissionFactorId: "EF-015" },
  { id: "PR-016", supplier: "Kuehne+Nagel", category: "Transport", subcategory: "Air Freight", description: "Express air freight - intercontinental", amount: 4100000, currency: "EUR", unit: "tonnes", quantity: 800, period: "FY2024", division: "Logistics", country: "Switzerland", emissionFactorId: "EF-016" },
  { id: "PR-017", supplier: "SUEZ SA", category: "Waste Management", subcategory: "Recycling", description: "Metal & plastic recycling services", amount: 950000, currency: "EUR", unit: "tonnes", quantity: 5200, period: "FY2024", division: "Operations", country: "France", emissionFactorId: "EF-017" },
  { id: "PR-018", supplier: "Siemens AG", category: "Capital Goods", subcategory: "Industrial Machinery", description: "CNC machining centres", amount: 6200000, currency: "EUR", unit: "units", quantity: 12, period: "FY2024", division: "Manufacturing", country: "Germany", emissionFactorId: "EF-018" },
  { id: "PR-019", supplier: "Norsk Hydro ASA", category: "Steel & Metals", subcategory: "Aluminium", description: "Low-carbon aluminium extrusions", amount: 3900000, currency: "EUR", unit: "tonnes", quantity: 2200, period: "FY2024", division: "Manufacturing", country: "Norway", emissionFactorId: "EF-019" },
  { id: "PR-020", supplier: "Engie SA", category: "Energy", subcategory: "District Heating", description: "District heating supply contract", amount: 1800000, currency: "EUR", unit: "MWh", quantity: 16000, period: "FY2024", division: "Operations", country: "France", emissionFactorId: "EF-020" },
];
export const useProcurementData = createHook(procurementData);

/* ==========================================================================
   Calculation (Stage 2) -- Emission Factors
   ========================================================================== */
const emissionFactorsData = [
  { id: "EF-001", name: "Industrial chemicals - bulk", category: "Chemicals", value: 2.45, unit: "kgCO2e/kg", source: "DEFRA", region: "EU", confidence: "High", year: 2024 },
  { id: "EF-002", name: "Steel hot-rolled coil", category: "Steel & Metals", value: 1.85, unit: "kgCO2e/kg", source: "ecoinvent", region: "EU", confidence: "High", year: 2024 },
  { id: "EF-003", name: "Natural gas combustion", category: "Energy", value: 0.184, unit: "kgCO2e/kWh", source: "DEFRA", region: "EU", confidence: "High", year: 2024 },
  { id: "EF-004", name: "Container shipping", category: "Transport", value: 0.016, unit: "kgCO2e/tkm", source: "GLEC", region: "Global", confidence: "Medium", year: 2024 },
  { id: "EF-005", name: "Road freight - articulated", category: "Transport", value: 0.089, unit: "kgCO2e/tkm", source: "DEFRA", region: "EU", confidence: "High", year: 2024 },
  { id: "EF-006", name: "Polycarbonate resin", category: "Chemicals", value: 5.12, unit: "kgCO2e/kg", source: "ecoinvent", region: "EU", confidence: "High", year: 2024 },
  { id: "EF-007", name: "Electricity grid - Sweden", category: "Energy", value: 0.013, unit: "kgCO2e/kWh", source: "ecoinvent", region: "SE", confidence: "High", year: 2024 },
  { id: "EF-008", name: "Aluminium primary ingot", category: "Steel & Metals", value: 8.24, unit: "kgCO2e/kg", source: "GaBi", region: "Global", confidence: "Medium", year: 2023 },
  { id: "EF-009", name: "Rail freight - electric", category: "Transport", value: 0.028, unit: "kgCO2e/tkm", source: "DEFRA", region: "EU", confidence: "High", year: 2024 },
  { id: "EF-010", name: "Specialty chemicals", category: "Chemicals", value: 3.67, unit: "kgCO2e/kg", source: "ecoinvent", region: "EU", confidence: "Medium", year: 2023 },
  { id: "EF-011", name: "Electrical equipment", category: "Capital Goods", value: 420, unit: "kgCO2e/unit", source: "GaBi", region: "EU", confidence: "Low", year: 2023 },
  { id: "EF-012", name: "Industrial gases - nitrogen", category: "Chemicals", value: 0.42, unit: "kgCO2e/m\u00B3", source: "DEFRA", region: "EU", confidence: "Medium", year: 2024 },
  { id: "EF-013", name: "Hazardous waste treatment", category: "Waste Management", value: 0.65, unit: "kgCO2e/kg", source: "DEFRA", region: "EU", confidence: "Medium", year: 2024 },
  { id: "EF-014", name: "Corrugated board packaging", category: "Packaging", value: 0.78, unit: "kgCO2e/kg", source: "ecoinvent", region: "EU", confidence: "High", year: 2024 },
  { id: "EF-015", name: "Hydrogen production - grey", category: "Chemicals", value: 9.3, unit: "kgCO2e/kg", source: "ecoinvent", region: "EU", confidence: "High", year: 2024 },
  { id: "EF-016", name: "Air freight - intercontinental", category: "Transport", value: 0.602, unit: "kgCO2e/tkm", source: "DEFRA", region: "Global", confidence: "High", year: 2024 },
  { id: "EF-017", name: "Metal recycling", category: "Waste Management", value: -1.2, unit: "kgCO2e/kg", source: "ecoinvent", region: "EU", confidence: "Low", year: 2023 },
  { id: "EF-018", name: "Industrial machinery", category: "Capital Goods", value: 12500, unit: "kgCO2e/unit", source: "GaBi", region: "EU", confidence: "Low", year: 2022 },
  { id: "EF-019", name: "Aluminium low-carbon", category: "Steel & Metals", value: 4.1, unit: "kgCO2e/kg", source: "ecoinvent", region: "NO", confidence: "High", year: 2024 },
  { id: "EF-020", name: "District heating - gas CHP", category: "Energy", value: 0.15, unit: "kgCO2e/kWh", source: "DEFRA", region: "EU", confidence: "Medium", year: 2024 },
];
export const useEmissionFactors = createHook(emissionFactorsData);

/* ==========================================================================
   Calculation (Stage 2) -- Compute Results
   ========================================================================== */
const computeResultsData = [
  { id: "CR-001", procurementId: "PR-001", category: "Chemicals", supplier: "BASF SE", activityValue: 8500, activityUnit: "tonnes", emissionFactor: 2.45, factorUnit: "kgCO2e/kg", factorSource: "DEFRA", tCO2e: 20825, scope: "Scope 3", dqsScore: 0.87, methodology: "Spend-based" },
  { id: "CR-002", procurementId: "PR-002", category: "Steel & Metals", supplier: "ThyssenKrupp AG", activityValue: 15000, activityUnit: "tonnes", emissionFactor: 1.85, factorUnit: "kgCO2e/kg", factorSource: "ecoinvent", tCO2e: 27750, scope: "Scope 3", dqsScore: 0.91, methodology: "Activity-based" },
  { id: "CR-003", procurementId: "PR-003", category: "Energy", supplier: "TotalEnergies SE", activityValue: 42000, activityUnit: "MWh", emissionFactor: 0.184, factorUnit: "kgCO2e/kWh", factorSource: "DEFRA", tCO2e: 7728, scope: "Scope 2", dqsScore: 0.93, methodology: "Location-based" },
  { id: "CR-004", procurementId: "PR-004", category: "Transport", supplier: "Maersk Line", activityValue: 12000, activityUnit: "TEU", emissionFactor: 0.016, factorUnit: "kgCO2e/tkm", factorSource: "GLEC", tCO2e: 48200, scope: "Scope 3", dqsScore: 0.72, methodology: "Distance-based" },
  { id: "CR-005", procurementId: "PR-005", category: "Transport", supplier: "DHL Supply Chain", activityValue: 85000, activityUnit: "shipments", emissionFactor: 0.089, factorUnit: "kgCO2e/tkm", factorSource: "DEFRA", tCO2e: 18900, scope: "Scope 3", dqsScore: 0.68, methodology: "Spend-based" },
  { id: "CR-006", procurementId: "PR-006", category: "Chemicals", supplier: "Covestro AG", activityValue: 6200, activityUnit: "tonnes", emissionFactor: 5.12, factorUnit: "kgCO2e/kg", factorSource: "ecoinvent", tCO2e: 31744, scope: "Scope 3", dqsScore: 0.89, methodology: "Activity-based" },
  { id: "CR-007", procurementId: "PR-007", category: "Energy", supplier: "Vattenfall AB", activityValue: 38000, activityUnit: "MWh", emissionFactor: 0.013, factorUnit: "kgCO2e/kWh", factorSource: "ecoinvent", tCO2e: 494, scope: "Scope 2", dqsScore: 0.95, methodology: "Market-based" },
  { id: "CR-008", procurementId: "PR-008", category: "Steel & Metals", supplier: "Rio Tinto Alcan", activityValue: 4800, activityUnit: "tonnes", emissionFactor: 8.24, factorUnit: "kgCO2e/kg", factorSource: "GaBi", tCO2e: 39552, scope: "Scope 3", dqsScore: 0.76, methodology: "Activity-based" },
  { id: "CR-009", procurementId: "PR-009", category: "Transport", supplier: "DB Schenker", activityValue: 22000, activityUnit: "shipments", emissionFactor: 0.028, factorUnit: "kgCO2e/tkm", factorSource: "DEFRA", tCO2e: 4620, scope: "Scope 3", dqsScore: 0.82, methodology: "Distance-based" },
  { id: "CR-010", procurementId: "PR-010", category: "Chemicals", supplier: "LANXESS AG", activityValue: 1200, activityUnit: "tonnes", emissionFactor: 3.67, factorUnit: "kgCO2e/kg", factorSource: "ecoinvent", tCO2e: 4404, scope: "Scope 3", dqsScore: 0.79, methodology: "Activity-based" },
  { id: "CR-011", procurementId: "PR-011", category: "Capital Goods", supplier: "Schneider Electric", activityValue: 45, activityUnit: "units", emissionFactor: 420, factorUnit: "kgCO2e/unit", factorSource: "GaBi", tCO2e: 18900, scope: "Scope 3", dqsScore: 0.55, methodology: "Spend-based" },
  { id: "CR-012", procurementId: "PR-012", category: "Chemicals", supplier: "Linde plc", activityValue: 850000, activityUnit: "m\u00B3", emissionFactor: 0.42, factorUnit: "kgCO2e/m\u00B3", factorSource: "DEFRA", tCO2e: 357, scope: "Scope 3", dqsScore: 0.74, methodology: "Activity-based" },
  { id: "CR-013", procurementId: "PR-013", category: "Waste Management", supplier: "Veolia Environnement", activityValue: 3500, activityUnit: "tonnes", emissionFactor: 0.65, factorUnit: "kgCO2e/kg", factorSource: "DEFRA", tCO2e: 2275, scope: "Scope 3", dqsScore: 0.81, methodology: "Activity-based" },
  { id: "CR-014", procurementId: "PR-014", category: "Packaging", supplier: "Smurfit Kappa", activityValue: 9800, activityUnit: "tonnes", emissionFactor: 0.78, factorUnit: "kgCO2e/kg", factorSource: "ecoinvent", tCO2e: 7644, scope: "Scope 3", dqsScore: 0.88, methodology: "Activity-based" },
  { id: "CR-015", procurementId: "PR-015", category: "Chemicals", supplier: "Air Liquide SA", activityValue: 420000, activityUnit: "m\u00B3", emissionFactor: 9.3, factorUnit: "kgCO2e/kg", factorSource: "ecoinvent", tCO2e: 3906, scope: "Scope 1", dqsScore: 0.85, methodology: "Activity-based" },
  { id: "CR-016", procurementId: "PR-016", category: "Transport", supplier: "Kuehne+Nagel", activityValue: 800, activityUnit: "tonnes", emissionFactor: 0.602, factorUnit: "kgCO2e/tkm", factorSource: "DEFRA", tCO2e: 28900, scope: "Scope 3", dqsScore: 0.71, methodology: "Distance-based" },
  { id: "CR-017", procurementId: "PR-017", category: "Waste Management", supplier: "SUEZ SA", activityValue: 5200, activityUnit: "tonnes", emissionFactor: -1.2, factorUnit: "kgCO2e/kg", factorSource: "ecoinvent", tCO2e: -6240, scope: "Scope 3", dqsScore: 0.52, methodology: "Activity-based" },
  { id: "CR-018", procurementId: "PR-018", category: "Capital Goods", supplier: "Siemens AG", activityValue: 12, activityUnit: "units", emissionFactor: 12500, factorUnit: "kgCO2e/unit", factorSource: "GaBi", tCO2e: 150000, scope: "Scope 3", dqsScore: 0.48, methodology: "Spend-based" },
  { id: "CR-019", procurementId: "PR-019", category: "Steel & Metals", supplier: "Norsk Hydro ASA", activityValue: 2200, activityUnit: "tonnes", emissionFactor: 4.1, factorUnit: "kgCO2e/kg", factorSource: "ecoinvent", tCO2e: 9020, scope: "Scope 3", dqsScore: 0.92, methodology: "Activity-based" },
  { id: "CR-020", procurementId: "PR-020", category: "Energy", supplier: "Engie SA", activityValue: 16000, activityUnit: "MWh", emissionFactor: 0.15, factorUnit: "kgCO2e/kWh", factorSource: "DEFRA", tCO2e: 2400, scope: "Scope 2", dqsScore: 0.78, methodology: "Location-based" },
];
export const useComputeResults = createHook(computeResultsData);

/* ==========================================================================
   Calculation (Stage 2) -- Gap Analysis
   ========================================================================== */
const gapAnalysisData = [
  { id: "GA-001", category: "Capital Goods", issueType: "Low Quality", description: "Spend-based methodology used for Siemens AG machinery. Supplier-specific data would improve accuracy by est. 40%.", estimatedImpact: "High", recommendation: "Request product carbon footprint (PCF) data from Siemens via CDP Supply Chain." },
  { id: "GA-002", category: "Transport", issueType: "Missing Data", description: "No primary data for Maersk ocean freight routes. Using average GLEC emission factors instead of vessel-specific data.", estimatedImpact: "High", recommendation: "Integrate Maersk ECO Delivery API for shipment-level emissions data." },
  { id: "GA-003", category: "Steel & Metals", issueType: "Stale Factor", description: "Rio Tinto aluminium emission factor from 2023 GaBi database. Company has since shifted to renewable smelting.", estimatedImpact: "Medium", recommendation: "Update to Rio Tinto 2024 sustainability report emission factors." },
  { id: "GA-004", category: "Waste Management", issueType: "Unmapped", description: "SUEZ recycling credits use negative emission factor with low confidence. Methodology for avoided emissions not validated.", estimatedImpact: "Medium", recommendation: "Engage third-party verifier (e.g., SGS) to validate recycling credit methodology." },
  { id: "GA-005", category: "Capital Goods", issueType: "Low Quality", description: "Schneider Electric automation systems using generic electrical equipment factor. DQS score: 0.55.", estimatedImpact: "Medium", recommendation: "Request Schneider Electric Product Environmental Profile (PEP) declarations." },
  { id: "GA-006", category: "Transport", issueType: "Missing Data", description: "DHL last-mile distribution using spend-based proxy. No distance or weight data available for 85k shipments.", estimatedImpact: "High", recommendation: "Integrate DHL GoGreen tracking for shipment-level CO2 data." },
  { id: "GA-007", category: "Chemicals", issueType: "Stale Factor", description: "LANXESS specialty chemicals factor from ecoinvent 2023. New production process implemented in Q2 2024.", estimatedImpact: "Low", recommendation: "Request updated process-specific LCA data from LANXESS sustainability team." },
  { id: "GA-008", category: "Energy", issueType: "Unmapped", description: "District heating from Engie uses generic gas CHP factor. Actual fuel mix includes 30% biomass co-firing.", estimatedImpact: "Low", recommendation: "Obtain fuel-mix certificate from Engie for location-specific emission factor." },
];
export const useGapAnalysis = createHook(gapAnalysisData);

/* ==========================================================================
   Calculation (Stage 2) -- Audit Trail
   ========================================================================== */
const auditTrailData = [
  { id: "AT-001", timestamp: "2025-01-15T14:32:00Z", actor: "System", action: "Data imported", entity: "Procurement", entityId: "BATCH-2024-Q4", details: "20 procurement records imported from SAP S/4HANA", version: "v1.0" },
  { id: "AT-002", timestamp: "2025-01-15T14:35:00Z", actor: "System", action: "Auto-mapping completed", entity: "EmissionFactors", entityId: "MAP-001", details: "18 of 20 procurement items auto-mapped to emission factors", version: "v1.0" },
  { id: "AT-003", timestamp: "2025-01-15T15:10:00Z", actor: "Anna Mueller", action: "Manual mapping", entity: "EmissionFactor", entityId: "EF-017", details: "Mapped SUEZ recycling to ecoinvent metal recycling credit factor", version: "v1.1" },
  { id: "AT-004", timestamp: "2025-01-15T15:22:00Z", actor: "Anna Mueller", action: "Manual mapping", entity: "EmissionFactor", entityId: "EF-020", details: "Mapped Engie district heating to DEFRA gas CHP factor", version: "v1.1" },
  { id: "AT-005", timestamp: "2025-01-15T16:00:00Z", actor: "System", action: "Computation triggered", entity: "ComputeResults", entityId: "RUN-001", details: "Full emissions computation for FY2024 - 20 line items processed", version: "v1.1" },
  { id: "AT-006", timestamp: "2025-01-15T16:02:00Z", actor: "System", action: "Computation completed", entity: "ComputeResults", entityId: "RUN-001", details: "Total: 391,800 tCO2e. Scope 1: 45,200 / Scope 2: 28,100 / Scope 3: 318,500", version: "v1.1" },
  { id: "AT-007", timestamp: "2025-01-16T09:15:00Z", actor: "System", action: "Hotspot analysis generated", entity: "Hotspots", entityId: "HS-2024", details: "7 hotspot categories identified. Top: Capital Goods (43.1%)", version: "v1.1" },
  { id: "AT-008", timestamp: "2025-01-16T09:18:00Z", actor: "System", action: "Gap analysis generated", entity: "GapAnalysis", entityId: "GAP-2024", details: "8 data quality issues identified. 3 High impact, 3 Medium, 2 Low", version: "v1.1" },
  { id: "AT-009", timestamp: "2025-01-16T10:30:00Z", actor: "Dr. Klaus Weber", action: "Review approved", entity: "ComputeResults", entityId: "RUN-001", details: "Emissions inventory reviewed and approved for FY2024 reporting", version: "v2.0" },
  { id: "AT-010", timestamp: "2025-01-16T11:00:00Z", actor: "System", action: "Report snapshot", entity: "Report", entityId: "RPT-2024-Q4", details: "Quarterly emissions report snapshot created and locked", version: "v2.0" },
];
export const useAuditTrail = createHook(auditTrailData);

/* ==========================================================================
   Onboarding Industries
   ========================================================================== */
const onboardingIndustriesData = [
  { id: 'ind1', name: 'Manufacturing', icon: 'Factory', subcategories: ['Automotive', 'Electronics', 'Heavy Machinery', 'Consumer Goods', 'Chemicals'] },
  { id: 'ind2', name: 'Energy & Utilities', icon: 'Zap', subcategories: ['Oil & Gas', 'Renewables', 'Power Generation', 'Water & Waste'] },
  { id: 'ind3', name: 'Technology', icon: 'Cpu', subcategories: ['Software', 'Hardware', 'Cloud Services', 'Semiconductors'] },
  { id: 'ind4', name: 'Financial Services', icon: 'Landmark', subcategories: ['Banking', 'Insurance', 'Asset Management', 'Fintech'] },
  { id: 'ind5', name: 'Healthcare', icon: 'Heart', subcategories: ['Pharmaceuticals', 'Medical Devices', 'Hospitals', 'Biotech'] },
  { id: 'ind6', name: 'Retail & Consumer', icon: 'ShoppingBag', subcategories: ['E-commerce', 'Food & Beverage', 'Fashion', 'Home & Garden'] },
  { id: 'ind7', name: 'Transportation', icon: 'Truck', subcategories: ['Logistics', 'Airlines', 'Shipping', 'Rail'] },
  { id: 'ind8', name: 'Real Estate', icon: 'Building2', subcategories: ['Commercial', 'Residential', 'Industrial', 'REIT'] },
];
export const useOnboardingIndustries = createHook(onboardingIndustriesData);
