import { jsPDF } from 'jspdf';

/**
 * Generates and downloads a structured multi-section Investigation Report PDF
 * directly in the browser for demonstration and export workflows.
 */
export function downloadReportPdf(report) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 48;
  const contentWidth = pageWidth - margin * 2;
  let y = 52;

  const ensureSpace = (needed = 40) => {
    if (y + needed > pageHeight - 54) {
      doc.addPage();
      y = 52;
    }
  };

  const addSectionHeading = (title) => {
    ensureSpace(44);
    y += 10;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(118, 86, 232);
    doc.text(title, margin, y);
    y += 6;
    doc.setDrawColor(229, 231, 240);
    doc.line(margin, y, pageWidth - margin, y);
    y += 16;
  };

  const addBodyParagraph = (text, color = [23, 37, 84]) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text || '—', contentWidth);
    lines.forEach((line) => {
      ensureSpace(16);
      doc.text(line, margin, y);
      y += 14;
    });
  };

  // Top Header Banner
  doc.setFillColor(245, 246, 252);
  doc.rect(0, 0, pageWidth, 92, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(23, 37, 84);
  doc.text('EVIDENCE AI — INVESTIGATION REPORT', margin, 40);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Report ID: ${report.id}   |   Case ID: ${report.caseId}   |   Date: ${report.generatedDate}`, margin, 60);
  doc.text(`Status: ${report.status}   |   Demonstration Forensic Dossier`, margin, 75);

  y = 114;

  // 1. Investigation Title & Metadata
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(23, 37, 84);
  const titleLines = doc.splitTextToSize(report.investigationName, contentWidth);
  titleLines.forEach((line) => {
    doc.text(line, margin, y);
    y += 18;
  });

  // 2. Evidence List
  addSectionHeading('1. Evidence Inventory');
  (report.evidenceList || []).forEach((item, idx) => {
    addBodyParagraph(`${idx + 1}. ${item.fileName} (${item.fileType}, ${item.fileSize}) — Uploaded ${item.uploadDate}`);
  });

  // 3. Extracted Text
  addSectionHeading('2. Extracted Text Excerpts');
  addBodyParagraph(report.extractedText);

  // 4. Identified Entities
  addSectionHeading('3. Identified Entities');
  const entities = report.identifiedEntities || {};
  Object.entries(entities).forEach(([category, values]) => {
    addBodyParagraph(`${category}: ${(values || []).join(', ') || 'None detected'}`);
  });

  // 5. Incident Timeline
  addSectionHeading('4. Chronological Incident Timeline');
  (report.timelineSummary || []).forEach((evt) => {
    addBodyParagraph(`[${evt.timestamp}] ${evt.title} (${evt.category}) — Source: ${evt.sourceFile}`);
  });

  // 6. Relationship Analysis
  addSectionHeading('5. Relationship Analysis');
  addBodyParagraph(report.relationshipAnalysis);

  // 7. AI-Generated Summary
  addSectionHeading('6. AI-Generated Summary (Investigative Lead)');
  addBodyParagraph(report.aiSummary);

  // 8. Evidence Integrity Hashes
  addSectionHeading('7. Evidence Integrity Hashes (SHA-256)');
  (report.integrityHashes || []).forEach((hashRow) => {
    addBodyParagraph(`${hashRow.fileName}: ${hashRow.sha256} [${hashRow.verificationNote}]`, [51, 65, 85]);
  });

  // 9. Limitations & Verification Notes
  addSectionHeading('8. Limitations & Verification Notes');
  addBodyParagraph(report.limitationsNote, [100, 116, 139]);

  // Footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(
      `EVIDENCE AI • Generated for Demonstration & Review • Page ${i} of ${totalPages}`,
      margin,
      pageHeight - 24
    );
  }

  const safeName = `${report.id}_${report.caseId}`.replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`${safeName}_Report.pdf`);
}

export function downloadAnalysisText(analysis, investigationName, evidenceName) {
  const lines = [
    'EVIDENCE AI — ANALYSIS EXPORT',
    `Investigation: ${investigationName}`,
    `Evidence Source: ${evidenceName}`,
    `Exported At: ${new Date().toISOString()}`,
    `Mode: ${analysis.modeLabel || 'Demonstration Analysis Dataset'}`,
    '',
    '--- A. EXTRACTED TEXT ---',
    analysis.extractedText,
    '',
    '--- B. IDENTIFIED ENTITIES ---',
    ...Object.entries(analysis.entities).map(([k, v]) => `${k}: ${v.join(', ')}`),
    '',
    '--- C. KEYWORDS ---',
    analysis.keywords.join(', '),
    '',
    '--- D. AI-GENERATED SUMMARY (INVESTIGATIVE LEAD) ---',
    analysis.aiSummary,
    '',
    '--- E. OBSERVATIONS & FINDINGS ---',
    ...analysis.findings.map((f, idx) => `${idx + 1}. ${f.title} — ${f.description} (Ref: ${f.reference})`),
    '',
    '--- F. DISCLAIMER ---',
    analysis.verificationDisclaimer,
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${evidenceName.replace(/\.[^.]+$/, '')}_Analysis.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
