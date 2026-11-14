import axios from 'axios';
import {
  INITIAL_ANALYSIS_BY_EVIDENCE,
  INITIAL_EVIDENCE,
  INITIAL_GRAPH_DATA,
  INITIAL_REPORTS,
  INITIAL_TIMELINE_EVENTS,
} from '../data/mockData';

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 2500,
  headers: {
    'Accept': 'application/json',
  },
});

/**
 * Helper to attempt a live Flask backend request and gracefully fall back
 * to structured demonstration data while keeping mock vs. live origin explicit.
 */
async function withMockFallback(requestFn, fallbackFn) {
  try {
    const response = await requestFn();
    return {
      data: response.data,
      source: 'live-api',
      backendConnected: true,
    };
  } catch (error) {
    return {
      data: await fallbackFn(error),
      source: 'mock-fallback',
      backendConnected: false,
      fallbackReason: 'Flask backend at http://localhost:5000 unreachable; using demonstration data.',
    };
  }
}

export async function uploadEvidenceApi(formData, localRecord) {
  return withMockFallback(
    () =>
      apiClient.post('/api/evidence/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    () => localRecord
  );
}

export async function retrieveEvidenceApi() {
  return withMockFallback(
    () => apiClient.get('/api/evidence'),
    () => INITIAL_EVIDENCE
  );
}

export async function deleteEvidenceApi(evidenceId) {
  return withMockFallback(
    () => apiClient.delete(`/api/evidence/${evidenceId}`),
    () => ({ deletedId: evidenceId })
  );
}

export async function runAiAnalysisApi({ caseId, evidenceItem }) {
  return withMockFallback(
    () =>
      apiClient.post('/api/analysis/run', {
        case_id: caseId,
        evidence_id: evidenceItem?.id,
      }),
    () => {
      if (evidenceItem && INITIAL_ANALYSIS_BY_EVIDENCE[evidenceItem.id]) {
        return INITIAL_ANALYSIS_BY_EVIDENCE[evidenceItem.id];
      }
      const snippet =
        evidenceItem?.extractedPreview ||
        `Client-side metadata preview for ${evidenceItem?.fileName || 'selected artifact'}.`;
      return {
        evidenceId: evidenceItem?.id || 'CUSTOM',
        caseId: caseId || evidenceItem?.caseId || 'CASE-2026-014',
        modeLabel: 'Demonstration Analysis (Offline Flask Fallback)',
        extractedText: snippet,
        entities: {
          People: ['Aswin (Uploading Investigator)'],
          'Phone Numbers': [],
          'Email Addresses': [],
          Dates: [evidenceItem?.uploadDate?.slice(0, 10) || '2026-11-14'],
          Locations: ['Local Browser Session'],
        },
        keywords: [
          evidenceItem?.extension || 'FILE',
          evidenceItem?.fileType || 'Artifact',
          'SHA-256 Integrity Logged',
          'Pending Server OCR',
        ],
        aiSummary:
          `Demonstration summary for "${evidenceItem?.fileName || 'artifact'}". Client-side SHA-256 integrity was computed (${evidenceItem?.sha256?.slice(0, 16) || 'recorded'}...). Deep OCR, speech-to-text, and server-side NLP entity extraction require connecting the Flask backend at ${API_BASE_URL}.`,
        findings: [
          {
            id: `F-${Date.now()}`,
            severity: 'Observation',
            title: 'Client-Side Integrity Recorded; Server OCR Pending',
            description:
              'File metadata and cryptographic SHA-256 digest are verified locally. Automated OCR / audio transcription has not run because the backend service is offline.',
            reference: `${evidenceItem?.fileName || 'Uploaded File'} (Client File Metadata)`,
          },
        ],
        references: [
          {
            fileName: evidenceItem?.fileName || 'Uploaded File',
            location: 'Browser File Intake Metadata',
            excerpt: snippet.slice(0, 180),
          },
        ],
        verificationDisclaimer:
          'Honest Status Notice: No server-side OCR, speech recognition, or remote AI inference occurred because http://localhost:5000 is offline. Only locally readable text previews and real browser SHA-256 hashes are shown.',
      };
    }
  );
}

export async function retrieveAnalysisResultsApi(evidenceId) {
  return withMockFallback(
    () => apiClient.get(`/api/analysis/${evidenceId}`),
    () => INITIAL_ANALYSIS_BY_EVIDENCE[evidenceId] || null
  );
}

export async function retrieveTimelineApi(caseId) {
  return withMockFallback(
    () => apiClient.get('/api/timeline', { params: { case_id: caseId } }),
    () =>
      caseId && caseId !== 'ALL'
        ? INITIAL_TIMELINE_EVENTS.filter((e) => e.caseId === caseId)
        : INITIAL_TIMELINE_EVENTS
  );
}

export async function retrieveRelationshipGraphApi(caseId) {
  return withMockFallback(
    () => apiClient.get('/api/graph', { params: { case_id: caseId } }),
    () => INITIAL_GRAPH_DATA
  );
}

export async function generateReportApi(payload) {
  return withMockFallback(
    () => apiClient.post('/api/reports/generate', payload),
    () => payload
  );
}

export async function downloadReportApi(reportId) {
  return withMockFallback(
    () => apiClient.get(`/api/reports/${reportId}/download`, { responseType: 'blob' }),
    () => INITIAL_REPORTS.find((r) => r.id === reportId) || null
  );
}
