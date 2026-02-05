// Calculation data per company — procurement, emission factors, compute results, gap analysis, audit trail, hotspots, emissions summary

// ===== EMISSIONS SUMMARIES =====
const summaries = {
  meridian: { scope1: 45200, scope2: 28100, scope3: 318500, total: 391800 },
  heidelberg: { scope1: 8200000, scope2: 1950000, scope3: 10960000, total: 21110000 },
  danone: { scope1: 1850000, scope2: 820000, scope3: 21430000, total: 24100000 },
};

// ===== HOTSPOTS =====
const meridianHotspots = [
  { id: 'HS-001', category: 'Capital Goods', tCO2e: 168900, pctOfTotal: 43.1, trend: 'up', topSupplier: 'Siemens AG', reductionPotential: 'Medium' },
  { id: 'HS-002', category: 'Transport', tCO2e: 100620, pctOfTotal: 25.7, trend: 'down', topSupplier: 'Maersk Line', reductionPotential: 'High' },
  { id: 'HS-003', category: 'Steel & Metals', tCO2e: 76322, pctOfTotal: 19.5, trend: 'down', topSupplier: 'Rio Tinto Alcan', reductionPotential: 'High' },
  { id: 'HS-004', category: 'Chemicals', tCO2e: 57330, pctOfTotal: 14.6, trend: 'stable', topSupplier: 'Covestro AG', reductionPotential: 'Medium' },
  { id: 'HS-005', category: 'Energy', tCO2e: 10622, pctOfTotal: 2.7, trend: 'down', topSupplier: 'TotalEnergies SE', reductionPotential: 'High' },
  { id: 'HS-006', category: 'Packaging', tCO2e: 7644, pctOfTotal: 2.0, trend: 'stable', topSupplier: 'Smurfit Kappa', reductionPotential: 'Low' },
  { id: 'HS-007', category: 'Waste Management', tCO2e: 2275, pctOfTotal: 0.6, trend: 'down', topSupplier: 'Veolia Environnement', reductionPotential: 'Low' },
];

const heidelbergHotspots = [
  { id: 'H-HS-001', category: 'Clinker Production (Process)', tCO2e: 5740000, pctOfTotal: 27.2, trend: 'down', topSupplier: 'Own Operations', reductionPotential: 'Medium' },
  { id: 'H-HS-002', category: 'Kiln Fuel Combustion', tCO2e: 2460000, pctOfTotal: 11.7, trend: 'down', topSupplier: 'Own Operations', reductionPotential: 'High' },
  { id: 'H-HS-003', category: 'Electricity (Grid)', tCO2e: 1950000, pctOfTotal: 9.2, trend: 'down', topSupplier: 'Various Grid Operators', reductionPotential: 'High' },
  { id: 'H-HS-004', category: 'Purchased Fuels (Coal/Petcoke)', tCO2e: 4380000, pctOfTotal: 20.7, trend: 'down', topSupplier: 'Glencore Energy', reductionPotential: 'High' },
  { id: 'H-HS-005', category: 'Transport & Logistics', tCO2e: 3290000, pctOfTotal: 15.6, trend: 'stable', topSupplier: 'Own Fleet + Contractors', reductionPotential: 'Medium' },
  { id: 'H-HS-006', category: 'Raw Materials (Limestone)', tCO2e: 2190000, pctOfTotal: 10.4, trend: 'stable', topSupplier: 'Own Quarries', reductionPotential: 'Low' },
  { id: 'H-HS-007', category: 'Downstream (Use of Products)', tCO2e: 1100000, pctOfTotal: 5.2, trend: 'down', topSupplier: 'End-Use Construction', reductionPotential: 'Low' },
];

const danoneHotspots = [
  { id: 'D-HS-001', category: 'Dairy Farming (Methane)', tCO2e: 8500000, pctOfTotal: 35.3, trend: 'down', topSupplier: 'Dairy Farm Cooperatives', reductionPotential: 'Medium' },
  { id: 'D-HS-002', category: 'Agricultural Feed & Crops', tCO2e: 5140000, pctOfTotal: 21.3, trend: 'down', topSupplier: 'Cargill / ADM', reductionPotential: 'Medium' },
  { id: 'D-HS-003', category: 'Packaging Materials', tCO2e: 3620000, pctOfTotal: 15.0, trend: 'down', topSupplier: 'Amcor / Tetra Pak', reductionPotential: 'High' },
  { id: 'D-HS-004', category: 'Transport & Cold Chain', tCO2e: 2890000, pctOfTotal: 12.0, trend: 'stable', topSupplier: 'DHL / XPO Logistics', reductionPotential: 'Medium' },
  { id: 'D-HS-005', category: 'Manufacturing Energy', tCO2e: 2670000, pctOfTotal: 11.1, trend: 'down', topSupplier: 'Own Operations', reductionPotential: 'High' },
  { id: 'D-HS-006', category: 'Water Sourcing & Treatment', tCO2e: 720000, pctOfTotal: 3.0, trend: 'stable', topSupplier: 'Own Operations', reductionPotential: 'Medium' },
  { id: 'D-HS-007', category: 'End-of-Life Packaging', tCO2e: 560000, pctOfTotal: 2.3, trend: 'down', topSupplier: 'Waste Processors', reductionPotential: 'High' },
];

// ===== PROCUREMENT DATA =====
const meridianProcurement = [
  { id: 'PR-001', supplier: 'BASF SE', category: 'Chemicals', subcategory: 'Industrial Chemicals', description: 'Polyurethane raw materials', amount: 12450000, currency: 'EUR', unit: 'tonnes', quantity: 8500, period: 'FY2024', division: 'Manufacturing', country: 'Germany', emissionFactorId: 'EF-001' },
  { id: 'PR-002', supplier: 'ThyssenKrupp AG', category: 'Steel & Metals', subcategory: 'Flat Steel', description: 'Hot-rolled coil steel sheets', amount: 9800000, currency: 'EUR', unit: 'tonnes', quantity: 15000, period: 'FY2024', division: 'Manufacturing', country: 'Germany', emissionFactorId: 'EF-002' },
  { id: 'PR-003', supplier: 'TotalEnergies SE', category: 'Energy', subcategory: 'Natural Gas', description: 'Pipeline natural gas supply', amount: 7200000, currency: 'EUR', unit: 'MWh', quantity: 42000, period: 'FY2024', division: 'Operations', country: 'France', emissionFactorId: 'EF-003' },
  { id: 'PR-004', supplier: 'Maersk Line', category: 'Transport', subcategory: 'Ocean Freight', description: 'Container shipping - Asia to EU', amount: 5600000, currency: 'EUR', unit: 'TEU', quantity: 12000, period: 'FY2024', division: 'Logistics', country: 'Denmark', emissionFactorId: 'EF-004' },
  { id: 'PR-005', supplier: 'DHL Supply Chain', category: 'Transport', subcategory: 'Road Freight', description: 'EU last-mile distribution', amount: 3400000, currency: 'EUR', unit: 'shipments', quantity: 85000, period: 'FY2024', division: 'Logistics', country: 'Germany', emissionFactorId: 'EF-005' },
  { id: 'PR-006', supplier: 'Covestro AG', category: 'Chemicals', subcategory: 'Polymers', description: 'Polycarbonate resins', amount: 8100000, currency: 'EUR', unit: 'tonnes', quantity: 6200, period: 'FY2024', division: 'Manufacturing', country: 'Germany', emissionFactorId: 'EF-006' },
  { id: 'PR-007', supplier: 'Vattenfall AB', category: 'Energy', subcategory: 'Electricity', description: 'Renewable electricity supply', amount: 4500000, currency: 'EUR', unit: 'MWh', quantity: 38000, period: 'FY2024', division: 'Operations', country: 'Sweden', emissionFactorId: 'EF-007' },
  { id: 'PR-008', supplier: 'Rio Tinto Alcan', category: 'Steel & Metals', subcategory: 'Aluminium', description: 'Aluminium ingots & billets', amount: 6700000, currency: 'EUR', unit: 'tonnes', quantity: 4800, period: 'FY2024', division: 'Manufacturing', country: 'Australia', emissionFactorId: 'EF-008' },
  { id: 'PR-009', supplier: 'Schneider Electric', category: 'Capital Goods', subcategory: 'Electrical Equipment', description: 'Factory automation systems', amount: 4800000, currency: 'EUR', unit: 'units', quantity: 45, period: 'FY2024', division: 'Manufacturing', country: 'France', emissionFactorId: 'EF-011' },
  { id: 'PR-010', supplier: 'Siemens AG', category: 'Capital Goods', subcategory: 'Industrial Machinery', description: 'CNC machining centres', amount: 6200000, currency: 'EUR', unit: 'units', quantity: 12, period: 'FY2024', division: 'Manufacturing', country: 'Germany', emissionFactorId: 'EF-018' },
];

const heidelbergProcurement = [
  { id: 'H-PR-001', supplier: 'Own Quarries', category: 'Raw Materials', subcategory: 'Limestone', description: 'Limestone for clinker production', amount: 0, currency: 'EUR', unit: 'tonnes', quantity: 95000000, period: 'FY2024', division: 'Cement', country: 'Germany', emissionFactorId: 'H-EF-001' },
  { id: 'H-PR-002', supplier: 'Glencore International', category: 'Fuels', subcategory: 'Coal/Petcoke', description: 'Kiln fuel - coal and petroleum coke', amount: 2100000000, currency: 'EUR', unit: 'tonnes', quantity: 12500000, period: 'FY2024', division: 'Cement', country: 'Switzerland', emissionFactorId: 'H-EF-002' },
  { id: 'H-PR-003', supplier: 'RWE Supply & Trading', category: 'Energy', subcategory: 'Electricity', description: 'Grid electricity for cement mills', amount: 850000000, currency: 'EUR', unit: 'MWh', quantity: 12000000, period: 'FY2024', division: 'Operations', country: 'Germany', emissionFactorId: 'H-EF-003' },
  { id: 'H-PR-004', supplier: 'Sika AG', category: 'Chemicals', subcategory: 'Admixtures', description: 'Concrete admixtures and additives', amount: 320000000, currency: 'EUR', unit: 'tonnes', quantity: 450000, period: 'FY2024', division: 'Ready-Mixed Concrete', country: 'Switzerland', emissionFactorId: 'H-EF-004' },
  { id: 'H-PR-005', supplier: 'DB Cargo', category: 'Transport', subcategory: 'Rail Freight', description: 'Bulk cement transport by rail', amount: 180000000, currency: 'EUR', unit: 'tonne-km', quantity: 8500000000, period: 'FY2024', division: 'Logistics', country: 'Germany', emissionFactorId: 'H-EF-005' },
  { id: 'H-PR-006', supplier: 'Waste Management Partners', category: 'Alternative Fuels', subcategory: 'RDF/SRF', description: 'Refuse-derived fuel for kilns', amount: 95000000, currency: 'EUR', unit: 'tonnes', quantity: 4200000, period: 'FY2024', division: 'Cement', country: 'Various', emissionFactorId: 'H-EF-006' },
  { id: 'H-PR-007', supplier: 'LEILAC Technology', category: 'Capital Goods', subcategory: 'CCS Equipment', description: 'Carbon capture pilot equipment', amount: 250000000, currency: 'EUR', unit: 'units', quantity: 2, period: 'FY2024', division: 'Cement', country: 'Belgium', emissionFactorId: 'H-EF-007' },
  { id: 'H-PR-008', supplier: 'FLSmidth', category: 'Capital Goods', subcategory: 'Kiln Equipment', description: 'Rotary kiln components and upgrades', amount: 180000000, currency: 'EUR', unit: 'units', quantity: 8, period: 'FY2024', division: 'Cement', country: 'Denmark', emissionFactorId: 'H-EF-008' },
  { id: 'H-PR-009', supplier: 'Own Fleet', category: 'Transport', subcategory: 'Road Freight', description: 'Ready-mix concrete delivery fleet', amount: 420000000, currency: 'EUR', unit: 'deliveries', quantity: 8500000, period: 'FY2024', division: 'Ready-Mixed Concrete', country: 'Various', emissionFactorId: 'H-EF-009' },
  { id: 'H-PR-010', supplier: 'ArcelorMittal', category: 'Raw Materials', subcategory: 'Slag', description: 'Blast furnace slag (SCM)', amount: 85000000, currency: 'EUR', unit: 'tonnes', quantity: 6500000, period: 'FY2024', division: 'Cement', country: 'Luxembourg', emissionFactorId: 'H-EF-010' },
];

const danoneProcurement = [
  { id: 'D-PR-001', supplier: 'Dairy Farm Cooperatives (EU)', category: 'Agricultural Raw Materials', subcategory: 'Raw Milk', description: 'Fresh cow milk from EU dairy farms', amount: 4200000000, currency: 'EUR', unit: 'litres', quantity: 6800000000, period: 'FY2024', division: 'Essential Dairy & Plant-Based', country: 'France', emissionFactorId: 'D-EF-001' },
  { id: 'D-PR-002', supplier: 'Fonterra Co-operative', category: 'Agricultural Raw Materials', subcategory: 'Milk Powder', description: 'Whole and skim milk powder', amount: 850000000, currency: 'EUR', unit: 'tonnes', quantity: 320000, period: 'FY2024', division: 'Specialised Nutrition', country: 'New Zealand', emissionFactorId: 'D-EF-002' },
  { id: 'D-PR-003', supplier: 'Amcor / Berry Global', category: 'Packaging', subcategory: 'Plastic Packaging', description: 'Yoghurt pots, bottles, films', amount: 1800000000, currency: 'EUR', unit: 'tonnes', quantity: 480000, period: 'FY2024', division: 'All', country: 'Various', emissionFactorId: 'D-EF-003' },
  { id: 'D-PR-004', supplier: 'Tetra Pak', category: 'Packaging', subcategory: 'Carton Packaging', description: 'Aseptic carton packaging', amount: 620000000, currency: 'EUR', unit: 'units', quantity: 12000000000, period: 'FY2024', division: 'Essential Dairy & Plant-Based', country: 'Sweden', emissionFactorId: 'D-EF-004' },
  { id: 'D-PR-005', supplier: 'Cargill / Bunge', category: 'Agricultural Raw Materials', subcategory: 'Soy & Oils', description: 'Soy protein, palm oil, sunflower oil', amount: 580000000, currency: 'EUR', unit: 'tonnes', quantity: 420000, period: 'FY2024', division: 'Essential Dairy & Plant-Based', country: 'Brazil', emissionFactorId: 'D-EF-005' },
  { id: 'D-PR-006', supplier: 'Sudzucker AG', category: 'Agricultural Raw Materials', subcategory: 'Sugar', description: 'Beet and cane sugar', amount: 340000000, currency: 'EUR', unit: 'tonnes', quantity: 580000, period: 'FY2024', division: 'Essential Dairy & Plant-Based', country: 'Germany', emissionFactorId: 'D-EF-006' },
  { id: 'D-PR-007', supplier: 'DHL / XPO Logistics', category: 'Transport', subcategory: 'Cold Chain Logistics', description: 'Refrigerated transport & warehousing', amount: 920000000, currency: 'EUR', unit: 'deliveries', quantity: 15000000, period: 'FY2024', division: 'All', country: 'Various', emissionFactorId: 'D-EF-007' },
  { id: 'D-PR-008', supplier: 'EDF / Engie', category: 'Energy', subcategory: 'Electricity & Gas', description: 'Factory electricity and natural gas', amount: 450000000, currency: 'EUR', unit: 'MWh', quantity: 3200000, period: 'FY2024', division: 'Operations', country: 'France', emissionFactorId: 'D-EF-008' },
  { id: 'D-PR-009', supplier: 'Veolia Water', category: 'Water', subcategory: 'Industrial Water', description: 'Process water for dairy operations', amount: 120000000, currency: 'EUR', unit: 'm3', quantity: 85000000, period: 'FY2024', division: 'Operations', country: 'Various', emissionFactorId: 'D-EF-009' },
  { id: 'D-PR-010', supplier: 'Oat Farmers Cooperative (Alpro)', category: 'Agricultural Raw Materials', subcategory: 'Plant-Based Ingredients', description: 'Oats, almonds, soy beans for plant-based products', amount: 280000000, currency: 'EUR', unit: 'tonnes', quantity: 190000, period: 'FY2024', division: 'Essential Dairy & Plant-Based', country: 'Belgium', emissionFactorId: 'D-EF-010' },
];

// ===== EMISSION FACTORS =====
const meridianFactors = [
  { id: 'EF-001', name: 'Industrial chemicals - bulk', category: 'Chemicals', value: 2.45, unit: 'kgCO2e/kg', source: 'DEFRA', region: 'EU', confidence: 'High', year: 2024 },
  { id: 'EF-002', name: 'Steel hot-rolled coil', category: 'Steel & Metals', value: 1.85, unit: 'kgCO2e/kg', source: 'ecoinvent', region: 'EU', confidence: 'High', year: 2024 },
  { id: 'EF-003', name: 'Natural gas combustion', category: 'Energy', value: 0.184, unit: 'kgCO2e/kWh', source: 'DEFRA', region: 'EU', confidence: 'High', year: 2024 },
  { id: 'EF-004', name: 'Container shipping', category: 'Transport', value: 0.016, unit: 'kgCO2e/tkm', source: 'GLEC', region: 'Global', confidence: 'Medium', year: 2024 },
  { id: 'EF-005', name: 'Road freight - articulated', category: 'Transport', value: 0.089, unit: 'kgCO2e/tkm', source: 'DEFRA', region: 'EU', confidence: 'High', year: 2024 },
  { id: 'EF-006', name: 'Polycarbonate resin', category: 'Chemicals', value: 5.12, unit: 'kgCO2e/kg', source: 'ecoinvent', region: 'EU', confidence: 'High', year: 2024 },
  { id: 'EF-007', name: 'Electricity grid - Sweden', category: 'Energy', value: 0.013, unit: 'kgCO2e/kWh', source: 'ecoinvent', region: 'SE', confidence: 'High', year: 2024 },
  { id: 'EF-008', name: 'Aluminium primary ingot', category: 'Steel & Metals', value: 8.24, unit: 'kgCO2e/kg', source: 'GaBi', region: 'Global', confidence: 'Medium', year: 2023 },
  { id: 'EF-011', name: 'Electrical equipment', category: 'Capital Goods', value: 420, unit: 'kgCO2e/unit', source: 'GaBi', region: 'EU', confidence: 'Low', year: 2023 },
  { id: 'EF-018', name: 'Industrial machinery', category: 'Capital Goods', value: 12500, unit: 'kgCO2e/unit', source: 'GaBi', region: 'EU', confidence: 'Low', year: 2022 },
];

const heidelbergFactors = [
  { id: 'H-EF-001', name: 'Limestone calcination (process CO2)', category: 'Raw Materials', value: 525, unit: 'kgCO2/t clinker', source: 'GCCA', region: 'Global', confidence: 'High', year: 2024 },
  { id: 'H-EF-002', name: 'Coal/petcoke combustion', category: 'Fuels', value: 2.42, unit: 'kgCO2e/kg', source: 'IPCC', region: 'Global', confidence: 'High', year: 2024 },
  { id: 'H-EF-003', name: 'Grid electricity (EU average)', category: 'Energy', value: 0.295, unit: 'kgCO2e/kWh', source: 'ecoinvent', region: 'EU', confidence: 'High', year: 2024 },
  { id: 'H-EF-004', name: 'Concrete admixtures', category: 'Chemicals', value: 1.8, unit: 'kgCO2e/kg', source: 'ecoinvent', region: 'EU', confidence: 'Medium', year: 2024 },
  { id: 'H-EF-005', name: 'Rail freight - bulk', category: 'Transport', value: 0.022, unit: 'kgCO2e/tkm', source: 'DEFRA', region: 'EU', confidence: 'High', year: 2024 },
  { id: 'H-EF-006', name: 'Alternative fuels (RDF)', category: 'Alternative Fuels', value: 0.9, unit: 'kgCO2e/kg', source: 'DEFRA', region: 'EU', confidence: 'Medium', year: 2024 },
  { id: 'H-EF-007', name: 'CCS equipment (lifecycle)', category: 'Capital Goods', value: 85000000, unit: 'kgCO2e/unit', source: 'Estimated', region: 'EU', confidence: 'Low', year: 2024 },
  { id: 'H-EF-008', name: 'Kiln components (lifecycle)', category: 'Capital Goods', value: 12000000, unit: 'kgCO2e/unit', source: 'GaBi', region: 'EU', confidence: 'Low', year: 2023 },
  { id: 'H-EF-009', name: 'Concrete mixer truck delivery', category: 'Transport', value: 0.145, unit: 'kgCO2e/tkm', source: 'DEFRA', region: 'EU', confidence: 'High', year: 2024 },
  { id: 'H-EF-010', name: 'Blast furnace slag (SCM)', category: 'Raw Materials', value: 0.07, unit: 'kgCO2e/kg', source: 'ecoinvent', region: 'EU', confidence: 'Medium', year: 2024 },
];

const danoneFactors = [
  { id: 'D-EF-001', name: 'Raw cow milk (farm gate)', category: 'Agricultural Raw Materials', value: 1.29, unit: 'kgCO2e/litre', source: 'FAO GLEAM', region: 'EU', confidence: 'Medium', year: 2024 },
  { id: 'D-EF-002', name: 'Milk powder (spray-dried)', category: 'Agricultural Raw Materials', value: 10.5, unit: 'kgCO2e/kg', source: 'ecoinvent', region: 'NZ', confidence: 'Medium', year: 2024 },
  { id: 'D-EF-003', name: 'PET packaging', category: 'Packaging', value: 3.4, unit: 'kgCO2e/kg', source: 'ecoinvent', region: 'EU', confidence: 'High', year: 2024 },
  { id: 'D-EF-004', name: 'Aseptic carton', category: 'Packaging', value: 0.326, unit: 'kgCO2e/unit', source: 'Tetra Pak LCA', region: 'EU', confidence: 'High', year: 2024 },
  { id: 'D-EF-005', name: 'Soy meal (incl. LUC)', category: 'Agricultural Raw Materials', value: 3.8, unit: 'kgCO2e/kg', source: 'ecoinvent', region: 'BR', confidence: 'Medium', year: 2024 },
  { id: 'D-EF-006', name: 'Beet sugar', category: 'Agricultural Raw Materials', value: 0.72, unit: 'kgCO2e/kg', source: 'DEFRA', region: 'EU', confidence: 'High', year: 2024 },
  { id: 'D-EF-007', name: 'Refrigerated road transport', category: 'Transport', value: 0.132, unit: 'kgCO2e/tkm', source: 'DEFRA', region: 'EU', confidence: 'High', year: 2024 },
  { id: 'D-EF-008', name: 'Grid electricity (France)', category: 'Energy', value: 0.052, unit: 'kgCO2e/kWh', source: 'ecoinvent', region: 'FR', confidence: 'High', year: 2024 },
  { id: 'D-EF-009', name: 'Industrial water treatment', category: 'Water', value: 0.344, unit: 'kgCO2e/m3', source: 'ecoinvent', region: 'EU', confidence: 'Medium', year: 2024 },
  { id: 'D-EF-010', name: 'Oat cultivation', category: 'Agricultural Raw Materials', value: 0.52, unit: 'kgCO2e/kg', source: 'ecoinvent', region: 'EU', confidence: 'High', year: 2024 },
];

// ===== COMPUTE RESULTS (simplified — 10 per company) =====
const meridianCompute = [
  { id: 'CR-001', procurementId: 'PR-001', category: 'Chemicals', supplier: 'BASF SE', activityValue: 8500, activityUnit: 'tonnes', emissionFactor: 2.45, factorUnit: 'kgCO2e/kg', factorSource: 'DEFRA', tCO2e: 20825, scope: 'Scope 3', dqsScore: 0.87, methodology: 'Spend-based' },
  { id: 'CR-002', procurementId: 'PR-002', category: 'Steel & Metals', supplier: 'ThyssenKrupp AG', activityValue: 15000, activityUnit: 'tonnes', emissionFactor: 1.85, factorUnit: 'kgCO2e/kg', factorSource: 'ecoinvent', tCO2e: 27750, scope: 'Scope 3', dqsScore: 0.91, methodology: 'Activity-based' },
  { id: 'CR-003', procurementId: 'PR-003', category: 'Energy', supplier: 'TotalEnergies SE', activityValue: 42000, activityUnit: 'MWh', emissionFactor: 0.184, factorUnit: 'kgCO2e/kWh', factorSource: 'DEFRA', tCO2e: 7728, scope: 'Scope 2', dqsScore: 0.93, methodology: 'Location-based' },
  { id: 'CR-004', procurementId: 'PR-004', category: 'Transport', supplier: 'Maersk Line', activityValue: 12000, activityUnit: 'TEU', emissionFactor: 0.016, factorUnit: 'kgCO2e/tkm', factorSource: 'GLEC', tCO2e: 48200, scope: 'Scope 3', dqsScore: 0.72, methodology: 'Distance-based' },
  { id: 'CR-005', procurementId: 'PR-005', category: 'Transport', supplier: 'DHL Supply Chain', activityValue: 85000, activityUnit: 'shipments', emissionFactor: 0.089, factorUnit: 'kgCO2e/tkm', factorSource: 'DEFRA', tCO2e: 18900, scope: 'Scope 3', dqsScore: 0.68, methodology: 'Spend-based' },
  { id: 'CR-006', procurementId: 'PR-006', category: 'Chemicals', supplier: 'Covestro AG', activityValue: 6200, activityUnit: 'tonnes', emissionFactor: 5.12, factorUnit: 'kgCO2e/kg', factorSource: 'ecoinvent', tCO2e: 31744, scope: 'Scope 3', dqsScore: 0.89, methodology: 'Activity-based' },
  { id: 'CR-007', procurementId: 'PR-007', category: 'Energy', supplier: 'Vattenfall AB', activityValue: 38000, activityUnit: 'MWh', emissionFactor: 0.013, factorUnit: 'kgCO2e/kWh', factorSource: 'ecoinvent', tCO2e: 494, scope: 'Scope 2', dqsScore: 0.95, methodology: 'Market-based' },
  { id: 'CR-008', procurementId: 'PR-008', category: 'Steel & Metals', supplier: 'Rio Tinto Alcan', activityValue: 4800, activityUnit: 'tonnes', emissionFactor: 8.24, factorUnit: 'kgCO2e/kg', factorSource: 'GaBi', tCO2e: 39552, scope: 'Scope 3', dqsScore: 0.76, methodology: 'Activity-based' },
  { id: 'CR-009', procurementId: 'PR-009', category: 'Capital Goods', supplier: 'Schneider Electric', activityValue: 45, activityUnit: 'units', emissionFactor: 420, factorUnit: 'kgCO2e/unit', factorSource: 'GaBi', tCO2e: 18900, scope: 'Scope 3', dqsScore: 0.55, methodology: 'Spend-based' },
  { id: 'CR-010', procurementId: 'PR-010', category: 'Capital Goods', supplier: 'Siemens AG', activityValue: 12, activityUnit: 'units', emissionFactor: 12500, factorUnit: 'kgCO2e/unit', factorSource: 'GaBi', tCO2e: 150000, scope: 'Scope 3', dqsScore: 0.48, methodology: 'Spend-based' },
];

const heidelbergCompute = [
  { id: 'H-CR-001', procurementId: 'H-PR-001', category: 'Raw Materials', supplier: 'Own Quarries', activityValue: 95000000, activityUnit: 'tonnes', emissionFactor: 525, factorUnit: 'kgCO2/t clinker', factorSource: 'GCCA', tCO2e: 5740000, scope: 'Scope 1', dqsScore: 0.95, methodology: 'Activity-based' },
  { id: 'H-CR-002', procurementId: 'H-PR-002', category: 'Fuels', supplier: 'Glencore International', activityValue: 12500000, activityUnit: 'tonnes', emissionFactor: 2.42, factorUnit: 'kgCO2e/kg', factorSource: 'IPCC', tCO2e: 2460000, scope: 'Scope 1', dqsScore: 0.92, methodology: 'Activity-based' },
  { id: 'H-CR-003', procurementId: 'H-PR-003', category: 'Energy', supplier: 'RWE Supply & Trading', activityValue: 12000000, activityUnit: 'MWh', emissionFactor: 0.295, factorUnit: 'kgCO2e/kWh', factorSource: 'ecoinvent', tCO2e: 1950000, scope: 'Scope 2', dqsScore: 0.88, methodology: 'Location-based' },
  { id: 'H-CR-004', procurementId: 'H-PR-004', category: 'Chemicals', supplier: 'Sika AG', activityValue: 450000, activityUnit: 'tonnes', emissionFactor: 1.8, factorUnit: 'kgCO2e/kg', factorSource: 'ecoinvent', tCO2e: 810000, scope: 'Scope 3', dqsScore: 0.78, methodology: 'Activity-based' },
  { id: 'H-CR-005', procurementId: 'H-PR-005', category: 'Transport', supplier: 'DB Cargo', activityValue: 8500000000, activityUnit: 'tonne-km', emissionFactor: 0.022, factorUnit: 'kgCO2e/tkm', factorSource: 'DEFRA', tCO2e: 187000, scope: 'Scope 3', dqsScore: 0.85, methodology: 'Distance-based' },
  { id: 'H-CR-006', procurementId: 'H-PR-006', category: 'Alternative Fuels', supplier: 'Waste Partners', activityValue: 4200000, activityUnit: 'tonnes', emissionFactor: 0.9, factorUnit: 'kgCO2e/kg', factorSource: 'DEFRA', tCO2e: 3780000, scope: 'Scope 1', dqsScore: 0.72, methodology: 'Activity-based' },
  { id: 'H-CR-007', procurementId: 'H-PR-007', category: 'Capital Goods', supplier: 'LEILAC', activityValue: 2, activityUnit: 'units', emissionFactor: 85000000, factorUnit: 'kgCO2e/unit', factorSource: 'Estimated', tCO2e: 170000, scope: 'Scope 3', dqsScore: 0.35, methodology: 'Spend-based' },
  { id: 'H-CR-008', procurementId: 'H-PR-008', category: 'Capital Goods', supplier: 'FLSmidth', activityValue: 8, activityUnit: 'units', emissionFactor: 12000000, factorUnit: 'kgCO2e/unit', factorSource: 'GaBi', tCO2e: 96000, scope: 'Scope 3', dqsScore: 0.42, methodology: 'Spend-based' },
  { id: 'H-CR-009', procurementId: 'H-PR-009', category: 'Transport', supplier: 'Own Fleet', activityValue: 8500000, activityUnit: 'deliveries', emissionFactor: 0.145, factorUnit: 'kgCO2e/tkm', factorSource: 'DEFRA', tCO2e: 3100000, scope: 'Scope 1', dqsScore: 0.80, methodology: 'Distance-based' },
  { id: 'H-CR-010', procurementId: 'H-PR-010', category: 'Raw Materials', supplier: 'ArcelorMittal', activityValue: 6500000, activityUnit: 'tonnes', emissionFactor: 0.07, factorUnit: 'kgCO2e/kg', factorSource: 'ecoinvent', tCO2e: 455000, scope: 'Scope 3', dqsScore: 0.75, methodology: 'Activity-based' },
];

const danoneCompute = [
  { id: 'D-CR-001', procurementId: 'D-PR-001', category: 'Agricultural Raw Materials', supplier: 'Dairy Farm Cooperatives', activityValue: 6800000000, activityUnit: 'litres', emissionFactor: 1.29, factorUnit: 'kgCO2e/litre', factorSource: 'FAO GLEAM', tCO2e: 8772000, scope: 'Scope 3', dqsScore: 0.65, methodology: 'Activity-based' },
  { id: 'D-CR-002', procurementId: 'D-PR-002', category: 'Agricultural Raw Materials', supplier: 'Fonterra', activityValue: 320000, activityUnit: 'tonnes', emissionFactor: 10.5, factorUnit: 'kgCO2e/kg', factorSource: 'ecoinvent', tCO2e: 3360000, scope: 'Scope 3', dqsScore: 0.72, methodology: 'Activity-based' },
  { id: 'D-CR-003', procurementId: 'D-PR-003', category: 'Packaging', supplier: 'Amcor / Berry', activityValue: 480000, activityUnit: 'tonnes', emissionFactor: 3.4, factorUnit: 'kgCO2e/kg', factorSource: 'ecoinvent', tCO2e: 1632000, scope: 'Scope 3', dqsScore: 0.82, methodology: 'Activity-based' },
  { id: 'D-CR-004', procurementId: 'D-PR-004', category: 'Packaging', supplier: 'Tetra Pak', activityValue: 12000000000, activityUnit: 'units', emissionFactor: 0.326, factorUnit: 'kgCO2e/unit', factorSource: 'Tetra Pak LCA', tCO2e: 3912000, scope: 'Scope 3', dqsScore: 0.88, methodology: 'Activity-based' },
  { id: 'D-CR-005', procurementId: 'D-PR-005', category: 'Agricultural Raw Materials', supplier: 'Cargill / Bunge', activityValue: 420000, activityUnit: 'tonnes', emissionFactor: 3.8, factorUnit: 'kgCO2e/kg', factorSource: 'ecoinvent', tCO2e: 1596000, scope: 'Scope 3', dqsScore: 0.58, methodology: 'Activity-based' },
  { id: 'D-CR-006', procurementId: 'D-PR-006', category: 'Agricultural Raw Materials', supplier: 'Sudzucker AG', activityValue: 580000, activityUnit: 'tonnes', emissionFactor: 0.72, factorUnit: 'kgCO2e/kg', factorSource: 'DEFRA', tCO2e: 417600, scope: 'Scope 3', dqsScore: 0.85, methodology: 'Activity-based' },
  { id: 'D-CR-007', procurementId: 'D-PR-007', category: 'Transport', supplier: 'DHL / XPO', activityValue: 15000000, activityUnit: 'deliveries', emissionFactor: 0.132, factorUnit: 'kgCO2e/tkm', factorSource: 'DEFRA', tCO2e: 2890000, scope: 'Scope 3', dqsScore: 0.70, methodology: 'Spend-based' },
  { id: 'D-CR-008', procurementId: 'D-PR-008', category: 'Energy', supplier: 'EDF / Engie', activityValue: 3200000, activityUnit: 'MWh', emissionFactor: 0.052, factorUnit: 'kgCO2e/kWh', factorSource: 'ecoinvent', tCO2e: 166400, scope: 'Scope 2', dqsScore: 0.92, methodology: 'Market-based' },
  { id: 'D-CR-009', procurementId: 'D-PR-009', category: 'Water', supplier: 'Veolia Water', activityValue: 85000000, activityUnit: 'm3', emissionFactor: 0.344, factorUnit: 'kgCO2e/m3', factorSource: 'ecoinvent', tCO2e: 29240, scope: 'Scope 3', dqsScore: 0.80, methodology: 'Activity-based' },
  { id: 'D-CR-010', procurementId: 'D-PR-010', category: 'Agricultural Raw Materials', supplier: 'Oat Farmers Cooperative', activityValue: 190000, activityUnit: 'tonnes', emissionFactor: 0.52, factorUnit: 'kgCO2e/kg', factorSource: 'ecoinvent', tCO2e: 98800, scope: 'Scope 3', dqsScore: 0.78, methodology: 'Activity-based' },
];

// ===== GAP ANALYSIS =====
const meridianGaps = [
  { id: 'GA-001', category: 'Capital Goods', issueType: 'Low Quality', description: 'Spend-based methodology for Siemens AG machinery. Supplier-specific data would improve accuracy by est. 40%.', estimatedImpact: 'High', recommendation: 'Request product carbon footprint data from Siemens via CDP Supply Chain.' },
  { id: 'GA-002', category: 'Transport', issueType: 'Missing Data', description: 'No primary data for Maersk ocean freight routes. Using average GLEC factors.', estimatedImpact: 'High', recommendation: 'Integrate Maersk ECO Delivery API for shipment-level data.' },
  { id: 'GA-003', category: 'Steel & Metals', issueType: 'Stale Factor', description: 'Rio Tinto aluminium factor from 2023 GaBi. Company shifted to renewable smelting.', estimatedImpact: 'Medium', recommendation: 'Update to Rio Tinto 2024 sustainability report factors.' },
  { id: 'GA-004', category: 'Capital Goods', issueType: 'Low Quality', description: 'Schneider Electric automation using generic factor. DQS score: 0.55.', estimatedImpact: 'Medium', recommendation: 'Request Schneider Product Environmental Profile (PEP).' },
  { id: 'GA-005', category: 'Transport', issueType: 'Missing Data', description: 'DHL last-mile using spend-based proxy. No distance/weight data for 85k shipments.', estimatedImpact: 'High', recommendation: 'Integrate DHL GoGreen tracking for shipment-level CO2 data.' },
  { id: 'GA-006', category: 'Chemicals', issueType: 'Stale Factor', description: 'LANXESS specialty chemicals factor from 2023. New production process since Q2 2024.', estimatedImpact: 'Low', recommendation: 'Request updated process-specific LCA data from LANXESS.' },
];

const heidelbergGaps = [
  { id: 'H-GA-001', category: 'Capital Goods', issueType: 'Low Quality', description: 'CCS equipment lifecycle emissions estimated, not measured. DQS: 0.35.', estimatedImpact: 'High', recommendation: 'Commission LCA study for LEILAC technology installations.' },
  { id: 'H-GA-002', category: 'Transport', issueType: 'Missing Data', description: 'Ready-mix delivery fleet emissions based on average distances, not GPS-tracked routes.', estimatedImpact: 'High', recommendation: 'Deploy telematics across mixer truck fleet for actual route data.' },
  { id: 'H-GA-003', category: 'Alternative Fuels', issueType: 'Unmapped', description: 'RDF/SRF biogenic carbon fraction not properly allocated. Affects net Scope 1 calculation.', estimatedImpact: 'High', recommendation: 'Implement 14C testing protocol for biogenic carbon fraction determination.' },
  { id: 'H-GA-004', category: 'Raw Materials', issueType: 'Stale Factor', description: 'Slag emission factor assumes conventional BF operation. ArcelorMittal transitioning to DRI.', estimatedImpact: 'Medium', recommendation: 'Update slag allocation factor based on ArcelorMittal decarbonisation progress.' },
  { id: 'H-GA-005', category: 'Capital Goods', issueType: 'Low Quality', description: 'Kiln equipment lifecycle using generic GaBi dataset from 2023.', estimatedImpact: 'Medium', recommendation: 'Request EPDs from FLSmidth for specific equipment models.' },
  { id: 'H-GA-006', category: 'Transport', issueType: 'Missing Data', description: 'No Scope 3 Category 9 data (downstream transport by customers after delivery).', estimatedImpact: 'Medium', recommendation: 'Survey top 20 customers on last-mile delivery patterns.' },
];

const danoneGaps = [
  { id: 'D-GA-001', category: 'Agricultural Raw Materials', issueType: 'Low Quality', description: 'Raw milk emissions use FAO regional averages, not farm-level data. Covers 70% of milk volume.', estimatedImpact: 'High', recommendation: 'Deploy Cool Farm Tool across dairy farm cooperatives for primary data.' },
  { id: 'D-GA-002', category: 'Agricultural Raw Materials', issueType: 'Missing Data', description: 'Soy LUC factor uses ecoinvent average. Actual sourcing mix includes certified deforestation-free.', estimatedImpact: 'High', recommendation: 'Map soy traceability data to plot-level LUC factors.' },
  { id: 'D-GA-003', category: 'Packaging', issueType: 'Unmapped', description: 'End-of-life packaging fate data based on EU averages, not actual recycling rates per market.', estimatedImpact: 'Medium', recommendation: 'Partner with national recycling bodies for market-specific recycling rates.' },
  { id: 'D-GA-004', category: 'Transport', issueType: 'Low Quality', description: 'Cold chain emissions use spend-based proxy. Refrigerant leakage not captured separately.', estimatedImpact: 'High', recommendation: 'Integrate carrier TMS data and separate refrigerant emissions reporting.' },
  { id: 'D-GA-005', category: 'Agricultural Raw Materials', issueType: 'Stale Factor', description: 'Milk powder factor from NZ ecoinvent dataset. Fonterra has published updated PCF.', estimatedImpact: 'Medium', recommendation: 'Adopt Fonterra 2024 product carbon footprint data.' },
  { id: 'D-GA-006', category: 'Water', issueType: 'Missing Data', description: 'Water stress impact weighting not applied. All m3 treated equally regardless of basin stress level.', estimatedImpact: 'Low', recommendation: 'Apply WRI Aqueduct stress weighting to water withdrawal data.' },
];

// ===== AUDIT TRAIL =====
const meridianAudit = [
  { id: 'AT-001', timestamp: '2025-01-15T14:32:00Z', actor: 'System', action: 'Data imported', entity: 'Procurement', entityId: 'BATCH-2024-Q4', details: '20 procurement records imported from SAP S/4HANA', version: 'v1.0' },
  { id: 'AT-002', timestamp: '2025-01-15T14:35:00Z', actor: 'System', action: 'Auto-mapping completed', entity: 'EmissionFactors', entityId: 'MAP-001', details: '18 of 20 items auto-mapped to emission factors', version: 'v1.0' },
  { id: 'AT-003', timestamp: '2025-01-15T15:10:00Z', actor: 'Anna Mueller', action: 'Manual mapping', entity: 'EmissionFactor', entityId: 'EF-017', details: 'Mapped SUEZ recycling to ecoinvent credit factor', version: 'v1.1' },
  { id: 'AT-004', timestamp: '2025-01-15T16:00:00Z', actor: 'System', action: 'Computation triggered', entity: 'ComputeResults', entityId: 'RUN-001', details: 'Full emissions computation for FY2024', version: 'v1.1' },
  { id: 'AT-005', timestamp: '2025-01-15T16:02:00Z', actor: 'System', action: 'Computation completed', entity: 'ComputeResults', entityId: 'RUN-001', details: 'Total: 391,800 tCO2e. Scope 1: 45,200 / Scope 2: 28,100 / Scope 3: 318,500', version: 'v1.1' },
  { id: 'AT-006', timestamp: '2025-01-16T09:15:00Z', actor: 'System', action: 'Hotspot analysis generated', entity: 'Hotspots', entityId: 'HS-2024', details: '7 hotspot categories identified', version: 'v1.1' },
  { id: 'AT-007', timestamp: '2025-01-16T09:18:00Z', actor: 'System', action: 'Gap analysis generated', entity: 'GapAnalysis', entityId: 'GAP-2024', details: '6 data quality issues identified', version: 'v1.1' },
  { id: 'AT-008', timestamp: '2025-01-16T10:30:00Z', actor: 'Dr. Klaus Weber', action: 'Review approved', entity: 'ComputeResults', entityId: 'RUN-001', details: 'Emissions inventory reviewed and approved for FY2024', version: 'v2.0' },
  { id: 'AT-009', timestamp: '2025-01-16T11:00:00Z', actor: 'System', action: 'Report snapshot', entity: 'Report', entityId: 'RPT-2024-Q4', details: 'Quarterly emissions report snapshot created', version: 'v2.0' },
];

const heidelbergAudit = [
  { id: 'H-AT-001', timestamp: '2025-01-10T08:00:00Z', actor: 'System', action: 'Data imported', entity: 'Procurement', entityId: 'H-BATCH-2024', details: 'Annual procurement data imported from SAP for all cement divisions', version: 'v1.0' },
  { id: 'H-AT-002', timestamp: '2025-01-10T08:15:00Z', actor: 'System', action: 'Auto-mapping completed', entity: 'EmissionFactors', entityId: 'H-MAP-001', details: 'GCCA-aligned emission factors mapped to 10 procurement categories', version: 'v1.0' },
  { id: 'H-AT-003', timestamp: '2025-01-10T10:00:00Z', actor: 'Dr. Stefan Müller', action: 'Manual override', entity: 'EmissionFactor', entityId: 'H-EF-006', details: 'Updated RDF biogenic fraction from 40% to 45% based on lab results', version: 'v1.1' },
  { id: 'H-AT-004', timestamp: '2025-01-10T14:00:00Z', actor: 'System', action: 'Computation triggered', entity: 'ComputeResults', entityId: 'H-RUN-001', details: 'Full emissions computation for FY2024 - cement + aggregates + RMX', version: 'v1.1' },
  { id: 'H-AT-005', timestamp: '2025-01-10T14:08:00Z', actor: 'System', action: 'Computation completed', entity: 'ComputeResults', entityId: 'H-RUN-001', details: 'Total: 21.1 MtCO2e. Scope 1: 8.2Mt / Scope 2: 1.95Mt / Scope 3: 10.96Mt', version: 'v1.1' },
  { id: 'H-AT-006', timestamp: '2025-01-11T09:00:00Z', actor: 'System', action: 'Hotspot analysis generated', entity: 'Hotspots', entityId: 'H-HS-2024', details: '7 hotspot categories. Clinker production is 27.2% of total.', version: 'v1.1' },
  { id: 'H-AT-007', timestamp: '2025-01-12T11:00:00Z', actor: 'Dr. Stefan Müller', action: 'Review approved', entity: 'ComputeResults', entityId: 'H-RUN-001', details: 'Annual inventory approved. Submitted to GCCA for sector benchmarking.', version: 'v2.0' },
  { id: 'H-AT-008', timestamp: '2025-01-12T12:00:00Z', actor: 'System', action: 'Report snapshot', entity: 'Report', entityId: 'H-RPT-2024', details: 'Annual CSRD emissions report generated', version: 'v2.0' },
];

const danoneAudit = [
  { id: 'D-AT-001', timestamp: '2025-01-08T07:30:00Z', actor: 'System', action: 'Data imported', entity: 'Procurement', entityId: 'D-BATCH-2024', details: 'Annual procurement data imported from SAP across all 3 divisions', version: 'v1.0' },
  { id: 'D-AT-002', timestamp: '2025-01-08T07:45:00Z', actor: 'System', action: 'Auto-mapping completed', entity: 'EmissionFactors', entityId: 'D-MAP-001', details: 'FAO GLEAM and ecoinvent factors mapped to 10 procurement categories', version: 'v1.0' },
  { id: 'D-AT-003', timestamp: '2025-01-08T09:00:00Z', actor: 'Marie Dupont', action: 'Manual mapping', entity: 'EmissionFactor', entityId: 'D-EF-001', details: 'Updated raw milk EF to regional FAO GLEAM factor for Western Europe', version: 'v1.1' },
  { id: 'D-AT-004', timestamp: '2025-01-08T14:00:00Z', actor: 'System', action: 'Computation triggered', entity: 'ComputeResults', entityId: 'D-RUN-001', details: 'Full emissions computation for FY2024 - all divisions', version: 'v1.1' },
  { id: 'D-AT-005', timestamp: '2025-01-08T14:12:00Z', actor: 'System', action: 'Computation completed', entity: 'ComputeResults', entityId: 'D-RUN-001', details: 'Total: 24.1 MtCO2e. Scope 1: 1.85Mt / Scope 2: 0.82Mt / Scope 3: 21.43Mt', version: 'v1.1' },
  { id: 'D-AT-006', timestamp: '2025-01-09T08:30:00Z', actor: 'System', action: 'Hotspot analysis generated', entity: 'Hotspots', entityId: 'D-HS-2024', details: '7 hotspot categories. Dairy farming is 35.3% of total.', version: 'v1.1' },
  { id: 'D-AT-007', timestamp: '2025-01-10T10:00:00Z', actor: 'Marie Dupont', action: 'Review approved', entity: 'ComputeResults', entityId: 'D-RUN-001', details: 'Annual inventory approved. Aligned with B Corp reporting requirements.', version: 'v2.0' },
  { id: 'D-AT-008', timestamp: '2025-01-10T11:00:00Z', actor: 'System', action: 'Report snapshot', entity: 'Report', entityId: 'D-RPT-2024', details: 'Annual CSRD emissions report generated', version: 'v2.0' },
];

// ===== DATA MAPS & EXPORTS =====
const maps = {
  procurement: { meridian: meridianProcurement, heidelberg: heidelbergProcurement, danone: danoneProcurement },
  factors: { meridian: meridianFactors, heidelberg: heidelbergFactors, danone: danoneFactors },
  compute: { meridian: meridianCompute, heidelberg: heidelbergCompute, danone: danoneCompute },
  gaps: { meridian: meridianGaps, heidelberg: heidelbergGaps, danone: danoneGaps },
  audit: { meridian: meridianAudit, heidelberg: heidelbergAudit, danone: danoneAudit },
  hotspots: { meridian: meridianHotspots, heidelberg: heidelbergHotspots, danone: danoneHotspots },
};

export function getProcurementData(id) { return maps.procurement[id] || meridianProcurement; }
export function getEmissionFactors(id) { return maps.factors[id] || meridianFactors; }
export function getComputeResults(id) { return maps.compute[id] || meridianCompute; }
export function getGapAnalysis(id) { return maps.gaps[id] || meridianGaps; }
export function getAuditTrail(id) { return maps.audit[id] || meridianAudit; }
export function getHotspots(id) { return maps.hotspots[id] || meridianHotspots; }
export function getEmissionsSummary(id) { return summaries[id] || summaries.meridian; }
