import {
  CheckCircle2,
  Clock3,
  Download,
  Eye,
  FileBarChart2,
  FilePlus2,
  Printer,
  ShieldCheck,
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import StatCard from '../components/StatCard';
import { useEvidence } from '../hooks/useEvidence';
import { downloadReportPdf } from '../utils/pdfExport';

export default function Reports() {
  const { investigations, reports, createReport } = useEvidence();
  const [selectedCaseForNew, setSelectedCaseForNew] = useState(
    investigations[0]?.id || 'CASE-2026-014'
  );
  const [selectedReportId, setSelectedReportId] = useState(reports[0]?.id || null);
  const [generating, setGenerating] = useState(false);

  const selectedReport =
    reports.find((r) => r.id === selectedReportId) || reports[0] || null;

  const completedCount = reports.filter((r) => r.status === 'Completed').length;
  const pendingCount = reports.filter((r) => r.status !== 'Completed').length;

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const { report, backendConnected } = await createReport(selectedCaseForNew);
      setSelectedReportId(report.id);
      toast.success(
        backendConnected
          ? `Generated report ${report.id} from server.`
          : `Generated demonstration report ${report.id}.`
      );
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadPdf = (report) => {
    if (!report) return;
    downloadReportPdf(report);
    toast.success(`Downloaded ${report.id}_Report.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-[#172554]">
            Investigation Reports
          </h1>
          <p className="mt-1 text-sm text-[#64748B]">
            Generate, view and manage investigation reports.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            aria-label="Select investigation for report generation"
            value={selectedCaseForNew}
            onChange={(e) => setSelectedCaseForNew(e.target.value)}
            className="h-10 px-3 rounded-xl bg-white border border-[#E5E7F0] text-xs font-medium text-[#172554] focus:outline-none focus:border-[#7656E8]"
          >
            {investigations.map((c) => (
              <option key={c.id} value={c.id}>
                {c.id} — {c.title.slice(0, 30)}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-gradient-to-r from-[#7656E8] to-[#367FEA] text-white text-xs font-semibold shadow-sm hover:opacity-95 disabled:opacity-60 whitespace-nowrap"
          >
            <FilePlus2 className="w-4 h-4" />
            <span>{generating ? 'Generating...' : 'Generate Report'}</span>
          </button>
        </div>
      </div>

      {/* Report Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 no-print">
        <StatCard
          label="Total Reports"
          value={reports.length}
          trend="Active registry"
          trendDirection="up"
          icon={FileBarChart2}
          accentColor="#7656E8"
          softBg="#F0EBFF"
          demoCaption="Compiled dossiers"
        />
        <StatCard
          label="Completed Reports"
          value={completedCount}
          trend="Ready for export"
          trendDirection="up"
          icon={CheckCircle2}
          accentColor="#22B981"
          softBg="#ECFDF5"
          demoCaption="PDF & Print enabled"
        />
        <StatCard
          label="Pending Reports"
          value={pendingCount}
          trend="Awaiting artifacts"
          trendDirection="down"
          icon={Clock3}
          accentColor="#F59E0B"
          softBg="#FEF3C7"
          demoCaption="In collection phase"
        />
      </div>

      {/* Report Table */}
      <div className="forensic-card overflow-hidden no-print">
        <div className="px-5 py-4 border-b border-[#E5E7F0]">
          <h2 className="text-base font-semibold text-[#172554]">Report Directory</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E5E7F0] bg-[#F5F6FC]/60 text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                <th className="py-3 px-4">Report ID</th>
                <th className="py-3 px-4">Investigation Name</th>
                <th className="py-3 px-4">Generated Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7F0] text-sm">
              {reports.map((report) => {
                const isSelected = selectedReport?.id === report.id;
                const isDone = report.status === 'Completed';
                return (
                  <tr
                    key={report.id}
                    onClick={() => setSelectedReportId(report.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-[#F0EBFF]/45' : 'hover:bg-[#F5F6FC]'
                    }`}
                  >
                    <td className="py-3.5 px-4 font-mono text-xs font-semibold text-[#7656E8] whitespace-nowrap">
                      {report.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-[#172554]">{report.investigationName}</div>
                      <div className="text-[11px] font-mono text-[#64748B]">{report.caseId}</div>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono text-[#64748B] tabular-nums whitespace-nowrap">
                      {report.generatedDate}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                          isDone ? 'text-[#22B981]' : 'text-[#F59E0B]'
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <Clock3 className="w-3.5 h-3.5" />
                        )}
                        <span>{report.status}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedReportId(report.id);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#F5F6FC] hover:bg-[#F0EBFF] text-xs font-semibold text-[#172554]"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#7656E8]" />
                          <span>View Report</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadPdf(report);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#EAF2FF] hover:bg-[#dbeafe] text-xs font-semibold text-[#367FEA]"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Professional 11-Section Report Preview */}
      {selectedReport && (
        <section className="forensic-card p-6 sm:p-8 lg:p-10 space-y-6 print-full">
          {/* Preview Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E5E7F0]">
            <div>
              <div className="text-xs font-semibold text-[#7656E8] uppercase tracking-wider">
                Forensic Report Preview · {selectedReport.id}
              </div>
              <h2 className="mt-1 text-xl sm:text-2xl font-bold text-[#172554]">
                {selectedReport.investigationName}
              </h2>
              <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-[#64748B] font-mono tabular-nums">
                <span>Case ID: {selectedReport.caseId}</span>
                <span aria-hidden="true">·</span>
                <span>Investigation Date: {selectedReport.generatedDate}</span>
                <span aria-hidden="true">·</span>
                <span>Status: {selectedReport.status}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 no-print">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F5F6FC] border border-[#E5E7F0] hover:bg-[#E5E7F0]/50 text-xs font-semibold text-[#172554]"
              >
                <Printer className="w-4 h-4 text-[#64748B]" />
                <span>Print Report</span>
              </button>
              <button
                type="button"
                onClick={() => handleDownloadPdf(selectedReport)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#7656E8] hover:bg-[#6445d8] text-white text-xs font-semibold shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>

          {/* 4. Evidence List */}
          <div>
            <h3 className="text-sm font-bold text-[#172554] mb-2.5">4. Evidence List</h3>
            <div className="overflow-x-auto border border-[#E5E7F0] rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-[#F5F6FC] text-[#64748B] font-semibold">
                  <tr>
                    <th className="py-2.5 px-3.5">Filename</th>
                    <th className="py-2.5 px-3.5">Type</th>
                    <th className="py-2.5 px-3.5">Size</th>
                    <th className="py-2.5 px-3.5">Upload Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7F0]">
                  {(selectedReport.evidenceList || []).map((ev, i) => (
                    <tr key={`${ev.fileName}-${i}`}>
                      <td className="py-2.5 px-3.5 font-mono text-[#172554]">{ev.fileName}</td>
                      <td className="py-2.5 px-3.5 text-[#64748B]">{ev.fileType}</td>
                      <td className="py-2.5 px-3.5 font-mono tabular-nums">{ev.fileSize}</td>
                      <td className="py-2.5 px-3.5 font-mono tabular-nums text-[#64748B]">
                        {ev.uploadDate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 5. Extracted Text & 6. Identified Entities */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-2">
              <h3 className="text-sm font-bold text-[#172554]">5. Extracted Text</h3>
              <div className="p-4 rounded-xl bg-[#F5F6FC] border border-[#E5E7F0] text-xs font-mono text-[#172554] leading-relaxed whitespace-pre-wrap">
                {selectedReport.extractedText}
              </div>
            </div>

            <div className="lg:col-span-5 space-y-2">
              <h3 className="text-sm font-bold text-[#172554]">6. Identified Entities</h3>
              <div className="p-4 rounded-xl bg-[#F5F6FC] border border-[#E5E7F0] space-y-2.5 text-xs">
                {Object.entries(selectedReport.identifiedEntities || {}).map(([cat, vals]) => (
                  <div key={cat}>
                    <span className="font-semibold text-[#7656E8]">{cat}: </span>
                    <span className="text-[#172554]">
                      {vals && vals.length > 0 ? vals.join(', ') : 'None detected'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 7. Incident Timeline */}
          <div>
            <h3 className="text-sm font-bold text-[#172554] mb-2.5">7. Incident Timeline</h3>
            <ul className="divide-y divide-[#E5E7F0] border border-[#E5E7F0] rounded-xl overflow-hidden text-xs">
              {(selectedReport.timelineSummary || []).map((evt, idx) => (
                <li key={idx} className="px-4 py-3 bg-white flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-semibold text-[#172554]">{evt.title}</span>
                    <span className="text-[#64748B]"> · {evt.category}</span>
                  </div>
                  <div className="font-mono text-[#64748B] tabular-nums">
                    {evt.timestamp} ({evt.sourceFile})
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* 8. Relationship Analysis & 9. AI-Generated Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-[#172554]">8. Relationship Analysis</h3>
              <p className="p-4 rounded-xl bg-[#F5F6FC] border border-[#E5E7F0] text-xs text-[#172554] leading-relaxed">
                {selectedReport.relationshipAnalysis}
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-[#172554]">9. AI-Generated Summary</h3>
              <p className="p-4 rounded-xl bg-[#F0EBFF]/50 border border-[#7656E8]/20 text-xs text-[#172554] leading-relaxed">
                {selectedReport.aiSummary}
              </p>
            </div>
          </div>

          {/* 10. Evidence Integrity Hashes */}
          <div>
            <h3 className="text-sm font-bold text-[#172554] mb-2.5 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#22B981]" />
              <span>10. Evidence Integrity Hashes (SHA-256)</span>
            </h3>
            <div className="space-y-2">
              {(selectedReport.integrityHashes || []).map((hashRow, idx) => (
                <div
                  key={`${hashRow.fileName}-${idx}`}
                  className="p-3 rounded-xl bg-[#F5F6FC] border border-[#E5E7F0] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="min-w-0">
                    <div className="font-semibold text-[#172554]">{hashRow.fileName}</div>
                    <div className="font-mono text-[11px] text-[#64748B] break-all mt-0.5">
                      {hashRow.sha256}
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-[#367FEA] whitespace-nowrap shrink-0">
                    {hashRow.verificationNote}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 11. Limitations & Verification Notes */}
          <div className="pt-4 border-t border-[#E5E7F0]">
            <h3 className="text-sm font-bold text-[#172554] mb-1.5">
              11. Limitations and Verification Notes
            </h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              {selectedReport.limitationsNote}
            </p>
          </div>
        </section>
      )}
    </div>
  );
}

