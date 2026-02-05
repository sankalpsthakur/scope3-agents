import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CompanyProvider } from './context/CompanyContext';
import { AgentProvider } from './context/AgentContext';
import Layout from './components/Layout';
import Onboarding from './pages/Onboarding';

// Strategy (Stage 1)
import DMAAssessment from './pages/strategy/DMAAssessment';
import IRORegister from './pages/strategy/IRORegister';
import StakeholderEngagement from './pages/strategy/StakeholderEngagement';
import ESRSReporting from './pages/strategy/ESRSReporting';
import RiskMonitoring from './pages/strategy/RiskMonitoring';

// Calculation (Stage 2)
import DataIngestion from './pages/calculation/DataIngestion';
import FactorMapping from './pages/calculation/FactorMapping';
import EmissionsDashboard from './pages/calculation/EmissionsDashboard';
import HotspotAnalysis from './pages/calculation/HotspotAnalysis';

// Execution (Stage 3)
import ReduceDashboard from './pages/execution/ReduceDashboard';
import SupplierEngagement from './pages/execution/SupplierEngagement';
import EvidenceManager from './pages/execution/EvidenceManager';
import PeerBenchmarks from './pages/execution/PeerBenchmarks';

// Reports (Stage 4)
import ReportsDashboard from './pages/reports/ReportsDashboard';
import ESRSExport from './pages/reports/ESRSExport';
import AuditTrail from './pages/reports/AuditTrail';

// Overview
import GlobalDashboard from './pages/GlobalDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <CompanyProvider>
        <AgentProvider>
        <Routes>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<GlobalDashboard />} />
            {/* Strategy */}
            <Route path="strategy/dma" element={<DMAAssessment />} />
            <Route path="strategy/iro" element={<IRORegister />} />
            <Route path="strategy/stakeholders" element={<StakeholderEngagement />} />
            <Route path="strategy/esrs" element={<ESRSReporting />} />
            <Route path="strategy/risks" element={<RiskMonitoring />} />
            {/* Calculation */}
            <Route path="calculation/ingest" element={<DataIngestion />} />
            <Route path="calculation/factors" element={<FactorMapping />} />
            <Route path="calculation/emissions" element={<EmissionsDashboard />} />
            <Route path="calculation/hotspots" element={<HotspotAnalysis />} />
            {/* Execution */}
            <Route path="execution/reduce" element={<ReduceDashboard />} />
            <Route path="execution/suppliers" element={<SupplierEngagement />} />
            <Route path="execution/evidence" element={<EvidenceManager />} />
            <Route path="execution/benchmarks" element={<PeerBenchmarks />} />
            {/* Reports */}
            <Route path="reports" element={<ReportsDashboard />} />
            <Route path="reports/export" element={<ESRSExport />} />
            <Route path="reports/audit" element={<AuditTrail />} />
          </Route>
        </Routes>
        </AgentProvider>
      </CompanyProvider>
    </BrowserRouter>
  );
}
