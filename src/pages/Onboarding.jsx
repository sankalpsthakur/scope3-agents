import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  ArrowLeft,
  Check,
  Factory,
  Zap,
  Cpu,
  Landmark,
  Heart,
  ShoppingBag,
  Truck,
  Building2,
  Users,
  DollarSign,
  Calendar,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCompany } from "@/context/CompanyContext";

const ICON_MAP = {
  Factory,
  Zap,
  Cpu,
  Landmark,
  Heart,
  ShoppingBag,
  Truck,
  Building2,
};

const COUNTRIES = [
  "Germany",
  "United States",
  "United Kingdom",
  "France",
  "Netherlands",
  "Switzerland",
  "Austria",
  "Sweden",
  "Denmark",
  "Norway",
  "Japan",
  "South Korea",
  "Singapore",
  "Australia",
  "Canada",
  "Other",
];

const REVENUE_RANGES = [
  "Under EUR 10M",
  "EUR 10M - 50M",
  "EUR 50M - 200M",
  "EUR 200M - 500M",
  "EUR 500M - 1B",
  "EUR 1B - 5B",
  "Over EUR 5B",
];

const REPORTING_YEARS = ["2024", "2025", "2026"];

const PRESET_COMPANIES = [
  { id: "meridian", name: "Meridian GmbH", industry: "Manufacturing", country: "Germany", revenue: "EUR 420M", desc: "Industrial manufacturing" },
  { id: "heidelberg", name: "Heidelberg Materials SE", industry: "Construction", country: "Germany", revenue: "EUR 21.1B", desc: "Cement & construction materials" },
  { id: "danone", name: "Groupe Danone SA", industry: "Food & Agriculture", country: "France", revenue: "EUR 27.6B", desc: "Food & beverage" },
];

const EU_INDUSTRIES = [
  { id: 'ind1', name: 'Construction', icon: 'Building2', subcategories: ['Cement & Concrete', 'Steel Structures', 'Infrastructure', 'Residential'], materialESRS: ['E1', 'E3', 'E5', 'S1', 'S2'] },
  { id: 'ind2', name: 'Manufacturing', icon: 'Factory', subcategories: ['Automotive', 'Heavy Machinery', 'Electronics', 'Consumer Goods'], materialESRS: ['E1', 'E2', 'E3', 'E5', 'S1', 'S2', 'G1'] },
  { id: 'ind3', name: 'Chemicals', icon: 'Zap', subcategories: ['Specialty Chemicals', 'Petrochemicals', 'Pharmaceuticals', 'Agrochemicals'], materialESRS: ['E1', 'E2', 'E3', 'S1', 'G1'] },
  { id: 'ind4', name: 'Automotive', icon: 'Truck', subcategories: ['OEM', 'Tier 1 Suppliers', 'EV & Battery', 'Aftermarket'], materialESRS: ['E1', 'E2', 'E5', 'S1', 'S2'] },
  { id: 'ind5', name: 'Food & Agriculture', icon: 'ShoppingBag', subcategories: ['Dairy & Meat', 'Packaged Food', 'Agriculture', 'Beverages'], materialESRS: ['E1', 'E4', 'E5', 'S1', 'S2', 'S4'] },
  { id: 'ind6', name: 'Retail & CPG', icon: 'ShoppingBag', subcategories: ['E-commerce', 'Fashion', 'Home & Personal Care', 'Grocery'], materialESRS: ['E1', 'E5', 'S1', 'S2', 'S4'] },
  { id: 'ind7', name: 'Energy & Utilities', icon: 'Zap', subcategories: ['Renewables', 'Oil & Gas', 'Power Generation', 'Grid & Distribution'], materialESRS: ['E1', 'E2', 'E3', 'S1', 'G1'] },
  { id: 'ind8', name: 'Electronics', icon: 'Cpu', subcategories: ['Semiconductors', 'Consumer Electronics', 'Industrial IoT', 'Telecom'], materialESRS: ['E1', 'E2', 'E5', 'S1', 'S2'] },
];

function StepIndicator({ currentStep, totalSteps }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-8">
      {Array.from({ length: totalSteps }).map((_, idx) => {
        const stepNum = idx + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;

        return (
          <div key={idx} className="flex items-center gap-3">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-mono font-bold transition-all duration-300 ${
                isActive
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                  : isCompleted
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-white/5 text-white/30 border border-white/10"
              }`}
            >
              {isCompleted ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                stepNum
              )}
            </div>
            {idx < totalSteps - 1 && (
              <div
                className={`w-12 h-px transition-all duration-300 ${
                  isCompleted ? "bg-emerald-500/50" : "bg-white/10"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function AnimatedCheckmark() {
  return (
    <div className="flex justify-center mb-6">
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center animate-fade-in glow-primary">
          <div className="w-14 h-14 rounded-full bg-emerald-500/30 flex items-center justify-center">
            <Check className="h-8 w-8 text-emerald-400" strokeWidth={3} />
          </div>
        </div>
        <div className="absolute inset-0 rounded-full animate-ping bg-emerald-500/10" style={{ animationDuration: '2s' }} />
      </div>
    </div>
  );
}

export default function Onboarding() {
  const navigate = useNavigate();
  const { setActiveCompanyId } = useCompany();
  const [selectedPreset, setSelectedPreset] = useState(null);

  const [step, setStep] = useState(1);

  // Step 1
  const [companyName, setCompanyName] = useState("");
  const [country, setCountry] = useState("");

  // Step 2
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);

  // Step 3
  const [employees, setEmployees] = useState("");
  const [revenueRange, setRevenueRange] = useState("");
  const [reportingYear, setReportingYear] = useState("");
  const [scopes, setScopes] = useState({ scope1: true, scope2: true, scope3: true });

  const canContinue = useMemo(() => {
    switch (step) {
      case 1:
        return companyName.trim().length > 0 && country.length > 0;
      case 2:
        return selectedIndustry !== null;
      case 3:
        return employees.length > 0 && revenueRange.length > 0 && reportingYear.length > 0;
      default:
        return true;
    }
  }, [step, companyName, country, selectedIndustry, employees, revenueRange, reportingYear]);

  function toggleSubcategory(sub) {
    setSelectedSubcategories((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
    );
  }

  function handleNext() {
    if (step < 4) setStep(step + 1);
  }

  function handleBack() {
    if (step > 1) setStep(step - 1);
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-sky-500/5 blur-[120px] pointer-events-none" />

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          <StepIndicator currentStep={step} totalSteps={4} />

          <div className="glass-card p-8 animate-fade-in-up">
            {/* === Step 1: Welcome === */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 glow-primary">
                      <Activity className="h-7 w-7 text-emerald-400" />
                    </div>
                  </div>
                  <h1 className="text-3xl font-display font-bold tracking-tight text-gradient-primary mb-2">
                    SCOPE3
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Set up your carbon management platform
                  </p>
                </div>

                {/* Quick Start - Example Companies */}
                <div className="space-y-3">
                  <Label className="text-xs text-white/50">Quick Start with an example company</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {PRESET_COMPANIES.map((pc) => (
                      <button
                        key={pc.id}
                        onClick={() => {
                          setSelectedPreset(pc.id);
                          setCompanyName(pc.name);
                          setCountry(pc.country);
                        }}
                        className={`p-3 rounded-lg border text-left transition-all duration-200 ${
                          selectedPreset === pc.id
                            ? "border-emerald-500/50 bg-emerald-500/10"
                            : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                        }`}
                      >
                        <span className={`text-xs font-semibold block ${selectedPreset === pc.id ? "text-emerald-400" : "text-white/70"}`}>
                          {pc.name}
                        </span>
                        <span className="text-[10px] text-white/40 block mt-0.5">{pc.desc}</span>
                        <span className="text-[10px] font-mono text-white/30 mt-1 block">{pc.revenue}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-[10px] text-white/30 uppercase tracking-widest">or enter manually</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-white/60">
                      Company Name
                    </Label>
                    <Input
                      placeholder="e.g. Meridian GmbH"
                      value={companyName}
                      onChange={(e) => {
                        setCompanyName(e.target.value);
                        setSelectedPreset(null);
                      }}
                      className="bg-white/5 border-white/10 h-11 text-white placeholder:text-white/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-white/60">Country</Label>
                    <Select value={country} onValueChange={(val) => {
                      setCountry(val);
                      setSelectedPreset(null);
                    }}>
                      <SelectTrigger className="bg-white/5 border-white/10 h-11 text-white">
                        <SelectValue placeholder="Select country..." />
                      </SelectTrigger>
                      <SelectContent className="bg-[hsl(0,0%,8%)] border-white/10">
                        {COUNTRIES.map((c) => (
                          <SelectItem
                            key={c}
                            value={c}
                            className="text-white/80 focus:bg-white/10 focus:text-white"
                          >
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* === Step 2: Select Industry === */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-display font-semibold text-foreground mb-1">
                    Select Your Industry
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    This helps us configure relevant emission categories
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {EU_INDUSTRIES.map((ind) => {
                    const IconComp = ICON_MAP[ind.icon] || Factory;
                    const isSelected = selectedIndustry?.id === ind.id;
                    return (
                      <button
                        key={ind.id}
                        onClick={() => {
                          setSelectedIndustry(ind);
                          setSelectedSubcategories([]);
                        }}
                        className={`p-4 rounded-lg border text-center transition-all duration-200 ${
                          isSelected
                            ? "border-emerald-500/50 bg-emerald-500/10 shadow-lg shadow-emerald-500/10"
                            : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/20"
                        }`}
                      >
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-lg mx-auto mb-2 ${
                            isSelected
                              ? "bg-emerald-500/20"
                              : "bg-white/[0.06]"
                          }`}
                        >
                          <IconComp
                            className={`h-5 w-5 ${
                              isSelected
                                ? "text-emerald-400"
                                : "text-white/40"
                            }`}
                          />
                        </div>
                        <span
                          className={`text-xs font-medium ${
                            isSelected ? "text-emerald-400" : "text-white/60"
                          }`}
                        >
                          {ind.name}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Subcategories */}
                {selectedIndustry && (
                  <div className="animate-fade-in">
                    <Label className="text-xs text-white/50 mb-2 block">
                      Select applicable subcategories for{" "}
                      <span className="text-emerald-400">
                        {selectedIndustry.name}
                      </span>
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedIndustry.subcategories.map((sub) => {
                        const isChecked = selectedSubcategories.includes(sub);
                        return (
                          <button
                            key={sub}
                            onClick={() => toggleSubcategory(sub)}
                            className={`px-3 py-1.5 rounded-md text-xs border transition-all duration-150 ${
                              isChecked
                                ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-400"
                                : "border-white/10 bg-white/[0.03] text-white/50 hover:bg-white/[0.06]"
                            }`}
                          >
                            {isChecked && (
                              <Check className="h-3 w-3 inline mr-1" />
                            )}
                            {sub}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Material ESRS topics */}
                {selectedIndustry?.materialESRS && (
                  <div className="animate-fade-in mt-3">
                    <Label className="text-xs text-white/50 mb-2 block">
                      Material ESRS topics for this industry
                    </Label>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedIndustry.materialESRS.map((topic) => (
                        <span key={topic} className="px-2 py-0.5 rounded text-[10px] font-mono bg-violet-500/15 text-violet-400 border border-violet-500/30">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* === Step 3: Team & Scope === */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-display font-semibold text-foreground mb-1">
                    Team & Reporting Scope
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Configure your organization profile
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-white/60 flex items-center gap-1.5">
                      <Users className="h-3 w-3" />
                      Number of Employees
                    </Label>
                    <Input
                      type="number"
                      placeholder="e.g. 3200"
                      value={employees}
                      onChange={(e) => setEmployees(e.target.value)}
                      className="bg-white/5 border-white/10 h-11 text-white placeholder:text-white/20 font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-white/60 flex items-center gap-1.5">
                      <DollarSign className="h-3 w-3" />
                      Revenue Range
                    </Label>
                    <Select value={revenueRange} onValueChange={setRevenueRange}>
                      <SelectTrigger className="bg-white/5 border-white/10 h-11 text-white">
                        <SelectValue placeholder="Select range..." />
                      </SelectTrigger>
                      <SelectContent className="bg-[hsl(0,0%,8%)] border-white/10">
                        {REVENUE_RANGES.map((r) => (
                          <SelectItem
                            key={r}
                            value={r}
                            className="text-white/80 focus:bg-white/10 focus:text-white"
                          >
                            {r}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label className="text-xs text-white/60 flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" />
                      Reporting Year
                    </Label>
                    <Select
                      value={reportingYear}
                      onValueChange={setReportingYear}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 h-11 text-white">
                        <SelectValue placeholder="Select year..." />
                      </SelectTrigger>
                      <SelectContent className="bg-[hsl(0,0%,8%)] border-white/10">
                        {REPORTING_YEARS.map((y) => (
                          <SelectItem
                            key={y}
                            value={y}
                            className="text-white/80 focus:bg-white/10 focus:text-white"
                          >
                            FY {y}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <Label className="text-xs text-white/60 flex items-center gap-1.5">
                    <Layers className="h-3 w-3" />
                    Which scopes to track?
                  </Label>
                  <div className="flex gap-3">
                    {[
                      { key: "scope1", label: "Scope 1", desc: "Direct emissions" },
                      { key: "scope2", label: "Scope 2", desc: "Energy indirect" },
                      { key: "scope3", label: "Scope 3", desc: "Value chain" },
                    ].map((s) => (
                      <button
                        key={s.key}
                        onClick={() =>
                          setScopes((prev) => ({
                            ...prev,
                            [s.key]: !prev[s.key],
                          }))
                        }
                        className={`flex-1 p-3 rounded-lg border text-center transition-all duration-150 ${
                          scopes[s.key]
                            ? "border-emerald-500/40 bg-emerald-500/10"
                            : "border-white/10 bg-white/[0.03]"
                        }`}
                      >
                        <div className="flex items-center justify-center gap-1.5 mb-1">
                          {scopes[s.key] && (
                            <Check className="h-3 w-3 text-emerald-400" />
                          )}
                          <span
                            className={`text-xs font-semibold ${
                              scopes[s.key]
                                ? "text-emerald-400"
                                : "text-white/50"
                            }`}
                          >
                            {s.label}
                          </span>
                        </div>
                        <span className="text-[10px] text-white/30">
                          {s.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* === Step 4: Ready === */}
            {step === 4 && (
              <div className="text-center space-y-4 py-4">
                <AnimatedCheckmark />
                <h2 className="text-2xl font-display font-bold text-foreground">
                  Your workspace is ready
                </h2>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  We've configured{" "}
                  <span className="text-emerald-400 font-medium">
                    {companyName || "your company"}
                  </span>{" "}
                  with{" "}
                  {selectedIndustry ? (
                    <span className="text-emerald-400 font-medium">
                      {selectedIndustry.name}
                    </span>
                  ) : (
                    "your industry"
                  )}{" "}
                  settings for FY {reportingYear || "2024"}.
                </p>
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  {Object.entries(scopes)
                    .filter(([, v]) => v)
                    .map(([key]) => (
                      <span
                        key={key}
                        className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs border border-emerald-500/30"
                      >
                        {key === "scope1"
                          ? "Scope 1"
                          : key === "scope2"
                          ? "Scope 2"
                          : "Scope 3"}
                      </span>
                    ))}
                </div>
              </div>
            )}

            {/* === Navigation Buttons === */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
              {step > 1 && step < 4 ? (
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  className="text-white/50 hover:text-white/80"
                >
                  <ArrowLeft className="h-4 w-4 mr-1.5" />
                  Back
                </Button>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <Button
                  onClick={handleNext}
                  disabled={!canContinue}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-40"
                >
                  Continue
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    if (selectedPreset) setActiveCompanyId(selectedPreset);
                    navigate("/");
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white w-full"
                >
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
