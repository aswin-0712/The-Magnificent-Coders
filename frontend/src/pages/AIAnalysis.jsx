import {
  AlertTriangle,
  BrainCircuit,
  Calendar,
  CheckCircle2,
  Download,
  ExternalLink,
  FileSearch,
  Info,
  Mail,
  MapPin,
  Phone,
  Play,
  Tag,
  User,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { useEvidence } from '../hooks/useEvidence';
import { downloadAnalysisText } from '../utils/pdfExport';

const PIPELINE_STEPS = [
  'Evidence received',
  'Text extraction',
  'Entity recognition',
  'Pattern identification',
  'Summary generation',
];

const ENTITY_META = {
  People: { icon: User, bg: '#F0EBFF', text: '#7656E8' },
  'Phone Numbers': { icon: Phone, bg: '#ECFDF5', text: '#22B981' },
  'Email Addresses': { icon: Mail, bg: '#EAF2FF', text: '#367FEA' },
  Dates: { icon: Calendar, bg: '#FEF3C7', text: '#D97706' },
  Locations: { icon: MapPin, bg: '#F1F5F9', text: '#475569' },
};

function HighlightedText({ text, keywords = [] }) {
  if (!text) return null;
  const cleanKeywords = keywords.filter((k) => k && k.length > 2);
  if (cleanKeywords.length === 0) return <p className="text-sm text-[#172554] leading-relaxed">{text}</p>;

  const escaped = cleanKeywords.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escaped.join('|')})`, 'gi');
  const parts = text.split(regex);

  return (
    <p className="text-sm text-[#172554] leading-relaxed whitespace-pre-wrap">
      {parts.map((part, idx) => {
        const isMatch = cleanKeywords.some((k) => k.toLowerCase() === part.toLowerCase());
        return isMatch ? (
          <mark
            key={idx}
            className="px-1 py-0.5 rounded bg-[#F0EBFF] text-[#7656E8] font-medium"
          >
            {part}
          </mark>
        ) : (
          <span key={idx}>{part}</span>
        );
      })}
    </p>
  );
}

export default function AIAnalysis() {
  const { investigations, evidence, analyses, runAnalysis } = useEvidence();
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedCaseId, setSelectedCaseId] = useState(
    location.state?.caseId || investigations[0]?.id || 'CASE-2026-014'
  );

  const caseEvidence = useMemo(
    () => evidence.filter((e) => e.caseId === selectedCaseId),
    [evidence, selectedCaseId]
  );

  const [selectedEvidenceId, setSelectedEvidenceId] = useState(
    location.state?.evidenceId || caseEvidence[0]?.id || evidence[0]?.id || ''
  );

  useEffect(() => {
    if (location.state?.caseId) setSelectedCaseId(location.state.caseId);
    if (location.state?.evidenceId) setSelectedEvidenceId(location.state.evidenceId);
  }, [location.state]);

  useEffect(() => {
    if (caseEvidence.length > 0 && !caseEvidence.some((e) => e.id === selectedEvidenceId)) {
      setSelectedEvidenceId(caseEvidence[0].id);
    }
  }, [caseEvidence, selectedEvidenceId]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(-1);

  const currentAnalysis = analyses[selectedEvidenceId] || null;
  const currentCase = investigations.find((c) => c.id === selectedCaseId) || investigations[0];
  const currentEvidence = evidence.find((e) => e.id === selectedEvidenceId);

  const handleRunAnalysis = async () => {
    if (!selectedEvidenceId) {
      toast.error('Please select an evidence item first.');
      return;
    }
    setIsProcessing(true);
    setActiveStepIndex(0);

    for (let step = 0; step < PIPELINE_STEPS.length; step += 1) {
      setActiveStepIndex(step);
      await new Promise((resolve) => setTimeout(resolve, 380));
    }

    const res = await runAnalysis({ caseId: selectedCaseId, evidenceId: selectedEvidenceId });
    setIsProcessing(false);
    setActiveStepIndex(PIPELINE_STEPS.length);

    if (res.backendConnected) {
      toast.success('Server-side AI analysis completed.');
    } else {
      toast.success('Demonstration analysis completed (Flask offline fallback).');
    }
  };

  const handleDownload = () => {
    if (!currentAnalysis) {
      toast.error('Run AI Analysis before downloading results.');
      return;
    }
    downloadAnalysisText(
      currentAnalysis,
      currentCase?.title || selectedCaseId,
      currentEvidence?.fileName || selectedEvidenceId
    );
    toast.success('Downloaded analysis summary (.txt)');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-[#172554]">
            AI Evidence Analysis
          </h1>
          <p className="mt-1 text-sm text-[#64748B]">
            Extract meaningful insights from your digital evidence.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownload}
          disabled={!currentAnalysis}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#E5E7F0] hover:bg-[#F5F6FC] text-sm font-semibold text-[#172554] disabled:opacity-50 transition-colors whitespace-nowrap shrink-0"
        >
          <Download className="w-4 h-4 text-[#7656E8]" />
          <span>Download Analysis</span>
        </button>
      </div>

      {/* Top Selection Bar */}
      <div className="forensic-card p-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        <div className="md:col-span-5">
          <label htmlFor="analysis-case" className="block text-xs font-semibold text-[#172554] mb-1.5">
            Select Investigation
          </label>
          <select
            id="analysis-case"
            value={selectedCaseId}
            onChange={(e) => setSelectedCaseId(e.target.value)}
            className="w-full h-11 px-3.5 rounded-xl bg-[#F5F6FC] border border-[#E5E7F0] text-sm text-[#172554] focus:outline-none focus:bg-white focus:border-[#7656E8]"
          >
            {investigations.map((c) => (
              <option key={c.id} value={c.id}>
                {c.id} — {c.title}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-4">
          <label htmlFor="analysis-evidence" className="block text-xs font-semibold text-[#172554] mb-1.5">
            Select Evidence
          </label>
          <select
            id="analysis-evidence"
            value={selectedEvidenceId}
            onChange={(e) => setSelectedEvidenceId(e.target.value)}
            className="w-full h-11 px-3.5 rounded-xl bg-[#F5F6FC] border border-[#E5E7F0] text-sm text-[#172554] focus:outline-none focus:bg-white focus:border-[#7656E8]"
          >
            {caseEvidence.length === 0 ? (
              <option value="">No evidence attached to this case</option>
            ) : (
              caseEvidence.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.fileName} ({item.fileType})
                </option>
              ))
            )}
          </select>
        </div>

        <div className="md:col-span-3">
          <button
            type="button"
            onClick={handleRunAnalysis}
            disabled={isProcessing || !selectedEvidenceId}
            className="w-full h-11 px-5 rounded-xl bg-gradient-to-r from-[#7656E8] to-[#367FEA] text-white text-sm font-semibold shadow-sm hover:opacity-95 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Play className="w-4 h-4" />
            <span>{isProcessing ? 'Analyzing...' : 'Run AI Analysis'}</span>
          </button>
        </div>
      </div>

      {/* 5-Stage Analysis Process Indicator */}
      <div className="forensic-card p-5">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="text-sm font-semibold text-[#172554]">Analysis Pipeline</h2>
          {isProcessing && <LoadingSpinner size="sm" label="Running pipeline sequence..." />}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {PIPELINE_STEPS.map((stepLabel, idx) => {
            const isCompleted =
              (!isProcessing && currentAnalysis) || activeStepIndex > idx;
            const isCurrent = isProcessing && activeStepIndex === idx;

            return (
              <div
                key={stepLabel}
                className={`p-3.5 rounded-xl border transition-all flex items-center gap-3 ${
                  isCurrent
                    ? 'border-[#7656E8] bg-[#F0EBFF]/60'
                    : isCompleted
                    ? 'border-[#22B981]/40 bg-[#ECFDF5]/60'
                    : 'border-[#E5E7F0] bg-[#F5F6FC]'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 tabular-nums ${
                    isCurrent
                      ? 'bg-[#7656E8] text-white'
                      : isCompleted
                      ? 'bg-[#22B981] text-white'
                      : 'bg-white text-[#64748B] border border-[#E5E7F0]'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>
                <span className="text-xs font-medium text-[#172554] leading-snug">
                  {stepLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Results Area */}
      {!currentAnalysis ? (
        <div className="forensic-card p-10 text-center">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-[#F0EBFF] text-[#7656E8] flex items-center justify-center">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <h3 className="mt-3 text-base font-semibold text-[#172554]">
            Ready to Analyze Selected Evidence
          </h3>
          <p className="mt-1 text-sm text-[#64748B] max-w-md mx-auto">
            Select an investigation and artifact above, then click Run AI Analysis to view extracted text, recognized entities, and investigative leads.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Honest Distinction Banner */}
          <div className="rounded-2xl bg-[#EAF2FF] border border-[#367FEA]/25 p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-[#367FEA] shrink-0 mt-0.5" />
            <div className="text-xs text-[#172554] leading-relaxed">
              <span className="font-semibold">Extracted Facts vs. AI Inferences ({currentAnalysis.modeLabel}): </span>
              {currentAnalysis.verificationDisclaimer}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* A. Extracted Text */}
            <section className="lg:col-span-7 forensic-card p-5 sm:p-6 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E5E7F0]">
                <div className="flex items-center gap-2">
                  <FileSearch className="w-4 h-4 text-[#367FEA]" />
                  <h3 className="text-base font-semibold text-[#172554]">A. Extracted Text</h3>
                </div>
                {currentEvidence && (
                  <button
                    type="button"
                    onClick={() =>
                      navigate('/upload', { state: { highlightEvidenceId: currentEvidence.id } })
                    }
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#7656E8] hover:underline"
                  >
                    <span>Source: {currentEvidence.fileName}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="p-4 rounded-xl bg-[#F5F6FC] border border-[#E5E7F0]">
                <HighlightedText
                  text={currentAnalysis.extractedText}
                  keywords={currentAnalysis.keywords}
                />
              </div>
            </section>

            {/* D. AI-Generated Summary */}
            <section className="lg:col-span-5 forensic-card p-5 sm:p-6 space-y-3">
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#E5E7F0]">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-[#7656E8]" />
                  <h3 className="text-base font-semibold text-[#172554]">D. AI-Generated Summary</h3>
                </div>
                <span className="text-[11px] font-medium text-[#64748B]">Investigative Lead</span>
              </div>

              <p className="text-sm text-[#172554] leading-relaxed">{currentAnalysis.aiSummary}</p>

              {/* C. Important Keywords */}
              <div className="pt-3 border-t border-[#E5E7F0]">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#64748B] mb-2.5">
                  <Tag className="w-3.5 h-3.5" />
                  <span>C. Important Keywords</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(currentAnalysis.keywords || []).map((kw) => (
                    <span
                      key={kw}
                      className="px-2.5 py-1 rounded-lg bg-[#F0EBFF] text-[#7656E8] text-xs font-medium"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* B. Identified Entities */}
          <section className="forensic-card p-5 sm:p-6">
            <h3 className="text-base font-semibold text-[#172554] pb-3 border-b border-[#E5E7F0]">
              B. Identified Entities
            </h3>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {Object.entries(currentAnalysis.entities || {}).map(([category, items]) => {
                const meta = ENTITY_META[category] || ENTITY_META.Locations;
                const Icon = meta.icon;
                return (
                  <div
                    key={category}
                    className="p-3.5 rounded-xl bg-[#F5F6FC] border border-[#E5E7F0] space-y-2.5"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: meta.bg, color: meta.text }}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </span>
                      <span className="text-xs font-semibold text-[#172554]">{category}</span>
                    </div>
                    {items.length === 0 ? (
                      <p className="text-xs text-[#94A3B8]">None identified</p>
                    ) : (
                      <ul className="space-y-1.5">
                        {items.map((val) => (
                          <li
                            key={val}
                            className="text-xs font-medium px-2 py-1 rounded-md bg-white border border-[#E5E7F0] text-[#172554] break-words"
                          >
                            {val}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* E. Findings & F. Evidence References */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <section className="lg:col-span-6 forensic-card p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E7F0]">
                <h3 className="text-base font-semibold text-[#172554]">
                  E. Findings &amp; Pattern Observations
                </h3>
                <span className="text-[11px] text-[#64748B]">Requires human verification</span>
              </div>

              <div className="space-y-3">
                {(currentAnalysis.findings || []).map((finding) => {
                  const isWarn = finding.severity === 'Warning';
                  return (
                    <div
                      key={finding.id}
                      className="p-4 rounded-xl bg-[#F5F6FC] border border-[#E5E7F0] space-y-1.5"
                    >
                      <div className="flex items-center gap-2">
                        <AlertTriangle
                          className={`w-4 h-4 shrink-0 ${
                            isWarn ? 'text-[#F59E0B]' : 'text-[#367FEA]'
                          }`}
                        />
                        <span className="text-sm font-semibold text-[#172554]">{finding.title}</span>
                      </div>
                      <p className="text-xs text-[#64748B] leading-relaxed">{finding.description}</p>
                      <p className="text-[11px] font-mono text-[#7656E8]">
                        Reference: {finding.reference}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="lg:col-span-6 forensic-card p-5 sm:p-6 space-y-4">
              <h3 className="text-base font-semibold text-[#172554] pb-3 border-b border-[#E5E7F0]">
                F. Evidence References
              </h3>

              <div className="space-y-3">
                {(currentAnalysis.references || []).map((ref, idx) => (
                  <div
                    key={`${ref.fileName}-${idx}`}
                    className="p-4 rounded-xl bg-[#F5F6FC] border border-[#E5E7F0] space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold font-mono text-[#172554] truncate">
                        {ref.fileName}
                      </span>
                      <span className="text-[11px] text-[#367FEA] font-medium whitespace-nowrap">
                        {ref.location}
                      </span>
                    </div>
                    <p className="text-xs text-[#64748B] italic">"{ref.excerpt}"</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}

