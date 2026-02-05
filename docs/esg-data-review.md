# ESG Data Quality Review

## Executive Summary

The calculation and execution seed data demonstrates strong domain knowledge with credible emission factor sourcing, realistic industry-specific scope splits, and actionable gap analysis. However, **8 of 30 compute results contain mathematical inconsistencies** (unit mismatches, magnitude errors, kg-to-tonne conversion failures), the Meridian hotspot percentages sum to 108.2% instead of ~100%, and several Heidelberg compute results have order-of-magnitude discrepancies between stated inputs and outputs. The emission factors themselves are excellent -- all sourced from credible databases at realistic values. Overall data quality score: **7 out of 10**.

---

## Emission Factor Analysis

### Accuracy Assessment

All 30 emission factors across the three companies are sourced from credible, industry-standard databases: DEFRA, ecoinvent, IPCC, GLEC, GaBi, FAO GLEAM, GCCA, and Tetra Pak LCA. Factor values fall within expected ranges for their respective categories.

| Factor ID | Name | Value | Unit | Expected Range | Verdict |
|-----------|------|-------|------|----------------|---------|
| EF-002 | Steel hot-rolled coil | 1.85 | kgCO2e/kg | 1.5-2.0 (EU) | Correct |
| EF-003 | Natural gas combustion | 0.184 | kgCO2e/kWh | ~0.183 (DEFRA 2024) | Excellent |
| EF-007 | Electricity grid - Sweden | 0.013 | kgCO2e/kWh | 0.01-0.05 | Correct |
| H-EF-001 | Clinker calcination | 525 | kgCO2/t clinker | ~525 (GCCA) | Excellent |
| H-EF-003 | Grid electricity (EU avg) | 0.295 | kgCO2e/kWh | 0.25-0.35 | Correct |
| D-EF-001 | Raw cow milk (farm gate) | 1.29 | kgCO2e/litre | 1.0-1.5 (EU avg) | Correct |
| D-EF-002 | Milk powder (spray-dried) | 10.5 | kgCO2e/kg | 8-12 (NZ) | Correct |
| D-EF-005 | Soy meal (incl. LUC) | 3.8 | kgCO2e/kg | 2-7 (BR) | Correct |
| D-EF-008 | Grid electricity (France) | 0.052 | kgCO2e/kWh | ~0.05 (nuclear) | Excellent |

### Issues Found

No issues with emission factor values. All are within accepted ranges.

### Recommendations

- **EF-008** (Aluminium primary ingot): Year is 2023. Rio Tinto has shifted toward renewable-powered smelting; updating to 2024 would be appropriate (already flagged in gap analysis GA-003).
- **H-EF-007** (CCS equipment lifecycle): Source is "Estimated" with Low confidence. This is correctly flagged in gap analysis H-GA-001 but the factor of 85,000,000 kgCO2e per unit (= 85,000 tCO2e) for a pilot installation is extremely rough and should be treated with caution.

---

## Scope 1/2/3 Split Analysis

### By Company

| Company | Scope 1 | Scope 2 | Scope 3 | Total | S1% | S2% | S3% |
|---------|---------|---------|---------|-------|-----|-----|-----|
| Meridian GmbH | 45,200 | 28,100 | 318,500 | 391,800 | 11.5% | 7.2% | 81.3% |
| Heidelberg Materials SE | 8,200,000 | 1,950,000 | 10,960,000 | 21,110,000 | 38.8% | 9.2% | 51.9% |
| Groupe Danone SA | 1,850,000 | 820,000 | 21,430,000 | 24,100,000 | 7.7% | 3.4% | 88.9% |

### Industry Alignment

**Meridian (Industrial Manufacturing):** Scope 3 at 81.3% is within the expected 70-85% range for manufacturers dependent on purchased goods, capital equipment, and logistics. The relatively small Scope 1 (11.5%) reflects that manufacturing operations are not the primary emission source -- supply chain dominates. **Well aligned.**

**Heidelberg (Cement/Construction Materials):** Scope 1 at 38.8% is **below the expected 40-50% range**. In real Heidelberg Materials reporting, Scope 1 from clinker calcination and kiln fuel combustion typically represents 55-65% of reported totals. The data shows Scope 3 at 51.9%, which is high for a cement company. This appears to be because the data includes extensive upstream fuel supply chain emissions (coal/petcoke at 4.38 MtCO2e in hotspots as "Purchased Fuels") that in real reporting would often be classified as Scope 1 fuel combustion rather than Scope 3 purchased goods. **Recommendation:** Reclassify upstream fuel combustion emissions. The kiln fuel combustion emissions in H-CR-002 are tagged as Scope 1 (2.46 Mt) but the "Purchased Fuels" hotspot (H-HS-004) shows 4.38 Mt, suggesting a portion of fuel-related emissions is being double-counted or misallocated between hotspot categories.

**Danone (Food & Beverage):** Scope 3 at 88.9% is perfectly aligned with the expected 85-90% for food companies where agricultural supply chain and packaging dominate. Real Danone reports approximately 90% Scope 3. **Excellent alignment.**

---

## Compute Result Verification

### Mathematical Checks

I verified all 30 compute results by calculating `activityValue x emissionFactor` with appropriate unit conversions. Results:

**Correct (22 of 30):**
- CR-001 (BASF): 8,500t x 2.45 kgCO2e/kg x 1000 / 1000 = 20,825 tCO2e. Stated: 20,825. **PASS**
- CR-002 (ThyssenKrupp): 15,000t x 1.85 x 1000/1000 = 27,750. Stated: 27,750. **PASS**
- CR-003 (TotalEnergies): 42,000 MWh x 0.184 x 1000/1000 = 7,728. Stated: 7,728. **PASS**
- CR-006 (Covestro): 6,200t x 5.12 x 1000/1000 = 31,744. Stated: 31,744. **PASS**
- CR-007 (Vattenfall): 38,000 MWh x 0.013 x 1000/1000 = 494. Stated: 494. **PASS**
- CR-008 (Rio Tinto): 4,800t x 8.24 x 1000/1000 = 39,552. Stated: 39,552. **PASS**
- H-CR-004 (Sika): 450,000t x 1.8 x 1000/1000 = 810,000. Stated: 810,000. **PASS**
- H-CR-005 (DB Cargo): 8.5B tkm x 0.022 / 1000 = 187,000. Stated: 187,000. **PASS**
- H-CR-006 (Waste Partners): 4.2Mt x 0.9 x 1000/1000 = 3,780,000. Stated: 3,780,000. **PASS**
- H-CR-007 (LEILAC): 2 units x 85,000,000 kgCO2e / 1000 = 170,000. Stated: 170,000. **PASS**
- H-CR-008 (FLSmidth): 8 units x 12,000,000 kgCO2e / 1000 = 96,000. Stated: 96,000. **PASS**
- H-CR-010 (ArcelorMittal): 6.5Mt x 0.07 x 1000/1000 = 455,000. Stated: 455,000. **PASS**
- D-CR-001 through D-CR-006: All correct (dairy milk, milk powder, PET, cartons, soy, sugar). **PASS**
- D-CR-008 (EDF): 3.2M MWh x 0.052 x 1000/1000 = 166,400. Stated: 166,400. **PASS**
- D-CR-009 (Veolia): 85M m3 x 0.344 / 1000 = 29,240. Stated: 29,240. **PASS**
- D-CR-010 (Oat Cooperative): 190,000t x 0.52 x 1000/1000 = 98,800. Stated: 98,800. **PASS**

### Issues Found (8 of 30)

#### Issue 1: Capital Goods Unit Confusion (CR-009, CR-010) -- SEVERITY: HIGH

| ID | Activity | Factor | Expected tCO2e | Stated tCO2e | Error Factor |
|----|----------|--------|----------------|--------------|-------------|
| CR-009 | 45 units | 420 kgCO2e/unit | **18.9** | 18,900 | 1,000x |
| CR-010 | 12 units | 12,500 kgCO2e/unit | **150** | 150,000 | 1,000x |

The factor unit says kgCO2e/unit but the results treat the values as if they were tCO2e/unit. Either the factor unit labels should be `tCO2e/unit` or the tCO2e results are three orders of magnitude too high.

**Fix:** Change EF-011 unit to `tCO2e/unit` (420 tCO2e/unit for factory automation systems is plausible for full lifecycle) and EF-018 to `tCO2e/unit` (12,500 tCO2e/unit for CNC machining centres including supply chain). Alternatively, reduce the compute tCO2e by /1000.

#### Issue 2: Transport Activity/Factor Unit Mismatch (CR-004, CR-005, H-CR-009, D-CR-007) -- SEVERITY: HIGH

| ID | Activity Unit | Factor Unit | Problem |
|----|--------------|-------------|---------|
| CR-004 | TEU | kgCO2e/tkm | TEU is not tonne-km. Needs distance and cargo weight per TEU. |
| CR-005 | shipments | kgCO2e/tkm | Shipments is not tonne-km. Needs avg weight and distance per shipment. |
| H-CR-009 | deliveries | kgCO2e/tkm | Deliveries is not tonne-km. Needs avg load and distance per delivery. |
| D-CR-007 | deliveries | kgCO2e/tkm | Same issue as H-CR-009. |

In all four cases, the activity unit does not match the emission factor unit. The tCO2e results appear to be pre-calculated from an intermediate conversion (e.g., TEU -> estimated tonne-km) but this conversion is not shown, making the calculation non-reproducible from the stated inputs.

**Fix:** Either (a) change activity units to tonne-km and adjust activity values accordingly, or (b) change factor units to match (e.g., kgCO2e/TEU, kgCO2e/shipment, kgCO2e/delivery).

#### Issue 3: Heidelberg Clinker/Limestone Mismatch (H-CR-001) -- SEVERITY: MEDIUM

Procurement H-PR-001 states 95,000,000 tonnes of **limestone**, but H-EF-001 is 525 kgCO2/t **clinker**. These are different materials. Limestone input of 95 Mt at 525 kgCO2/t would yield 49.9 MtCO2e, not the stated 5.74 MtCO2e. The stated 5.74 Mt is realistic for ~10.9 Mt clinker production (which is consistent with Heidelberg's actual output), suggesting the activity value should be clinker production tonnage, not limestone input.

**Fix:** Change H-PR-001 quantity to ~10,933,000 tonnes and description to "Clinker production" or change the activityValue in H-CR-001 to clinker output.

#### Issue 4: Heidelberg Fuel Combustion Magnitude Error (H-CR-002) -- SEVERITY: HIGH

Calculated: 12,500,000 t x 2.42 kgCO2e/kg x 1000 / 1000 = **30,250,000 tCO2e**
Stated: **2,460,000 tCO2e** (12.3x lower)

The stated tCO2e of 2.46 Mt is plausible for Heidelberg's real kiln fuel combustion (they report ~2-3 Mt from fuel), but this implies either: (a) the fuel quantity of 12.5 Mt is overstated by ~12x (actual fuel consumption closer to 1 Mt), or (b) the factor needs adjustment. Real-world: Heidelberg consumes roughly 10-12 Mt of fuel annually, but the CO2 from this should be 24-30 Mt, not 2.46 Mt.

**Fix:** Either reduce H-PR-002 quantity to ~1,016,529 tonnes (yielding 2.46 Mt at 2.42 kgCO2e/kg), or increase H-CR-002 tCO2e to 30,250,000 (and update the summary accordingly). The former is more realistic.

#### Issue 5: Heidelberg Electricity Magnitude Error (H-CR-003) -- SEVERITY: MEDIUM

Calculated: 12,000,000 MWh x 0.295 kgCO2e/kWh x 1000 / 1000 = **3,540,000 tCO2e**
Stated: **1,950,000 tCO2e** (1.82x lower)

The stated 1.95 Mt matches the summary Scope 2 figure, but the math produces 3.54 Mt from the stated inputs. This implies either the actual consumption is ~6.6M MWh (not 12M) or the effective factor is ~0.163 kgCO2e/kWh (accounting for renewable share). The 12M MWh figure is realistic for Heidelberg's global operations, but then the factor or result needs adjustment.

**Fix:** Either reduce quantity to ~6,610,169 MWh or change the factor to 0.1625 kgCO2e/kWh to reflect a blended grid+renewable rate.

---

## Benchmark Data Review

### Peer Company Verification

**Heidelberg Peers -- GOOD:**
All peer companies are real, correctly placed in the Construction Materials sector, with approximately correct revenue figures:

| Company | Stated Revenue (EUR M) | Approx. Real Revenue | Accuracy |
|---------|----------------------|---------------------|----------|
| Holcim Group | 26,800 | ~EUR 27B (CHF 27B) | Good |
| CRH plc | 34,900 | ~EUR 32-33B (USD 35B) | Acceptable |
| Buzzi Unicem | 4,200 | ~EUR 4B | Good |
| Cemex SAB | 15,800 | ~EUR 14B (USD 15.3B) | Acceptable |
| Vicat SA | 3,900 | ~EUR 4B | Good |

**Danone Peers -- GOOD:**
All peer companies are real and correctly categorized:

| Company | Stated Revenue (EUR M) | Approx. Real Revenue | Accuracy |
|---------|----------------------|---------------------|----------|
| Nestle SA | 93,000 | ~EUR 95B (CHF 93B) | Good |
| Unilever plc | 59,600 | ~EUR 59B | Excellent |
| Mondelez International | 36,000 | ~EUR 33B (USD 36B) | Acceptable |
| Kerry Group | 8,100 | ~EUR 8B | Good |
| DSM-Firmenich | 12,400 | ~EUR 12B | Good |

**Meridian Peers -- PROBLEMATIC:**
The peer companies (Voith Group, GEA Group, Konecranes, Andritz AG, Metso Outotec, Sulzer Ltd) are all **real companies** but their stated revenues are ~10x too low:

| Company | Stated Revenue (EUR M) | Approx. Real Revenue | Error |
|---------|----------------------|---------------------|-------|
| Voith Group | 510 | ~EUR 5,500M | ~10x low |
| GEA Group | 530 | ~EUR 5,300M | ~10x low |
| Konecranes | 380 | ~EUR 3,800M | ~10x low |
| Andritz AG | 780 | ~EUR 7,800M | ~10x low |
| Metso Outotec | 490 | ~EUR 5,400M | ~11x low |
| Sulzer Ltd | 340 | ~EUR 3,400M | ~10x low |

**Recommendation:** Since Meridian is a fictional EUR 420M company, either: (a) use fictional peer names at the ~400-800M revenue scale, or (b) use the real companies with their real revenue figures and adjust emissions accordingly. Using real names with 10x-reduced revenue creates a misleading dataset.

### Emissions Intensity Analysis

| Company | Intensity (tCO2e/EUR M) | Realistic? |
|---------|------------------------|------------|
| Meridian GmbH | 932.9 | Yes -- mid-range for industrial manufacturing |
| Heidelberg Materials | 1,000.5 | Yes -- matches real cement sector intensity |
| Danone | 873.2 | Yes -- plausible for food/beverage with heavy dairy |
| Holcim | 873.1 | Yes |
| CRH | 750.7 | Yes -- more diversified portfolio |
| Nestle | 731.2 | Yes |
| Unilever | 755.0 | Yes |

CDP scores and SBTi statuses are generally accurate for the real-world peers. Holcim A- (correct), Nestle A (correct), Unilever A (correct), CRH B (correct range), Sika SBTi approved (correct).

---

## Hotspot Analysis Review

### Meridian -- ISSUE FOUND

Hotspot percentages sum to **108.2%** (not ~100%):
- 43.1 + 25.7 + 19.5 + 14.6 + 2.7 + 2.0 + 0.6 = **108.2%**

Hotspot tCO2e values sum to **423,713 tCO2e**, exceeding the stated total of **391,800 tCO2e** by 31,913 tCO2e (8.1% overshoot).

| ID | Category | tCO2e | pctOfTotal | Issue |
|----|----------|-------|------------|-------|
| HS-001 | Capital Goods | 168,900 | 43.1% | See CR-009/CR-010 unit errors |
| HS-002 | Transport | 100,620 | 25.7% | -- |
| HS-003 | Steel & Metals | 76,322 | 19.5% | -- |
| HS-004 | Chemicals | 57,330 | 14.6% | -- |
| HS-005 | Energy | 10,622 | 2.7% | -- |
| HS-006 | Packaging | 7,644 | 2.0% | -- |
| HS-007 | Waste Management | 2,275 | 0.6% | -- |
| **TOTAL** | | **423,713** | **108.2%** | **8.1% over total** |

The Capital Goods figure (168,900 tCO2e) appears inflated by the CR-009/CR-010 unit errors. If corrected (18.9 + 150 = 168.9 instead of 168,900), capital goods would drop dramatically and the hotspot totals would need complete rebalancing.

**Fix:** Recalculate all Meridian hotspot tCO2e values and percentages after fixing compute results. Ensure sum equals the emissions total.

### Heidelberg -- CORRECT

Sum of percentages: 27.2 + 11.7 + 9.2 + 20.7 + 15.6 + 10.4 + 5.2 = **100.0%**
Sum of tCO2e: 5,740,000 + 2,460,000 + 1,950,000 + 4,380,000 + 3,290,000 + 2,190,000 + 1,100,000 = **21,110,000** = total. **Correct.**

Categories match the cement industry profile well: clinker process emissions, kiln fuel, purchased fuels, grid electricity, transport, raw materials, downstream use.

### Danone -- CORRECT

Sum of percentages: 35.3 + 21.3 + 15.0 + 12.0 + 11.1 + 3.0 + 2.3 = **100.0%**
Sum of tCO2e: 8,500,000 + 5,140,000 + 3,620,000 + 2,890,000 + 2,670,000 + 720,000 + 560,000 = **24,100,000** = total. **Correct.**

Dairy farming as the #1 hotspot at 35.3% is highly realistic for a dairy-centric food company. Agricultural feed, packaging, and cold chain logistics follow in the expected order.

---

## Supplier Data Assessment

### Real Company Verification

All 30 supplier profiles across the three companies reference **real, identifiable companies** (or plausible cooperatives like "EU Dairy Farm Cooperatives"). Countries of origin are correct for all suppliers.

### Data Consistency Issues

**Meridian supplier-procurement misalignment:** The supplier profiles (execution-data.js) include companies not present in the procurement data (calculation-data.js) and vice versa:

| In Supplier Profiles Only | In Procurement Only |
|---------------------------|-------------------|
| Bosch Rexroth | ThyssenKrupp AG |
| Tata Steel Europe | TotalEnergies SE |
| Samsung SDI | Vattenfall AB |
| Foxconn Industrial | Rio Tinto Alcan |

Additionally, BASF SE annual spend differs: EUR 12.45M (procurement) vs EUR 2.8M (supplier profile).

Heidelberg and Danone supplier profiles are well-aligned with their respective procurement records.

### Risk Level Assessment

Risk levels are appropriately assigned:
- **High risk** correctly applied to: fossil fuel suppliers (Glencore), high-emission steelmakers (ArcelorMittal, Tata Steel), deforestation-linked commodity traders (Cargill/Bunge), fragmented agricultural supply bases (Dairy Cooperatives), non-engaged suppliers (Samsung SDI).
- **Low risk** correctly applied to: companies with SBTi targets, high engagement rates, and renewable energy focus.

### SBTi Status Accuracy

SBTi target statuses are generally accurate. Maersk (net zero by 2040), Schneider Electric, DHL, Siemens Energy, Sika AG, Fonterra, Tetra Pak, and Veolia all have real-world SBTi commitments matching the data. BASF's "false" status is debatable (BASF has committed to SBTi) but defensible given their "Under review" flag.

---

## Gap Analysis Quality

The gap analyses across all three companies are **highly realistic and actionable**. Key strengths:

1. **Industry-specific recommendations:** Meridian GA-002 recommends "Maersk ECO Delivery API" (a real product). Danone D-GA-001 recommends "Cool Farm Tool" (actually used by Danone IRL). Heidelberg H-GA-003 recommends "14C testing protocol" for biogenic carbon fraction (industry standard).

2. **Appropriate impact levels:** High-impact gaps correctly target the largest emission sources (Capital Goods spend-based methodology, ocean freight missing primary data, dairy farm-level data, soy LUC factors).

3. **Practical feasibility:** All recommendations reference real tools, programs, and data exchange mechanisms (CDP Supply Chain, EPDs, TMS integration, WRI Aqueduct).

4. **CSRD/EUDR awareness:** Danone D-GA-002 (soy traceability) and D-GA-003 (end-of-life packaging) reflect current EU regulatory requirements.

Minor note: Meridian GA-006 references "LANXESS specialty chemicals" which does not appear in either the procurement or supplier data. This appears to be an orphaned reference.

---

## Overall Data Quality Score

**Score: 7 out of 10**

### Scoring Breakdown

| Dimension | Score | Weight | Notes |
|-----------|-------|--------|-------|
| Emission Factor Accuracy | 9.5/10 | High | All factors from credible sources at realistic values |
| Scope Split Realism | 8.5/10 | High | Danone excellent, Meridian good, Heidelberg slightly off |
| Compute Result Accuracy | 5/10 | High | 8 of 30 results have verifiable errors |
| Benchmark Data Quality | 7/10 | Medium | Heidelberg/Danone good; Meridian peers have wrong revenues |
| Hotspot Consistency | 7.5/10 | Medium | Heidelberg/Danone perfect; Meridian sums to 108% |
| Supplier Data Realism | 8/10 | Medium | All real companies; Meridian has alignment gaps |
| Gap Analysis Quality | 9/10 | Medium | Highly realistic, actionable, industry-specific |
| Evidence & Audit Trail | 9/10 | Low | Detailed, plausible, well-structured |
| Engagement Tracking | 9/10 | Low | Realistic timelines and actions |

### Priority Fixes

1. **CRITICAL:** Fix 4 transport compute results (CR-004, CR-005, H-CR-009, D-CR-007) -- align activity units with factor units
2. **CRITICAL:** Fix capital goods unit confusion (CR-009, CR-010) -- either relabel factor units as tCO2e/unit or divide results by 1000
3. **CRITICAL:** Fix H-CR-002 fuel combustion magnitude error -- reduce fuel quantity from 12.5Mt to ~1Mt or increase tCO2e result
4. **HIGH:** Fix H-CR-001 limestone/clinker unit mismatch -- use clinker production tonnage
5. **HIGH:** Fix H-CR-003 electricity magnitude error -- adjust quantity or factor
6. **HIGH:** Recalculate Meridian hotspot values and percentages to sum to 100%
7. **MEDIUM:** Correct Meridian benchmark peer revenue figures or use fictional company names
8. **MEDIUM:** Align Meridian supplier profiles with procurement data
9. **LOW:** Remove orphaned LANXESS reference from GA-006
