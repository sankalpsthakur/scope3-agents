/* ==========================================================================
   Execution Data — per-company getter functions
   Supplier profiles, evidence docs, peer benchmarks, recommendations,
   quality anomalies, engagement tracking
   ========================================================================== */

// ---------------------------------------------------------------------------
// Supplier Profiles
// ---------------------------------------------------------------------------
const meridianSuppliers = [
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

const heidelbergSuppliers = [
  { id: 'h-s1', name: 'Glencore International', country: 'Switzerland', category: 'Fuels', annualSpend: 2100000000, tCO2e: 2460000, engagementStatus: 'Active', responseRate: 72, lastContact: '2024-11-20', sciTarget: false, reductionCommitment: '15% by 2030', riskLevel: 'High' },
  { id: 'h-s2', name: 'RWE Supply & Trading', country: 'Germany', category: 'Energy', annualSpend: 850000000, tCO2e: 1950000, engagementStatus: 'Active', responseRate: 85, lastContact: '2024-11-15', sciTarget: true, reductionCommitment: 'Net zero by 2040', riskLevel: 'Medium' },
  { id: 'h-s3', name: 'Sika AG', country: 'Switzerland', category: 'Chemicals', annualSpend: 320000000, tCO2e: 810000, engagementStatus: 'Active', responseRate: 90, lastContact: '2024-11-18', sciTarget: true, reductionCommitment: '25% by 2030', riskLevel: 'Low' },
  { id: 'h-s4', name: 'DB Cargo', country: 'Germany', category: 'Transportation', annualSpend: 180000000, tCO2e: 187000, engagementStatus: 'Active', responseRate: 88, lastContact: '2024-11-10', sciTarget: true, reductionCommitment: '40% by 2030', riskLevel: 'Low' },
  { id: 'h-s5', name: 'LEILAC Technology', country: 'Belgium', category: 'Capital Goods', annualSpend: 250000000, tCO2e: 170000, engagementStatus: 'Active', responseRate: 95, lastContact: '2024-11-22', sciTarget: false, reductionCommitment: 'CCS pilot partner', riskLevel: 'Medium' },
  { id: 'h-s6', name: 'FLSmidth', country: 'Denmark', category: 'Capital Goods', annualSpend: 180000000, tCO2e: 96000, engagementStatus: 'Active', responseRate: 82, lastContact: '2024-10-28', sciTarget: true, reductionCommitment: '30% by 2030', riskLevel: 'Low' },
  { id: 'h-s7', name: 'ArcelorMittal (Slag)', country: 'Luxembourg', category: 'Raw Materials', annualSpend: 85000000, tCO2e: 455000, engagementStatus: 'Invited', responseRate: 40, lastContact: '2024-10-15', sciTarget: false, reductionCommitment: 'Under review', riskLevel: 'High' },
  { id: 'h-s8', name: 'Waste Management Partners', country: 'Various', category: 'Alternative Fuels', annualSpend: 95000000, tCO2e: 3780000, engagementStatus: 'Active', responseRate: 70, lastContact: '2024-11-08', sciTarget: false, reductionCommitment: 'None', riskLevel: 'Medium' },
  { id: 'h-s9', name: 'Thyssenkrupp Polysius', country: 'Germany', category: 'Capital Goods', annualSpend: 120000000, tCO2e: 68000, engagementStatus: 'Active', responseRate: 78, lastContact: '2024-11-05', sciTarget: false, reductionCommitment: '20% by 2030', riskLevel: 'Low' },
  { id: 'h-s10', name: 'Lafarge Holcim (JV Partner)', country: 'Switzerland', category: 'Raw Materials', annualSpend: 45000000, tCO2e: 320000, engagementStatus: 'Not Started', responseRate: 0, lastContact: null, sciTarget: true, reductionCommitment: 'Net zero by 2050', riskLevel: 'Medium' },
];

const danoneSuppliers = [
  { id: 'd-s1', name: 'EU Dairy Farm Cooperatives', country: 'France', category: 'Agricultural Raw Materials', annualSpend: 4200000000, tCO2e: 8772000, engagementStatus: 'Active', responseRate: 55, lastContact: '2024-11-25', sciTarget: false, reductionCommitment: '30% methane by 2030', riskLevel: 'High' },
  { id: 'd-s2', name: 'Fonterra Co-operative', country: 'New Zealand', category: 'Agricultural Raw Materials', annualSpend: 850000000, tCO2e: 3360000, engagementStatus: 'Active', responseRate: 80, lastContact: '2024-11-20', sciTarget: true, reductionCommitment: '30% by 2030', riskLevel: 'Medium' },
  { id: 'd-s3', name: 'Amcor / Berry Global', country: 'Various', category: 'Packaging', annualSpend: 1800000000, tCO2e: 1632000, engagementStatus: 'Active', responseRate: 85, lastContact: '2024-11-18', sciTarget: true, reductionCommitment: '25% by 2030', riskLevel: 'Medium' },
  { id: 'd-s4', name: 'Tetra Pak', country: 'Sweden', category: 'Packaging', annualSpend: 620000000, tCO2e: 3912000, engagementStatus: 'Active', responseRate: 92, lastContact: '2024-11-22', sciTarget: true, reductionCommitment: 'Net zero by 2030', riskLevel: 'Low' },
  { id: 'd-s5', name: 'Cargill / Bunge', country: 'Brazil', category: 'Agricultural Raw Materials', annualSpend: 580000000, tCO2e: 1596000, engagementStatus: 'Invited', responseRate: 48, lastContact: '2024-10-10', sciTarget: false, reductionCommitment: 'Under review', riskLevel: 'High' },
  { id: 'd-s6', name: 'Sudzucker AG', country: 'Germany', category: 'Agricultural Raw Materials', annualSpend: 340000000, tCO2e: 417600, engagementStatus: 'Active', responseRate: 78, lastContact: '2024-11-12', sciTarget: false, reductionCommitment: '15% by 2028', riskLevel: 'Low' },
  { id: 'd-s7', name: 'DHL / XPO Logistics', country: 'Various', category: 'Transport', annualSpend: 920000000, tCO2e: 2890000, engagementStatus: 'Active', responseRate: 82, lastContact: '2024-11-15', sciTarget: true, reductionCommitment: '20% by 2029', riskLevel: 'Medium' },
  { id: 'd-s8', name: 'EDF / Engie', country: 'France', category: 'Energy', annualSpend: 450000000, tCO2e: 166400, engagementStatus: 'Completed', responseRate: 100, lastContact: '2024-11-28', sciTarget: true, reductionCommitment: 'Net zero by 2040', riskLevel: 'Low' },
  { id: 'd-s9', name: 'Veolia Water', country: 'Various', category: 'Water', annualSpend: 120000000, tCO2e: 29240, engagementStatus: 'Active', responseRate: 75, lastContact: '2024-11-08', sciTarget: true, reductionCommitment: '30% by 2030', riskLevel: 'Low' },
  { id: 'd-s10', name: 'Oat Farmers Cooperative (Alpro)', country: 'Belgium', category: 'Agricultural Raw Materials', annualSpend: 280000000, tCO2e: 98800, engagementStatus: 'Active', responseRate: 65, lastContact: '2024-11-05', sciTarget: false, reductionCommitment: 'Regen agriculture pledge', riskLevel: 'Low' },
];

// ---------------------------------------------------------------------------
// Evidence Documents
// ---------------------------------------------------------------------------
const meridianEvidence = [
  { id: 'd1', fileName: 'Bosch_EF_Report_2024.pdf', type: 'Report', supplier: 'Bosch Rexroth', uploadDate: '2024-11-15', ocrStatus: 'Complete', extractedFields: [{ field: 'Total Emissions', value: '18,400 tCO2e', confidence: 0.97 }, { field: 'Scope 1', value: '4,200 tCO2e', confidence: 0.95 }, { field: 'Reporting Year', value: '2024', confidence: 0.99 }], provenance: { hash: 'a3f8c2d1e4b5a6c7d8e9f0a1b2c3d4e5f6a7b8c9', source: 'Supplier Portal', verifiedBy: 'Internal Audit' } },
  { id: 'd2', fileName: 'Schneider_ISO14064_Cert.pdf', type: 'Certificate', supplier: 'Schneider Electric', uploadDate: '2024-11-10', ocrStatus: 'Complete', extractedFields: [{ field: 'Certificate Number', value: 'ISO14064-2024-FR-0892', confidence: 0.99 }, { field: 'Valid Until', value: '2025-12-31', confidence: 0.98 }, { field: 'Certifying Body', value: 'Bureau Veritas', confidence: 0.97 }], provenance: { hash: 'b4e9d3a2f5c6b7a8d9e0f1a2b3c4d5e6f7a8b9c0', source: 'Email Attachment', verifiedBy: 'Bureau Veritas' } },
  { id: 'd3', fileName: 'BASF_Invoice_Q3_2024.xlsx', type: 'Invoice', supplier: 'BASF SE', uploadDate: '2024-10-22', ocrStatus: 'Complete', extractedFields: [{ field: 'Invoice Total', value: 'EUR 842,000', confidence: 0.96 }, { field: 'Period', value: 'Q3 2024', confidence: 0.98 }, { field: 'Goods Category', value: 'Chemical Compounds', confidence: 0.91 }], provenance: { hash: 'c5f0e4b3a6d7c8b9e0f1a2b3c4d5e6f7a8b9c0d1', source: 'ERP Integration', verifiedBy: 'Finance Team' } },
  { id: 'd4', fileName: 'Tata_Steel_EcoDeclaration.pdf', type: 'Declaration', supplier: 'Tata Steel Europe', uploadDate: '2024-11-01', ocrStatus: 'Pending', extractedFields: [{ field: 'Product Type', value: 'Hot-rolled coil', confidence: 0.88 }, { field: 'Carbon Intensity', value: '1.89 tCO2/t steel', confidence: 0.85 }], provenance: { hash: 'd6a1f5c4b7e8d9c0f1a2b3c4d5e6f7a8b9c0d1e2', source: 'Supplier Portal', verifiedBy: 'Pending' } },
  { id: 'd5', fileName: 'Maersk_Shipping_Report_2024.pdf', type: 'Report', supplier: 'Maersk Logistics', uploadDate: '2024-11-18', ocrStatus: 'Complete', extractedFields: [{ field: 'Total Shipments', value: '2,340 TEU', confidence: 0.97 }, { field: 'Emissions Factor', value: '0.0165 tCO2e/TEU-km', confidence: 0.94 }, { field: 'Distance', value: '324,000 km', confidence: 0.96 }], provenance: { hash: 'e7b2a6d5c8f9e0d1f2a3b4c5d6e7f8a9b0c1d2e3', source: 'API Integration', verifiedBy: 'Maersk Digital' } },
  { id: 'd6', fileName: 'Samsung_SDI_EnergyAudit.pdf', type: 'Report', supplier: 'Samsung SDI', uploadDate: '2024-09-30', ocrStatus: 'Failed', extractedFields: [], provenance: { hash: 'f8c3b7e6d9a0f1e2a3b4c5d6e7f8a9b0c1d2e3f4', source: 'Email Attachment', verifiedBy: 'N/A' } },
  { id: 'd7', fileName: 'Siemens_CDP_Response_2024.pdf', type: 'Report', supplier: 'Siemens Energy', uploadDate: '2024-11-20', ocrStatus: 'Complete', extractedFields: [{ field: 'CDP Score', value: 'A-', confidence: 0.99 }, { field: 'Scope 1+2', value: '6,200 tCO2e', confidence: 0.96 }, { field: 'Scope 3', value: '2,700 tCO2e', confidence: 0.93 }], provenance: { hash: 'a9d4c8f7e0b1a2f3b4c5d6e7f8a9b0c1d2e3f4a5', source: 'CDP Platform', verifiedBy: 'CDP' } },
  { id: 'd8', fileName: 'DHL_GreenLogistics_Cert.pdf', type: 'Certificate', supplier: 'DHL Supply Chain', uploadDate: '2024-11-14', ocrStatus: 'Complete', extractedFields: [{ field: 'Program', value: 'GoGreen Plus', confidence: 0.98 }, { field: 'Offset Verified', value: 'Yes', confidence: 0.97 }, { field: 'Valid Until', value: '2025-06-30', confidence: 0.99 }], provenance: { hash: 'b0e5d9a8f1c2b3a4c5d6e7f8a9b0c1d2e3f4a5b6', source: 'DHL Portal', verifiedBy: 'SGS' } },
];

const heidelbergEvidence = [
  { id: 'h-d1', fileName: 'Glencore_FuelSupply_EF_2024.pdf', type: 'Report', supplier: 'Glencore International', uploadDate: '2024-11-20', ocrStatus: 'Complete', extractedFields: [{ field: 'Coal CV', value: '26.5 GJ/t', confidence: 0.96 }, { field: 'Petcoke CV', value: '32.4 GJ/t', confidence: 0.95 }, { field: 'Sulphur Content', value: '4.8%', confidence: 0.92 }], provenance: { hash: 'h1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0', source: 'Supplier Portal', verifiedBy: 'SGS' } },
  { id: 'h-d2', fileName: 'RWE_Electricity_GreenCert_2024.pdf', type: 'Certificate', supplier: 'RWE Supply & Trading', uploadDate: '2024-11-15', ocrStatus: 'Complete', extractedFields: [{ field: 'Renewable Share', value: '38%', confidence: 0.98 }, { field: 'Grid EF', value: '0.295 kgCO2e/kWh', confidence: 0.97 }, { field: 'Valid Until', value: '2025-12-31', confidence: 0.99 }], provenance: { hash: 'h2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1', source: 'Energy Trading Platform', verifiedBy: 'TÜV Rheinland' } },
  { id: 'h-d3', fileName: 'Sika_Admixture_EPD_2024.pdf', type: 'Declaration', supplier: 'Sika AG', uploadDate: '2024-11-18', ocrStatus: 'Complete', extractedFields: [{ field: 'Product', value: 'SikaPlast concrete admixture', confidence: 0.97 }, { field: 'GWP', value: '1.8 kgCO2e/kg', confidence: 0.94 }, { field: 'EPD Number', value: 'EPD-SIK-2024-042', confidence: 0.99 }], provenance: { hash: 'h3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2', source: 'EPD Registry', verifiedBy: 'IBU' } },
  { id: 'h-d4', fileName: 'GCCA_Sector_Benchmark_2024.pdf', type: 'Report', supplier: 'GCCA', uploadDate: '2024-10-30', ocrStatus: 'Complete', extractedFields: [{ field: 'Sector Average CO2/t', value: '610 kgCO2/t cem', confidence: 0.95 }, { field: 'Best-in-class', value: '420 kgCO2/t cem', confidence: 0.93 }, { field: 'Year', value: '2023', confidence: 0.99 }], provenance: { hash: 'h4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3', source: 'GCCA Portal', verifiedBy: 'GCCA' } },
  { id: 'h-d5', fileName: 'LEILAC_CCS_PilotResults.pdf', type: 'Report', supplier: 'LEILAC Technology', uploadDate: '2024-11-22', ocrStatus: 'Complete', extractedFields: [{ field: 'Capture Rate', value: '95%', confidence: 0.91 }, { field: 'CO2 Captured', value: '12,400 tCO2', confidence: 0.88 }, { field: 'Energy Penalty', value: '18%', confidence: 0.85 }], provenance: { hash: 'h5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4', source: 'Project Portal', verifiedBy: 'DNV' } },
  { id: 'h-d6', fileName: 'FLSmidth_KilnUpgrade_EPD.pdf', type: 'Declaration', supplier: 'FLSmidth', uploadDate: '2024-10-28', ocrStatus: 'Complete', extractedFields: [{ field: 'Equipment', value: 'OK 36-4 Cement Mill', confidence: 0.97 }, { field: 'Energy Savings', value: '22%', confidence: 0.90 }, { field: 'Lifecycle CO2', value: '12,000 tCO2e/unit', confidence: 0.82 }], provenance: { hash: 'h6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5', source: 'Supplier Portal', verifiedBy: 'FLSmidth' } },
];

const danoneEvidence = [
  { id: 'd-d1', fileName: 'Dairy_Coop_CoolFarmTool_2024.pdf', type: 'Report', supplier: 'EU Dairy Farm Cooperatives', uploadDate: '2024-11-25', ocrStatus: 'Complete', extractedFields: [{ field: 'Avg EF per litre', value: '1.29 kgCO2e/L', confidence: 0.88 }, { field: 'Farms Covered', value: '15,200', confidence: 0.95 }, { field: 'Methane Share', value: '62%', confidence: 0.90 }], provenance: { hash: 'd1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0', source: 'Cool Farm Tool', verifiedBy: 'Internal Audit' } },
  { id: 'd-d2', fileName: 'Fonterra_PCF_Report_2024.pdf', type: 'Report', supplier: 'Fonterra Co-operative', uploadDate: '2024-11-20', ocrStatus: 'Complete', extractedFields: [{ field: 'Milk Powder EF', value: '10.5 kgCO2e/kg', confidence: 0.94 }, { field: 'Farm Methane', value: '7.2 kgCO2e/kg FPCM', confidence: 0.91 }, { field: 'CDP Score', value: 'B+', confidence: 0.99 }], provenance: { hash: 'd2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1', source: 'Fonterra Portal', verifiedBy: 'Fonterra' } },
  { id: 'd-d3', fileName: 'Amcor_rPET_Certificate_2024.pdf', type: 'Certificate', supplier: 'Amcor / Berry Global', uploadDate: '2024-11-18', ocrStatus: 'Complete', extractedFields: [{ field: 'rPET Content', value: '35%', confidence: 0.98 }, { field: 'Certificate', value: 'ISCC PLUS', confidence: 0.99 }, { field: 'Valid Until', value: '2025-09-30', confidence: 0.97 }], provenance: { hash: 'd3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2', source: 'Supplier Portal', verifiedBy: 'ISCC' } },
  { id: 'd-d4', fileName: 'TetraPak_LCA_Carton_2024.pdf', type: 'Report', supplier: 'Tetra Pak', uploadDate: '2024-11-22', ocrStatus: 'Complete', extractedFields: [{ field: 'GWP per carton', value: '0.326 kgCO2e/unit', confidence: 0.96 }, { field: 'Renewable Content', value: '82%', confidence: 0.94 }, { field: 'FSC Certified', value: 'Yes', confidence: 0.99 }], provenance: { hash: 'd4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3', source: 'Tetra Pak LCA Portal', verifiedBy: 'IVL Swedish Environmental Research' } },
  { id: 'd-d5', fileName: 'Cargill_Soy_TraceReport_2024.pdf', type: 'Report', supplier: 'Cargill / Bunge', uploadDate: '2024-10-10', ocrStatus: 'Pending', extractedFields: [{ field: 'Deforestation-free', value: '92%', confidence: 0.85 }, { field: 'Origin', value: 'Cerrado/Mato Grosso', confidence: 0.82 }], provenance: { hash: 'd5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4', source: 'Cargill Triple S Platform', verifiedBy: 'Pending' } },
  { id: 'd-d6', fileName: 'DHL_ColdChain_CO2_Report.pdf', type: 'Report', supplier: 'DHL / XPO Logistics', uploadDate: '2024-11-15', ocrStatus: 'Complete', extractedFields: [{ field: 'Total Deliveries', value: '15M', confidence: 0.97 }, { field: 'EF per delivery', value: '0.193 kgCO2e/tkm', confidence: 0.89 }, { field: 'Refrigerant Leakage', value: '2.1%', confidence: 0.84 }], provenance: { hash: 'd6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5', source: 'DHL GoGreen', verifiedBy: 'DHL' } },
];

// ---------------------------------------------------------------------------
// Peer Benchmarks
// ---------------------------------------------------------------------------
const meridianBenchmarks = [
  { id: 'p0', company: 'Meridian GmbH', sector: 'Industrial Manufacturing', revenue: 420, tCO2eTotal: 391800, intensityPerRevenue: 932.9, scope3Pct: 78, sciApproved: true, cdpScore: 'A-', reductionTarget: '30% by 2030' },
  { id: 'p1', company: 'Voith Group', sector: 'Industrial Manufacturing', revenue: 510, tCO2eTotal: 485000, intensityPerRevenue: 951.0, scope3Pct: 72, sciApproved: true, cdpScore: 'B', reductionTarget: '25% by 2030' },
  { id: 'p2', company: 'GEA Group', sector: 'Industrial Manufacturing', revenue: 530, tCO2eTotal: 410000, intensityPerRevenue: 773.6, scope3Pct: 81, sciApproved: false, cdpScore: 'A-', reductionTarget: '35% by 2030' },
  { id: 'p3', company: 'Konecranes', sector: 'Industrial Manufacturing', revenue: 380, tCO2eTotal: 342000, intensityPerRevenue: 900.0, scope3Pct: 75, sciApproved: true, cdpScore: 'B', reductionTarget: '20% by 2028' },
  { id: 'p4', company: 'Andritz AG', sector: 'Industrial Manufacturing', revenue: 780, tCO2eTotal: 680000, intensityPerRevenue: 871.8, scope3Pct: 69, sciApproved: false, cdpScore: 'C', reductionTarget: '15% by 2030' },
  { id: 'p5', company: 'Metso Outotec', sector: 'Industrial Manufacturing', revenue: 490, tCO2eTotal: 395000, intensityPerRevenue: 806.1, scope3Pct: 82, sciApproved: true, cdpScore: 'A', reductionTarget: '42% by 2030' },
  { id: 'p6', company: 'Sulzer Ltd', sector: 'Industrial Manufacturing', revenue: 340, tCO2eTotal: 298000, intensityPerRevenue: 876.5, scope3Pct: 77, sciApproved: false, cdpScore: 'B', reductionTarget: '22% by 2029' },
];

const heidelbergBenchmarks = [
  { id: 'h-p0', company: 'Heidelberg Materials SE', sector: 'Construction Materials', revenue: 21100, tCO2eTotal: 21110000, intensityPerRevenue: 1000.5, scope3Pct: 52, sciApproved: true, cdpScore: 'B', reductionTarget: '24% by 2030' },
  { id: 'h-p1', company: 'Holcim Group', sector: 'Construction Materials', revenue: 26800, tCO2eTotal: 23400000, intensityPerRevenue: 873.1, scope3Pct: 48, sciApproved: true, cdpScore: 'A-', reductionTarget: '22% by 2030' },
  { id: 'h-p2', company: 'CRH plc', sector: 'Construction Materials', revenue: 34900, tCO2eTotal: 26200000, intensityPerRevenue: 750.7, scope3Pct: 55, sciApproved: true, cdpScore: 'B', reductionTarget: '30% by 2030' },
  { id: 'h-p3', company: 'Buzzi Unicem', sector: 'Construction Materials', revenue: 4200, tCO2eTotal: 4800000, intensityPerRevenue: 1142.9, scope3Pct: 42, sciApproved: false, cdpScore: 'C', reductionTarget: '15% by 2030' },
  { id: 'h-p4', company: 'Cemex SAB', sector: 'Construction Materials', revenue: 15800, tCO2eTotal: 18500000, intensityPerRevenue: 1170.9, scope3Pct: 46, sciApproved: true, cdpScore: 'B', reductionTarget: '35% by 2030' },
  { id: 'h-p5', company: 'Vicat SA', sector: 'Construction Materials', revenue: 3900, tCO2eTotal: 4200000, intensityPerRevenue: 1076.9, scope3Pct: 44, sciApproved: false, cdpScore: 'C+', reductionTarget: '20% by 2030' },
];

const danoneBenchmarks = [
  { id: 'd-p0', company: 'Groupe Danone SA', sector: 'Food & Beverage', revenue: 27600, tCO2eTotal: 24100000, intensityPerRevenue: 873.2, scope3Pct: 89, sciApproved: true, cdpScore: 'A-', reductionTarget: '30% by 2030' },
  { id: 'd-p1', company: 'Nestle SA', sector: 'Food & Beverage', revenue: 93000, tCO2eTotal: 68000000, intensityPerRevenue: 731.2, scope3Pct: 92, sciApproved: true, cdpScore: 'A', reductionTarget: '50% by 2030' },
  { id: 'd-p2', company: 'Unilever plc', sector: 'Food & Beverage', revenue: 59600, tCO2eTotal: 45000000, intensityPerRevenue: 755.0, scope3Pct: 90, sciApproved: true, cdpScore: 'A', reductionTarget: '42% by 2030' },
  { id: 'd-p3', company: 'Mondelez International', sector: 'Food & Beverage', revenue: 36000, tCO2eTotal: 28500000, intensityPerRevenue: 791.7, scope3Pct: 88, sciApproved: true, cdpScore: 'B+', reductionTarget: '35% by 2030' },
  { id: 'd-p4', company: 'Kerry Group', sector: 'Food & Beverage', revenue: 8100, tCO2eTotal: 5400000, intensityPerRevenue: 666.7, scope3Pct: 85, sciApproved: false, cdpScore: 'B', reductionTarget: '25% by 2030' },
  { id: 'd-p5', company: 'DSM-Firmenich', sector: 'Food & Beverage', revenue: 12400, tCO2eTotal: 7800000, intensityPerRevenue: 629.0, scope3Pct: 82, sciApproved: true, cdpScore: 'A-', reductionTarget: '40% by 2030' },
];

// ---------------------------------------------------------------------------
// Recommendations
// ---------------------------------------------------------------------------
const meridianRecommendations = [
  { id: 'r1', title: 'Switch to renewable energy suppliers', description: 'Transition top 5 energy-intensive suppliers to certified renewable energy sources, reducing Scope 3 Category 1 emissions.', category: 'Energy Transition', estimatedReduction: 28400, estimatedCost: 180000, paybackYears: 2.4, priority: 'Critical', status: 'In Progress', linkedSuppliers: ['s1', 's4', 's8'] },
  { id: 'r2', title: 'Implement supplier carbon scorecards', description: 'Deploy quarterly carbon performance scorecards for all tier-1 suppliers with >EUR 1M annual spend.', category: 'Supplier Engagement', estimatedReduction: 15200, estimatedCost: 45000, paybackYears: 1.2, priority: 'High', status: 'Approved', linkedSuppliers: ['s1', 's2', 's3', 's4', 's5'] },
  { id: 'r3', title: 'Optimize logistics network', description: 'Consolidate shipping routes and shift 30% of freight from air to rail/sea to reduce transportation emissions.', category: 'Transportation', estimatedReduction: 9800, estimatedCost: 120000, paybackYears: 3.1, priority: 'High', status: 'In Progress', linkedSuppliers: ['s5', 's9'] },
  { id: 'r4', title: 'Circular materials program', description: 'Increase recycled material content to 40% across raw material suppliers, focusing on steel and aluminum.', category: 'Materials', estimatedReduction: 22100, estimatedCost: 250000, paybackYears: 4.5, priority: 'Medium', status: 'Proposed', linkedSuppliers: ['s4', 's8'] },
  { id: 'r5', title: 'Low-carbon procurement policy', description: 'Mandate carbon disclosure for all new supplier contracts and set maximum intensity thresholds.', category: 'Policy', estimatedReduction: 18900, estimatedCost: 25000, paybackYears: 0.8, priority: 'Critical', status: 'Approved', linkedSuppliers: [] },
  { id: 'r6', title: 'Supplier SBTi onboarding program', description: 'Fund and support 10 key suppliers in setting validated Science Based Targets.', category: 'Supplier Engagement', estimatedReduction: 34500, estimatedCost: 95000, paybackYears: 1.8, priority: 'Critical', status: 'In Progress', linkedSuppliers: ['s3', 's4', 's6', 's8', 's10'] },
];

const heidelbergRecommendations = [
  { id: 'h-r1', title: 'Accelerate alternative fuel substitution to 55%', description: 'Increase RDF/SRF and biomass co-processing from 38% to 55% thermal substitution, displacing coal and petcoke in kilns.', category: 'Energy Transition', estimatedReduction: 1200000, estimatedCost: 45000000, paybackYears: 3.8, priority: 'Critical', status: 'In Progress', linkedSuppliers: ['h-s1', 'h-s8'] },
  { id: 'h-r2', title: 'Deploy CCUS at 3 major cement plants', description: 'Scale carbon capture from pilot to commercial at Brevik, Slite, and Edmonton plants targeting 3 MtCO2/yr capture.', category: 'Carbon Capture', estimatedReduction: 3000000, estimatedCost: 1500000000, paybackYears: 12.0, priority: 'Critical', status: 'In Progress', linkedSuppliers: ['h-s5'] },
  { id: 'h-r3', title: 'Reduce clinker ratio to 0.60', description: 'Increase SCM usage (slag, fly ash, calcined clay) to achieve clinker-to-cement ratio of 0.60, reducing process CO2.', category: 'Materials', estimatedReduction: 800000, estimatedCost: 120000000, paybackYears: 6.5, priority: 'High', status: 'Approved', linkedSuppliers: ['h-s7'] },
  { id: 'h-r4', title: 'Electrify ready-mix delivery fleet', description: 'Convert 30% of concrete mixer truck fleet to electric, starting with urban delivery routes.', category: 'Transportation', estimatedReduction: 450000, estimatedCost: 280000000, paybackYears: 8.0, priority: 'Medium', status: 'Proposed', linkedSuppliers: [] },
  { id: 'h-r5', title: 'Switch to renewable electricity PPAs', description: 'Secure long-term renewable power purchase agreements covering 80% of grid electricity needs.', category: 'Energy Transition', estimatedReduction: 1560000, estimatedCost: 200000000, paybackYears: 4.5, priority: 'High', status: 'In Progress', linkedSuppliers: ['h-s2'] },
  { id: 'h-r6', title: 'Launch green cement product line', description: 'Commercialise LC3 cement and net-zero concrete products with verified EPDs targeting green building specifications.', category: 'Product Innovation', estimatedReduction: 500000, estimatedCost: 85000000, paybackYears: 5.0, priority: 'High', status: 'Approved', linkedSuppliers: ['h-s3', 'h-s6'] },
];

const danoneRecommendations = [
  { id: 'd-r1', title: 'Scale regenerative agriculture to 50,000 farms', description: 'Expand regenerative dairy farming programme from 15,200 to 50,000 farms, reducing methane through feed additives and grazing management.', category: 'Agriculture', estimatedReduction: 2550000, estimatedCost: 180000000, paybackYears: 5.5, priority: 'Critical', status: 'In Progress', linkedSuppliers: ['d-s1', 'd-s2'] },
  { id: 'd-r2', title: 'Achieve 100% recyclable packaging by 2027', description: 'Redesign remaining 35% of non-recyclable packaging, switch to mono-material PET and paper-based alternatives.', category: 'Packaging', estimatedReduction: 890000, estimatedCost: 250000000, paybackYears: 7.0, priority: 'Critical', status: 'In Progress', linkedSuppliers: ['d-s3', 'd-s4'] },
  { id: 'd-r3', title: 'Eliminate deforestation in soy supply chain', description: 'Achieve 100% deforestation-free soy sourcing through certified supply chains and satellite monitoring.', category: 'Supply Chain', estimatedReduction: 480000, estimatedCost: 45000000, paybackYears: 4.0, priority: 'High', status: 'Approved', linkedSuppliers: ['d-s5'] },
  { id: 'd-r4', title: 'Transition cold chain to natural refrigerants', description: 'Replace HFC refrigerants with CO2 and propane systems across cold chain, reducing refrigerant leakage emissions.', category: 'Transportation', estimatedReduction: 340000, estimatedCost: 120000000, paybackYears: 6.0, priority: 'High', status: 'Proposed', linkedSuppliers: ['d-s7'] },
  { id: 'd-r5', title: '100% renewable energy in own operations', description: 'Achieve 100% renewable electricity and transition gas boilers to electric/biomass across all 60+ factories.', category: 'Energy Transition', estimatedReduction: 1200000, estimatedCost: 300000000, paybackYears: 5.0, priority: 'High', status: 'In Progress', linkedSuppliers: ['d-s8'] },
  { id: 'd-r6', title: 'Deploy methane-reducing feed additives (3-NOP)', description: 'Fund 3-NOP (Bovaer) feed additive distribution to partner dairy farms, reducing enteric methane by 30%.', category: 'Agriculture', estimatedReduction: 2100000, estimatedCost: 95000000, paybackYears: 3.5, priority: 'Critical', status: 'Approved', linkedSuppliers: ['d-s1'] },
];

// ---------------------------------------------------------------------------
// Quality Anomalies
// ---------------------------------------------------------------------------
const meridianAnomalies = [
  { id: 'q1', type: 'Outlier', description: 'Tata Steel emissions 3.2x higher than sector median', severity: 'High', affectedRows: 14, suggestedAction: 'Verify emission factor applied for hot-rolled steel', status: 'Open' },
  { id: 'q2', type: 'Missing Data', description: 'Samsung SDI Q2 2024 data not submitted', severity: 'Medium', affectedRows: 0, suggestedAction: 'Send follow-up request to supplier', status: 'Open' },
  { id: 'q3', type: 'Duplicate', description: 'Two identical invoices from BASF for Q3', severity: 'Low', affectedRows: 2, suggestedAction: 'Remove duplicate entry ID-4821', status: 'Resolved' },
  { id: 'q4', type: 'Unit Mismatch', description: 'Maersk report uses TEU-miles instead of TEU-km', severity: 'Medium', affectedRows: 340, suggestedAction: 'Apply conversion factor 1.60934', status: 'In Progress' },
  { id: 'q5', type: 'Outlier', description: 'DHL shipping emissions dropped 82% YoY - verify', severity: 'High', affectedRows: 28, suggestedAction: 'Cross-reference with logistics volume data', status: 'Open' },
];

const heidelbergAnomalies = [
  { id: 'h-q1', type: 'Outlier', description: 'RDF biogenic carbon fraction inconsistent across plants (38-52%)', severity: 'High', affectedRows: 24, suggestedAction: 'Standardise 14C testing protocol across all kiln lines', status: 'Open' },
  { id: 'h-q2', type: 'Missing Data', description: 'Indonesia plant electricity data missing for Q3 2024', severity: 'Medium', affectedRows: 0, suggestedAction: 'Request data from local utility provider', status: 'Open' },
  { id: 'h-q3', type: 'Unit Mismatch', description: 'India plant reporting clinker in short tons not metric tonnes', severity: 'Medium', affectedRows: 156, suggestedAction: 'Apply conversion factor 0.907185', status: 'In Progress' },
  { id: 'h-q4', type: 'Outlier', description: 'LEILAC CCS pilot capture rate 95% exceeds TRL-6 expectation of 85%', severity: 'Low', affectedRows: 8, suggestedAction: 'Verify with DNV third-party audit results', status: 'Open' },
  { id: 'h-q5', type: 'Missing Data', description: 'Scope 3 Category 11 (use of sold products) not yet estimated', severity: 'High', affectedRows: 0, suggestedAction: 'Develop concrete carbonation model with GCCA methodology', status: 'Open' },
];

const danoneAnomalies = [
  { id: 'd-q1', type: 'Outlier', description: 'Dairy methane EF variance: France 1.05 vs NZ 1.58 kgCO2e/L', severity: 'High', affectedRows: 42, suggestedAction: 'Verify regional FAO GLEAM factors and adjust for feed mix differences', status: 'Open' },
  { id: 'd-q2', type: 'Missing Data', description: 'Palm oil traceability data missing for 8% of volume (Indonesia)', severity: 'High', affectedRows: 0, suggestedAction: 'Escalate to Cargill EUDR compliance team', status: 'Open' },
  { id: 'd-q3', type: 'Duplicate', description: 'Tetra Pak LCA data submitted twice for Alpro Belgium plant', severity: 'Low', affectedRows: 3, suggestedAction: 'Remove duplicate submission D-PR-004-DUP', status: 'Resolved' },
  { id: 'd-q4', type: 'Unit Mismatch', description: 'Fonterra reports in kg FPCM, Danone systems use litres', severity: 'Medium', affectedRows: 280, suggestedAction: 'Apply FPCM-to-litre conversion (1 kg FPCM = 0.97 L)', status: 'In Progress' },
  { id: 'd-q5', type: 'Outlier', description: 'Cold chain refrigerant leakage rate 2.1% below industry avg 5%', severity: 'Low', affectedRows: 15, suggestedAction: 'Validate with carrier maintenance logs', status: 'Open' },
];

// ---------------------------------------------------------------------------
// Engagement Tracking
// ---------------------------------------------------------------------------
const meridianEngagement = [
  { id: 'e1', supplierId: 's1', supplierName: 'Bosch Rexroth', action: 'Sent carbon disclosure questionnaire', date: '2024-10-01', status: 'Completed', channel: 'Email', notes: 'Full response received within 14 days.' },
  { id: 'e2', supplierId: 's1', supplierName: 'Bosch Rexroth', action: 'SBTi alignment workshop', date: '2024-10-28', status: 'Completed', channel: 'Meeting', notes: 'Agreed on 15% reduction by 2028.' },
  { id: 'e3', supplierId: 's1', supplierName: 'Bosch Rexroth', action: 'Q3 performance review', date: '2024-11-15', status: 'Completed', channel: 'Portal', notes: 'Scorecard published. Rating: A.' },
  { id: 'e4', supplierId: 's2', supplierName: 'Schneider Electric', action: 'Initial outreach - CDP alignment', date: '2024-09-15', status: 'Completed', channel: 'Email', notes: 'Positive response. Already CDP participant.' },
  { id: 'e5', supplierId: 's2', supplierName: 'Schneider Electric', action: 'Joint decarbonization roadmap meeting', date: '2024-10-22', status: 'Completed', channel: 'Meeting', notes: 'Roadmap aligned with 25% target by 2030.' },
  { id: 'e6', supplierId: 's3', supplierName: 'BASF SE', action: 'Sent carbon disclosure questionnaire', date: '2024-09-01', status: 'Pending', channel: 'Email', notes: 'Follow-up sent on Oct 5. No response yet.' },
  { id: 'e7', supplierId: 's3', supplierName: 'BASF SE', action: 'Escalation to procurement lead', date: '2024-10-20', status: 'In Progress', channel: 'Internal', notes: 'Procurement team engaging BASF account manager.' },
  { id: 'e8', supplierId: 's4', supplierName: 'Tata Steel Europe', action: 'Data quality issue flagged', date: '2024-10-15', status: 'In Progress', channel: 'Portal', notes: 'Emissions figure 3.2x above sector median.' },
  { id: 'e9', supplierId: 's5', supplierName: 'Maersk Logistics', action: 'Green logistics program enrollment', date: '2024-09-20', status: 'Completed', channel: 'Meeting', notes: 'Enrolled in Maersk ECO Delivery program.' },
  { id: 'e10', supplierId: 's6', supplierName: 'Samsung SDI', action: 'Initial outreach email', date: '2024-09-10', status: 'Pending', channel: 'Email', notes: 'No response after 2 follow-ups.' },
  { id: 'e11', supplierId: 's7', supplierName: 'Siemens Energy', action: 'SBTi validation completed', date: '2024-08-15', status: 'Completed', channel: 'External', notes: 'Targets validated by SBTi. 30% by 2030.' },
  { id: 'e12', supplierId: 's9', supplierName: 'DHL Supply Chain', action: 'GoGreen Plus certification review', date: '2024-11-14', status: 'Completed', channel: 'Portal', notes: 'Certificate verified via SGS.' },
];

const heidelbergEngagement = [
  { id: 'h-e1', supplierId: 'h-s1', supplierName: 'Glencore International', action: 'Fuel quality and emissions data request', date: '2024-09-15', status: 'Completed', channel: 'Email', notes: 'CV and sulphur content data received.' },
  { id: 'h-e2', supplierId: 'h-s1', supplierName: 'Glencore International', action: 'Low-carbon fuel transition discussion', date: '2024-10-28', status: 'In Progress', channel: 'Meeting', notes: 'Exploring bio-coal and torrefied biomass options.' },
  { id: 'h-e3', supplierId: 'h-s2', supplierName: 'RWE Supply & Trading', action: 'Renewable PPA negotiation', date: '2024-10-10', status: 'In Progress', channel: 'Meeting', notes: '10-year PPA for 80% renewable electricity under discussion.' },
  { id: 'h-e4', supplierId: 'h-s3', supplierName: 'Sika AG', action: 'EPD data exchange', date: '2024-11-18', status: 'Completed', channel: 'Portal', notes: 'Full EPD data received for all admixture products.' },
  { id: 'h-e5', supplierId: 'h-s5', supplierName: 'LEILAC Technology', action: 'CCS pilot progress review', date: '2024-11-22', status: 'Completed', channel: 'Meeting', notes: '95% capture rate achieved in pilot. Scaling plan reviewed.' },
  { id: 'h-e6', supplierId: 'h-s5', supplierName: 'LEILAC Technology', action: 'DNV third-party verification initiated', date: '2024-12-01', status: 'Pending', channel: 'External', notes: 'Verification expected Q1 2025.' },
  { id: 'h-e7', supplierId: 'h-s6', supplierName: 'FLSmidth', action: 'Kiln efficiency upgrade proposal', date: '2024-10-28', status: 'Completed', channel: 'Meeting', notes: '22% energy savings demonstrated. 8 unit order placed.' },
  { id: 'h-e8', supplierId: 'h-s7', supplierName: 'ArcelorMittal (Slag)', action: 'DRI transition impact assessment', date: '2024-10-15', status: 'Pending', channel: 'Email', notes: 'Requested updated slag EF reflecting DRI shift.' },
  { id: 'h-e9', supplierId: 'h-s8', supplierName: 'Waste Management Partners', action: 'RDF quality certification audit', date: '2024-11-08', status: 'Completed', channel: 'Portal', notes: 'Bio-content verified at 45%. Meets kiln spec.' },
  { id: 'h-e10', supplierId: 'h-s4', supplierName: 'DB Cargo', action: 'Modal shift feasibility study', date: '2024-11-10', status: 'Completed', channel: 'Meeting', notes: 'Additional 15% of cement volume shiftable to rail by 2026.' },
];

const danoneEngagement = [
  { id: 'd-e1', supplierId: 'd-s1', supplierName: 'EU Dairy Farm Cooperatives', action: 'Regenerative agriculture programme launch', date: '2024-06-01', status: 'Completed', channel: 'Meeting', notes: '5,000 new farms enrolled in regen programme.' },
  { id: 'd-e2', supplierId: 'd-s1', supplierName: 'EU Dairy Farm Cooperatives', action: 'Methane feed additive trial (3-NOP)', date: '2024-09-15', status: 'In Progress', channel: 'Meeting', notes: '500 farms in Bovaer trial. Preliminary results show 28% CH4 reduction.' },
  { id: 'd-e3', supplierId: 'd-s2', supplierName: 'Fonterra Co-operative', action: 'PCF data exchange agreement', date: '2024-10-20', status: 'Completed', channel: 'Portal', notes: 'Product carbon footprint data for all milk powder SKUs received.' },
  { id: 'd-e4', supplierId: 'd-s3', supplierName: 'Amcor / Berry Global', action: 'rPET content roadmap meeting', date: '2024-11-18', status: 'Completed', channel: 'Meeting', notes: 'Agreed 50% rPET target by 2026 for all water bottles.' },
  { id: 'd-e5', supplierId: 'd-s4', supplierName: 'Tetra Pak', action: 'Paper-based cap rollout discussion', date: '2024-11-22', status: 'In Progress', channel: 'Meeting', notes: 'Plant-based cap pilot starting Q1 2025 on Alpro SKUs.' },
  { id: 'd-e6', supplierId: 'd-s5', supplierName: 'Cargill / Bunge', action: 'EUDR compliance assessment', date: '2024-10-10', status: 'Pending', channel: 'Email', notes: 'Traceability data for 92% of volume. Remaining 8% under review.' },
  { id: 'd-e7', supplierId: 'd-s5', supplierName: 'Cargill / Bunge', action: 'Satellite monitoring partnership', date: '2024-11-05', status: 'In Progress', channel: 'Meeting', notes: 'Deploying Starling deforestation monitoring for soy sourcing regions.' },
  { id: 'd-e8', supplierId: 'd-s7', supplierName: 'DHL / XPO Logistics', action: 'Natural refrigerant pilot', date: '2024-11-15', status: 'Completed', channel: 'Meeting', notes: '50 trucks converted to CO2 refrigerant. 60% leakage reduction.' },
  { id: 'd-e9', supplierId: 'd-s8', supplierName: 'EDF / Engie', action: 'Renewable PPA signing', date: '2024-11-28', status: 'Completed', channel: 'External', notes: '15-year solar PPA signed. Covers 40% of French factory electricity.' },
  { id: 'd-e10', supplierId: 'd-s10', supplierName: 'Oat Farmers Cooperative (Alpro)', action: 'Regen agriculture pledge', date: '2024-11-05', status: 'Completed', channel: 'Meeting', notes: 'All cooperative members committed to cover crop and no-till practices.' },
];

// ---------------------------------------------------------------------------
// Data maps & exports
// ---------------------------------------------------------------------------
const maps = {
  suppliers: { meridian: meridianSuppliers, heidelberg: heidelbergSuppliers, danone: danoneSuppliers },
  evidence: { meridian: meridianEvidence, heidelberg: heidelbergEvidence, danone: danoneEvidence },
  benchmarks: { meridian: meridianBenchmarks, heidelberg: heidelbergBenchmarks, danone: danoneBenchmarks },
  recommendations: { meridian: meridianRecommendations, heidelberg: heidelbergRecommendations, danone: danoneRecommendations },
  anomalies: { meridian: meridianAnomalies, heidelberg: heidelbergAnomalies, danone: danoneAnomalies },
  engagement: { meridian: meridianEngagement, heidelberg: heidelbergEngagement, danone: danoneEngagement },
};

export function getSupplierProfiles(id) { return maps.suppliers[id] || meridianSuppliers; }
export function getEvidenceDocuments(id) { return maps.evidence[id] || meridianEvidence; }
export function getPeerBenchmarks(id) { return maps.benchmarks[id] || meridianBenchmarks; }
export function getRecommendations(id) { return maps.recommendations[id] || meridianRecommendations; }
export function getQualityAnomalies(id) { return maps.anomalies[id] || meridianAnomalies; }
export function getEngagementTracking(id) { return maps.engagement[id] || meridianEngagement; }
