import { useState, useEffect, useMemo } from 'react';
import { useCompany } from '@/context/CompanyContext';

// Strategy data
import { getIRORegister, getStakeholders, getReportingBoundary, getESRSKPIs, getRiskSignals, getCompanyProfile } from '@/hooks/data/strategy-data';
// Calculation data
import { getProcurementData, getEmissionFactors, getComputeResults, getGapAnalysis, getAuditTrail, getHotspots, getEmissionsSummary } from '@/hooks/data/calculation-data';
// Execution data
import { getSupplierProfiles, getEvidenceDocuments, getPeerBenchmarks, getRecommendations, getQualityAnomalies, getEngagementTracking } from '@/hooks/data/execution-data';

const simulateDelay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Factory: creates a hook that reads companyId from context,
 * calls `getter(companyId)`, and returns { data, loading }.
 */
function createCompanyHook(getter) {
  return function useCompanyHook() {
    const { activeCompanyId } = useCompany();
    const [state, setState] = useState({ data: null, loading: true });

    useEffect(() => {
      let cancelled = false;
      setState({ data: null, loading: true });
      simulateDelay(400 + Math.random() * 400).then(() => {
        if (!cancelled) {
          setState({ data: getter(activeCompanyId), loading: false });
        }
      });
      return () => { cancelled = true; };
    }, [activeCompanyId]);

    return state;
  };
}

// ── Strategy hooks ──────────────────────────────────────────────────────────
export const useCompanyIRORegister = createCompanyHook(getIRORegister);
export const useCompanyStakeholders = createCompanyHook(getStakeholders);
export const useCompanyReportingBoundary = createCompanyHook(getReportingBoundary);
export const useCompanyESRSKPIs = createCompanyHook(getESRSKPIs);
export const useCompanyRiskSignals = createCompanyHook(getRiskSignals);
export const useCompanyCompanyProfile = createCompanyHook(getCompanyProfile);

// ── Calculation hooks ───────────────────────────────────────────────────────
export const useCompanyProcurementData = createCompanyHook(getProcurementData);
export const useCompanyEmissionFactors = createCompanyHook(getEmissionFactors);
export const useCompanyComputeResults = createCompanyHook(getComputeResults);
export const useCompanyGapAnalysis = createCompanyHook(getGapAnalysis);
export const useCompanyAuditTrail = createCompanyHook(getAuditTrail);
export const useCompanyHotspots = createCompanyHook(getHotspots);

// Emissions summary — synchronous (no loading), same as original
export function useCompanyEmissionsSummary() {
  const { activeCompanyId } = useCompany();
  return useMemo(() => getEmissionsSummary(activeCompanyId), [activeCompanyId]);
}

// ── Execution hooks ─────────────────────────────────────────────────────────
export const useCompanySupplierProfiles = createCompanyHook(getSupplierProfiles);
export const useCompanyEvidenceDocuments = createCompanyHook(getEvidenceDocuments);
export const useCompanyPeerBenchmarks = createCompanyHook(getPeerBenchmarks);
export const useCompanyRecommendations = createCompanyHook(getRecommendations);
export const useCompanyQualityAnomalies = createCompanyHook(getQualityAnomalies);
export const useCompanyEngagementTracking = createCompanyHook(getEngagementTracking);
