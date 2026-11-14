import { createContext, useContext, useState } from 'react';
import {
  INITIAL_ANALYSIS_BY_EVIDENCE,
  INITIAL_EVIDENCE,
  INITIAL_GRAPH_DATA,
  INITIAL_INVESTIGATIONS,
  INITIAL_RECENT_ACTIVITY,
  INITIAL_REPORTS,
  INITIAL_TIMELINE_EVENTS,
} from '../data/mockData';
import {
  deleteEvidenceApi,
  generateReportApi,
  runAiAnalysisApi,
  uploadEvidenceApi,
} from '../services/api';
import { computeFileSha256, formatFileSize } from '../utils/crypto';

const EvidenceContext = createContext(null);

function detectCategoryFromExtension(ext) {
  const upper = ext.toUpperCase();
  if (['PNG', 'JPG', 'JPEG'].includes(upper)) return 'Image';
  if (['PDF', 'DOCX', 'TXT'].includes(upper)) return 'Document';
  if (['MP3', 'WAV'].includes(upper)) return 'Audio';
  if (['CSV', 'JSON'].includes(upper)) return 'Chat Export';
  return 'Other';
}

async function readClientPreview(file, extension) {
  const upper = extension.toUpperCase();
  if (['PNG', 'JPG', 'JPEG'].includes(upper)) {
    return {
      previewUrl: URL.createObjectURL(file),
      extractedPreview: `Image file staged locally (${file.name}). Server-side OCR has not run while Flask backend is offline.`,
    };
  }
  if (['TXT', 'CSV', 'JSON'].includes(upper)) {
    try {
      const text = await file.text();
      return {
        previewUrl: null,
        extractedPreview: text.slice(0, 1200) || '(Empty text file)',
      };
    } catch {
      return { previewUrl: null, extractedPreview: 'Unable to read text content locally.' };
    }
  }
  if (['MP3', 'WAV'].includes(upper)) {
    return {
      previewUrl: URL.createObjectURL(file),
      extractedPreview: `Audio file staged locally (${file.name}). Speech-to-text transcription requires connecting the Flask backend.`,
    };
  }
  return {
    previewUrl: null,
    extractedPreview: `${upper} document staged locally (${file.name}). Deep text extraction requires the Flask document parser.`,
  };
}

export function EvidenceProvider({ children }) {
  const [investigations, setInvestigations] = useState(INITIAL_INVESTIGATIONS);
  const [evidence, setEvidence] = useState(INITIAL_EVIDENCE);
  const [recentActivity, setRecentActivity] = useState(INITIAL_RECENT_ACTIVITY);
  const [analyses, setAnalyses] = useState(INITIAL_ANALYSIS_BY_EVIDENCE);
  const [timelineEvents, setTimelineEvents] = useState(INITIAL_TIMELINE_EVENTS);
  const [graphData, setGraphData] = useState(INITIAL_GRAPH_DATA);
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [notifications, setNotifications] = useState([
    {
      id: 'NOTIF-1',
      title: 'Demonstration Workspace Loaded',
      detail: 'Sample forensics cases and evidence artifacts are ready for review.',
      time: 'Just now',
      read: false,
    },
    {
      id: 'NOTIF-2',
      title: 'IBAN Mismatch Flagged in CASE-2026-014',
      detail: 'Review Invoice #3345 analysis leads in AI Analysis.',
      time: '12m ago',
      read: false,
    },
    {
      id: 'NOTIF-3',
      title: 'Report RPT-2026-091 Ready for Export',
      detail: 'PDF download and print layout available in Reports.',
      time: '1h ago',
      read: true,
    },
  ]);

  const addActivity = (type, title, detail) => {
    const now = new Date();
    const timestamp = `${now.toISOString().slice(0, 10)} ${now.toTimeString().slice(0, 5)}`;
    setRecentActivity((prev) => [
      { id: `ACT-${Date.now()}`, type, title, detail, timestamp },
      ...prev.slice(0, 9),
    ]);
  };

  const createInvestigation = ({ title, description, leadInvestigator = 'Aswin' }) => {
    const num = String(investigations.length + 23).padStart(3, '0');
    const newCase = {
      id: `CASE-2026-${num}`,
      title: title.trim(),
      leadInvestigator,
      status: 'Active Review',
      createdAt: new Date().toISOString(),
      description: description.trim() || 'New digital forensics investigation workspace.',
    };
    setInvestigations((prev) => [newCase, ...prev]);
    addActivity('update', 'Investigation created', `${newCase.id}: ${newCase.title}`);
    return newCase;
  };

  const uploadFiles = async (stagedFiles, caseId = 'CASE-2026-014', onProgress) => {
    const uploadedRecords = [];

    for (let i = 0; i < stagedFiles.length; i += 1) {
      const file = stagedFiles[i];
      const ext = (file.name.split('.').pop() || 'BIN').toUpperCase();
      const category = detectCategoryFromExtension(ext);

      if (onProgress) {
        onProgress(Math.round(((i + 0.25) / stagedFiles.length) * 100), `Hashing ${file.name}...`);
      }

      const sha256 = (await computeFileSha256(file)) || 'unavailable-in-browser';
      const preview = await readClientPreview(file, ext);

      if (onProgress) {
        onProgress(Math.round(((i + 0.7) / stagedFiles.length) * 100), `Registering ${file.name}...`);
      }

      const localRecord = {
        id: `EV-${Math.floor(200 + Math.random() * 799)}`,
        caseId,
        fileName: file.name,
        fileType: category,
        extension: ext,
        fileSizeBytes: file.size,
        fileSize: formatFileSize(file.size),
        uploadDate: new Date().toISOString(),
        integrityStatus: 'SHA-256 Computed (Client)',
        sha256,
        sourceOrigin: 'Local Browser Upload',
        previewUrl: preview.previewUrl,
        extractedPreview: preview.extractedPreview,
      };

      const formData = new FormData();
      formData.append('file', file);
      formData.append('case_id', caseId);
      formData.append('sha256', sha256);

      const apiRes = await uploadEvidenceApi(formData, localRecord);
      const finalRecord =
        apiRes.source === 'live-api' && apiRes.data?.id ? apiRes.data : localRecord;

      uploadedRecords.push({ record: finalRecord, backendConnected: apiRes.backendConnected });
    }

    if (onProgress) {
      onProgress(100, 'Upload complete');
    }

    const newRecords = uploadedRecords.map((u) => u.record);
    setEvidence((prev) => [...newRecords, ...prev]);

    newRecords.forEach((rec) => {
      setTimelineEvents((prev) => [
        {
          id: `TL-${Date.now()}-${Math.floor(Math.random() * 100)}`,
          caseId: rec.caseId,
          title: `Evidence File Uploaded: ${rec.fileName}`,
          timestamp: rec.uploadDate,
          category: 'File uploads',
          description: `Uploaded ${rec.fileType} (${rec.fileSize}) with client-side SHA-256 hash recorded.`,
          evidenceId: rec.id,
          evidenceFile: rec.fileName,
          extractedSnippet: `SHA-256: ${rec.sha256}`,
        },
        ...prev,
      ]);
      addActivity('upload', 'New evidence uploaded', `${rec.fileName} added to ${rec.caseId}`);
    });

    return uploadedRecords;
  };

  const removeEvidence = async (evidenceId) => {
    const target = evidence.find((e) => e.id === evidenceId);
    await deleteEvidenceApi(evidenceId);
    setEvidence((prev) => prev.filter((item) => item.id !== evidenceId));
    if (target) {
      addActivity('update', 'Evidence removed', `${target.fileName} removed from ${target.caseId}`);
    }
  };

  const runAnalysis = async ({ caseId, evidenceId }) => {
    const evidenceItem = evidence.find((e) => e.id === evidenceId);
    const result = await runAiAnalysisApi({ caseId, evidenceItem });
    setAnalyses((prev) => ({
      ...prev,
      [evidenceId]: result.data,
    }));

    if (evidenceItem) {
      addActivity(
        'analysis',
        'AI analysis completed',
        `Analysis workflow finished for ${evidenceItem.fileName}`
      );
      setTimelineEvents((prev) => [
        {
          id: `TL-AN-${Date.now()}`,
          caseId: caseId || evidenceItem.caseId,
          title: `Analysis Run: ${evidenceItem.fileName}`,
          timestamp: new Date().toISOString(),
          category: 'AI analysis events',
          description: result.backendConnected
            ? 'Server-side AI evidence analysis completed.'
            : 'Demonstration analysis workflow completed (Flask backend offline).',
          evidenceId: evidenceItem.id,
          evidenceFile: evidenceItem.fileName,
          extractedSnippet: result.data.aiSummary?.slice(0, 140) || '',
        },
        ...prev,
      ]);
    }
    return result;
  };

  const createReport = async (caseId) => {
    const investigation =
      investigations.find((c) => c.id === caseId) || investigations[0];
    const caseEvidence = evidence.filter((e) => e.caseId === investigation.id);
    const caseTimeline = timelineEvents.filter((t) => t.caseId === investigation.id);

    const nextNumber = 95 + reports.length;
    const newReport = {
      id: `RPT-2026-0${nextNumber}`,
      caseId: investigation.id,
      investigationName: investigation.title,
      generatedDate: new Date().toISOString().slice(0, 10),
      status: 'Completed',
      evidenceList: caseEvidence.map((item) => ({
        fileName: item.fileName,
        fileType: item.fileType,
        fileSize: item.fileSize,
        uploadDate: item.uploadDate.slice(0, 10),
      })),
      extractedText:
        caseEvidence
          .map((e) => `[${e.fileName}] ${e.extractedPreview || 'No text preview available.'}`)
          .join('\n\n') || 'No evidence artifacts currently attached to this investigation.',
      identifiedEntities: {
        People: ['Aswin (Lead Investigator)', 'Vikram Rao', 'Maya Lin'],
        'Phone Numbers': ['+44-20-7946-0821'],
        'Email Addresses': ['billing-audit@meridian-verify.co'],
        Dates: [new Date().toISOString().slice(0, 10)],
      },
      timelineSummary: caseTimeline.slice(0, 8).map((evt) => ({
        timestamp: evt.timestamp.replace('T', ' ').slice(0, 16) + ' UTC',
        title: evt.title,
        category: evt.category,
        sourceFile: evt.evidenceFile,
      })),
      relationshipAnalysis:
        'Cross-artifact entity mapping generated from currently registered case exhibits and timeline linkages.',
      aiSummary:
        `Compiled demonstration investigation report for ${investigation.title} covering ${caseEvidence.length} evidence item(s) and ${caseTimeline.length} chronological event(s). Review individual artifact hashes and verification notes prior to formal proceedings.`,
      integrityHashes: caseEvidence.map((item) => ({
        fileName: item.fileName,
        sha256: item.sha256,
        verificationNote: item.integrityStatus,
      })),
      limitationsNote:
        'Generated in browser demonstration mode. Real client-side SHA-256 digests are preserved for files uploaded during this session; preloaded demonstration records use sample checksums.',
    };

    const res = await generateReportApi(newReport);
    const created = res.source === 'live-api' && res.data?.id ? res.data : newReport;
    setReports((prev) => [created, ...prev]);
    addActivity('report', 'Report generated', `${created.id} created for ${investigation.id}`);
    return { report: created, backendConnected: res.backendConnected };
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <EvidenceContext.Provider
      value={{
        investigations,
        evidence,
        recentActivity,
        analyses,
        timelineEvents,
        graphData,
        setGraphData,
        reports,
        notifications,
        createInvestigation,
        uploadFiles,
        removeEvidence,
        runAnalysis,
        createReport,
        markAllNotificationsRead,
      }}
    >
      {children}
    </EvidenceContext.Provider>
  );
}

export function useEvidenceContext() {
  const ctx = useContext(EvidenceContext);
  if (!ctx) {
    throw new Error('useEvidenceContext must be used within an EvidenceProvider');
  }
  return ctx;
}
