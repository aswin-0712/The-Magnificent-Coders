import badgeTerminalImg from '../assets/images/evidence_badge_terminal_1794651301469.jpg';
import wireReceiptImg from '../assets/images/evidence_wire_receipt_1794651299951.jpg';

export const INITIAL_INVESTIGATIONS = [
  {
    id: 'CASE-2026-014',
    title: 'Operation Ledger — Unauthorized Vendor Wire & Data Export',
    leadInvestigator: 'Aswin',
    status: 'Active Review',
    createdAt: '2026-11-08T09:15:00Z',
    description:
      'Internal audit and digital forensics review into an unauthorized $15,000 wire confirmation and off-hours server room keycard access.',
  },
  {
    id: 'CASE-2026-019',
    title: 'Meridian Credential Phishing & Chat Escalation',
    leadInvestigator: 'Aswin',
    status: 'Evidence Collection',
    createdAt: '2026-11-11T14:20:00Z',
    description:
      'Investigation of spoofed finance domain emails, exported support chat transcripts, and anomalous VoIP call recordings.',
  },
  {
    id: 'CASE-2026-022',
    title: 'Apex Procurement Invoice Tampering Audit',
    leadInvestigator: 'Aswin',
    status: 'Completed',
    createdAt: '2026-11-03T11:00:00Z',
    description:
      'Verification of altered PDF vendor statements and cross-referencing email headers with internal accounting records.',
  },
];

export const INITIAL_EVIDENCE = [
  {
    id: 'EV-101',
    caseId: 'CASE-2026-014',
    fileName: 'wire_confirmation_AGBC98745612.jpg',
    fileType: 'Image',
    extension: 'JPG',
    fileSizeBytes: 1843200,
    fileSize: '1.8 MB',
    uploadDate: '2026-11-10T10:14:00Z',
    integrityStatus: 'Demo Sample Checksum',
    sha256: '8f4e2a91c0d47b881a52f39d01e84b76c2a1903d4f6a12e89c45b7d011e92a3c',
    sourceOrigin: 'Demonstration Dataset',
    previewUrl: wireReceiptImg,
    extractedPreview:
      'AURORA GLOBAL BANK - WIRE TRANSFER CONFIRMATION | Transaction ID: AGBC98745612 | Amount: 15,000.00 USD | Recipient: ACME CORP INTERNATIONAL | IBAN: DE44 5001 0517 0123 4567 89 | Invoice #3345',
  },
  {
    id: 'EV-102',
    caseId: 'CASE-2026-014',
    fileName: 'server_room_rfid_exhibit_a4.jpg',
    fileType: 'Image',
    extension: 'JPG',
    fileSizeBytes: 2411724,
    fileSize: '2.3 MB',
    uploadDate: '2026-11-10T11:02:00Z',
    integrityStatus: 'Demo Sample Checksum',
    sha256: '3c19d7b04e882a51b09f34c887d1a2e45f9b8c7d0123e4a5b6c7d8e9f0123456',
    sourceOrigin: 'Demonstration Dataset',
    previewUrl: badgeTerminalImg,
    extractedPreview:
      'Physical Access Exhibit A-4: HID RFID keypad adjacent to Vault/Server Corridor 2B. Badge tap recorded at 22:41 UTC on 2026-11-09.',
  },
  {
    id: 'EV-103',
    caseId: 'CASE-2026-014',
    fileName: 'finance_slack_export_nov09.json',
    fileType: 'Chat Export',
    extension: 'JSON',
    fileSizeBytes: 428032,
    fileSize: '418 KB',
    uploadDate: '2026-11-10T13:45:00Z',
    integrityStatus: 'Demo Sample Checksum',
    sha256: 'a94d2f0e1c7b8831094e56d2a3f7c8b90123d4e5f6a7b8c9d0e1f2a3b4c5d6e7',
    sourceOrigin: 'Demonstration Dataset',
    previewUrl: null,
    extractedPreview:
      '[{"ts":"2026-11-09T21:18:00Z","sender":"Vikram Rao","channel":"#vendor-payouts","text":"Urgent: please fast-track Invoice #3345 for ACME Corp International before midnight cutoff."},{"ts":"2026-11-09T21:24:00Z","sender":"Maya Lin","channel":"#vendor-payouts","text":"IBAN DE44500105170123456789 does not match our approved vendor master sheet. Who authorized the override?"}]',
  },
  {
    id: 'EV-104',
    caseId: 'CASE-2026-014',
    fileName: 'voicemail_ext4402_nov09.wav',
    fileType: 'Audio',
    extension: 'WAV',
    fileSizeBytes: 5138022,
    fileSize: '4.9 MB',
    uploadDate: '2026-11-11T08:30:00Z',
    integrityStatus: 'Demo Sample Checksum',
    sha256: '5b8e1f4c7d2a9034e6f1a2b3c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f7',
    sourceOrigin: 'Demonstration Dataset',
    previewUrl: null,
    extractedPreview:
      '[Demo Transcript Placeholder] Caller (+44-20-7946-0821): "Hi, this is Daniel Vance from Aurora Global compliance desk. Confirming callback on transfer AGBC98745612 before 10:30 PM."',
  },
  {
    id: 'EV-105',
    caseId: 'CASE-2026-019',
    fileName: 'suspicious_headers_meridian.txt',
    fileType: 'Document',
    extension: 'TXT',
    fileSizeBytes: 94208,
    fileSize: '92 KB',
    uploadDate: '2026-11-12T09:05:00Z',
    integrityStatus: 'Demo Sample Checksum',
    sha256: '7e2c4a8b1d9f0356a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0',
    sourceOrigin: 'Demonstration Dataset',
    previewUrl: null,
    extractedPreview:
      'From: billing-audit@meridian-verify.co | Reply-To: support@external-relay.net | Subject: Immediate Wire Verification Required | Received-SPF: fail (sender IP 185.220.101.44)',
  },
  {
    id: 'EV-106',
    caseId: 'CASE-2026-022',
    fileName: 'vendor_audit_ledger_q4.pdf',
    fileType: 'Document',
    extension: 'PDF',
    fileSizeBytes: 3250585,
    fileSize: '3.1 MB',
    uploadDate: '2026-11-05T16:40:00Z',
    integrityStatus: 'Demo Sample Checksum',
    sha256: 'd12e8f4a6b9c013579bdf02468ace13579bdf02468ace13579bdf02468ace135',
    sourceOrigin: 'Demonstration Dataset',
    previewUrl: null,
    extractedPreview:
      'Q4 Vendor Reconciliation Ledger — Invoice #3345 flagged for duplicate IBAN routing adjustment on 2026-11-04 by user ID USR-882.',
  },
];

export const DASHBOARD_SERIES = {
  '7d': [
    { day: 'Nov 08', evidenceProcessed: 24, insightsGenerated: 15 },
    { day: 'Nov 09', evidenceProcessed: 38, insightsGenerated: 29 },
    { day: 'Nov 10', evidenceProcessed: 52, insightsGenerated: 41 },
    { day: 'Nov 11', evidenceProcessed: 45, insightsGenerated: 36 },
    { day: 'Nov 12', evidenceProcessed: 64, insightsGenerated: 53 },
    { day: 'Nov 13', evidenceProcessed: 58, insightsGenerated: 47 },
    { day: 'Nov 14', evidenceProcessed: 71, insightsGenerated: 62 },
  ],
  '30d': [
    { day: 'Wk 1', evidenceProcessed: 112, insightsGenerated: 84 },
    { day: 'Wk 2', evidenceProcessed: 148, insightsGenerated: 118 },
    { day: 'Wk 3', evidenceProcessed: 186, insightsGenerated: 152 },
    { day: 'Wk 4', evidenceProcessed: 248, insightsGenerated: 209 },
  ],
};

export const EVIDENCE_TYPE_DISTRIBUTION = [
  { name: 'Images', value: 40, color: '#7656E8' },
  { name: 'Documents', value: 30, color: '#367FEA' },
  { name: 'Audio', value: 20, color: '#22B981' },
  { name: 'Others', value: 10, color: '#F59E0B' },
];

export const INITIAL_RECENT_ACTIVITY = [
  {
    id: 'ACT-1',
    type: 'upload',
    title: 'New evidence uploaded',
    detail: 'suspicious_headers_meridian.txt added to CASE-2026-019',
    timestamp: '2026-11-14 01:40',
  },
  {
    id: 'ACT-2',
    type: 'analysis',
    title: 'AI analysis completed',
    detail: 'Entity & keyword extraction reviewed for wire_confirmation_AGBC98745612.jpg',
    timestamp: '2026-11-13 19:22',
  },
  {
    id: 'ACT-3',
    type: 'report',
    title: 'Report generated',
    detail: 'RPT-2026-089 compiled for Apex Procurement Audit',
    timestamp: '2026-11-13 15:10',
  },
  {
    id: 'ACT-4',
    type: 'update',
    title: 'Investigation updated',
    detail: 'CASE-2026-014 linked 3 new timeline observations',
    timestamp: '2026-11-12 11:05',
  },
];

export const INITIAL_ANALYSIS_BY_EVIDENCE = {
  'EV-101': {
    evidenceId: 'EV-101',
    caseId: 'CASE-2026-014',
    modeLabel: 'Demonstration Dataset (Offline Flask Fallback)',
    extractedText:
      'AURORA GLOBAL BANK - WIRE TRANSFER CONFIRMATION. Transaction ID: AGBC98745612. Date: 12 OCT 2023. Sending Account: GB29 AURG 6012 3456 7890 12. Amount: 15,000.00 USD. Recipient Name: ACME CORP INTERNATIONAL. Recipient IBAN: DE44 5001 0517 0123 4567 89. Description: Payment for Invoice #3345. Processed stamp: AGB - PROCESSED.',
    entities: {
      People: ['Vikram Rao (Referenced Sender)', 'Maya Lin (Reviewer)'],
      'Phone Numbers': ['+44-20-7946-0821'],
      'Email Addresses': ['payouts@acmecorp-intl.example', 'audit@auroraglobal.example'],
      Dates: ['12 OCT 2023', '2026-11-09 21:18 UTC'],
      Locations: ['London, UK (GB29 IBAN)', 'Frankfurt, DE (DE44 IBAN)'],
    },
    keywords: [
      'AGBC98745612',
      '15,000.00 USD',
      'ACME CORP INTERNATIONAL',
      'Invoice #3345',
      'DE44 5001 0517 0123 4567 89',
      'Aurora Global Bank',
    ],
    aiSummary:
      'This demonstration record represents a scanned wire transfer confirmation totaling 15,000.00 USD referencing Invoice #3345 to ACME CORP INTERNATIONAL. Cross-referencing with the #vendor-payouts chat export suggests the destination DE44 IBAN differs from the baseline vendor master sheet and warrants manual banking verification.',
    findings: [
      {
        id: 'F-1',
        severity: 'Warning',
        title: 'Recipient IBAN Mismatch Against Vendor Master Reference',
        description:
          'Extracted IBAN DE44 5001 0517 0123 4567 89 appears flagged in the Nov 09 chat log as unverified prior to payout cutoff.',
        reference: 'wire_confirmation_AGBC98745612.jpg (Recipient Information Block) & finance_slack_export_nov09.json (Line 2)',
      },
      {
        id: 'F-2',
        severity: 'Observation',
        title: 'Date Discrepancy Between Stamp and Incident Window',
        description:
          'Document stamp reads 12 OCT 2023 while internal chat escalation occurred on 09 NOV 2026, indicating either an archived template or backdated exhibit.',
        reference: 'wire_confirmation_AGBC98745612.jpg (Transaction Details / Processed Stamp)',
      },
    ],
    references: [
      {
        fileName: 'wire_confirmation_AGBC98745612.jpg',
        location: 'Header & Recipient Information Table',
        excerpt: 'Recipient IBAN: DE44 5001 0517 0123 4567 89 — Amount: 15,000.00 USD',
      },
      {
        fileName: 'finance_slack_export_nov09.json',
        location: 'Message #2 (21:24 UTC)',
        excerpt: 'IBAN DE44500105170123456789 does not match our approved vendor master sheet.',
      },
    ],
    verificationDisclaimer:
      'Demonstration Notice: Because the live Flask AI/OCR backend (http://localhost:5000) is not connected, these insights reflect pre-authored demonstration output. AI-generated summaries and pattern observations are investigative leads only and must be independently verified against original artifacts.',
  },
  'EV-103': {
    evidenceId: 'EV-103',
    caseId: 'CASE-2026-014',
    modeLabel: 'Demonstration Dataset (Offline Flask Fallback)',
    extractedText:
      '[21:18 UTC] Vikram Rao (#vendor-payouts): Urgent: please fast-track Invoice #3345 for ACME Corp International before midnight cutoff. [21:24 UTC] Maya Lin (#vendor-payouts): IBAN DE44500105170123456789 does not match our approved vendor master sheet. Who authorized the override?',
    entities: {
      People: ['Vikram Rao', 'Maya Lin'],
      'Phone Numbers': ['+1-415-555-0194'],
      'Email Addresses': ['v.rao@internal-corp.example', 'm.lin@internal-corp.example'],
      Dates: ['2026-11-09 21:18 UTC', '2026-11-09 21:24 UTC'],
      Locations: ['Channel #vendor-payouts'],
    },
    keywords: ['fast-track', 'Invoice #3345', 'midnight cutoff', 'IBAN override', 'ACME Corp International'],
    aiSummary:
      'Extracted chat messages indicate time-pressured escalation requesting immediate processing of Invoice #3345, followed within six minutes by an internal compliance objection regarding an unrecognized IBAN.',
    findings: [
      {
        id: 'F-3',
        severity: 'Warning',
        title: 'Urgency Framing Before Cutoff Window',
        description:
          'Message timestamped 21:18 UTC requests expedited approval ahead of midnight cutoff despite incomplete vendor bank verification.',
        reference: 'finance_slack_export_nov09.json (Entry 1, 21:18 UTC)',
      },
    ],
    references: [
      {
        fileName: 'finance_slack_export_nov09.json',
        location: 'JSON Array Index 0–1',
        excerpt: 'Urgent: please fast-track Invoice #3345 ... Who authorized the override?',
      },
    ],
    verificationDisclaimer:
      'Demonstration Notice: Live Flask backend is offline. Extracted chat text is formatted from demonstration JSON records; AI observations do not establish intent or wrongdoing.',
  },
};

export const INITIAL_TIMELINE_EVENTS = [
  {
    id: 'TL-01',
    caseId: 'CASE-2026-014',
    title: 'Spoofed Invoice Verification Email Received',
    timestamp: '2026-11-09T18:42:00Z',
    category: 'Emails',
    description:
      'External message claiming to originate from Aurora Global compliance requested updated wire routing for Invoice #3345.',
    evidenceId: 'EV-105',
    evidenceFile: 'suspicious_headers_meridian.txt',
    extractedSnippet: 'Reply-To: support@external-relay.net | Received-SPF: fail (185.220.101.44)',
  },
  {
    id: 'TL-02',
    caseId: 'CASE-2026-014',
    title: 'Urgent Payout Escalation in #vendor-payouts',
    timestamp: '2026-11-09T21:18:00Z',
    category: 'Messages',
    description:
      'Vikram Rao requested expedited processing for ACME Corp International Invoice #3345 before the midnight banking cutoff.',
    evidenceId: 'EV-103',
    evidenceFile: 'finance_slack_export_nov09.json',
    extractedSnippet: 'Urgent: please fast-track Invoice #3345 for ACME Corp International before midnight cutoff.',
  },
  {
    id: 'TL-03',
    caseId: 'CASE-2026-014',
    title: 'Compliance Analyst Flagged Unmatched IBAN',
    timestamp: '2026-11-09T21:24:00Z',
    category: 'Important observations',
    description:
      'Maya Lin noted that destination IBAN DE44500105170123456789 did not match the approved vendor master table.',
    evidenceId: 'EV-103',
    evidenceFile: 'finance_slack_export_nov09.json',
    extractedSnippet: 'IBAN DE44500105170123456789 does not match our approved vendor master sheet.',
  },
  {
    id: 'TL-04',
    caseId: 'CASE-2026-014',
    title: 'Inbound VoIP Call Logged on Extension 4402',
    timestamp: '2026-11-09T22:05:00Z',
    category: 'Calls',
    description:
      'Unverified caller identifying as Daniel Vance left a callback message referencing transaction AGBC98745612.',
    evidenceId: 'EV-104',
    evidenceFile: 'voicemail_ext4402_nov09.wav',
    extractedSnippet: 'Caller +44-20-7946-0821 referenced AGBC98745612 prior to 22:30 UTC.',
  },
  {
    id: 'TL-05',
    caseId: 'CASE-2026-014',
    title: 'After-Hours Server Corridor Badge Access',
    timestamp: '2026-11-09T22:41:00Z',
    category: 'Important observations',
    description:
      'HID access reader at Server Corridor 2B logged a physical keycard tap outside normal finance operating hours.',
    evidenceId: 'EV-102',
    evidenceFile: 'server_room_rfid_exhibit_a4.jpg',
    extractedSnippet: 'Exhibit A-4: Corridor 2B RFID terminal triggered at 22:41 UTC.',
  },
  {
    id: 'TL-06',
    caseId: 'CASE-2026-014',
    title: 'Forensic Evidence Package Uploaded',
    timestamp: '2026-11-10T10:14:00Z',
    category: 'File uploads',
    description:
      'Investigator Aswin ingested wire confirmation scan and RFID terminal exhibit into EVIDENCE AI.',
    evidenceId: 'EV-101',
    evidenceFile: 'wire_confirmation_AGBC98745612.jpg',
    extractedSnippet: 'Ingested into CASE-2026-014 with SHA-256 reference checksum logged.',
  },
  {
    id: 'TL-07',
    caseId: 'CASE-2026-014',
    title: 'Entity & Pattern Correlation Completed',
    timestamp: '2026-11-11T09:30:00Z',
    category: 'AI analysis events',
    description:
      'Demonstration analysis pipeline cross-referenced Invoice #3345 across image exhibit and chat logs.',
    evidenceId: 'EV-101',
    evidenceFile: 'wire_confirmation_AGBC98745612.jpg',
    extractedSnippet: 'Flagged 2 verification leads for human review (IBAN mismatch & stamp variance).',
  },
  {
    id: 'TL-08',
    caseId: 'CASE-2026-019',
    title: 'Phishing Header Artifact Archived',
    timestamp: '2026-11-12T09:05:00Z',
    category: 'Emails',
    description:
      'Raw SMTP headers exported from corporate gateway showing SPF failure from external relay IP.',
    evidenceId: 'EV-105',
    evidenceFile: 'suspicious_headers_meridian.txt',
    extractedSnippet: 'Received-SPF: fail (sender IP 185.220.101.44)',
  },
];

export const INITIAL_GRAPH_DATA = {
  nodes: [
    {
      id: 'n-vikram',
      type: 'forensicNode',
      position: { x: 80, y: 120 },
      data: {
        label: 'Vikram Rao',
        nodeType: 'Person',
        relatedEvidence: ['finance_slack_export_nov09.json'],
        description:
          'Internal finance coordinator referenced in #vendor-payouts requesting expedited processing of Invoice #3345.',
      },
    },
    {
      id: 'n-maya',
      type: 'forensicNode',
      position: { x: 80, y: 340 },
      data: {
        label: 'Maya Lin',
        nodeType: 'Person',
        relatedEvidence: ['finance_slack_export_nov09.json'],
        description:
          'Compliance reviewer who documented the IBAN discrepancy against the approved vendor master sheet.',
      },
    },
    {
      id: 'n-msg',
      type: 'forensicNode',
      position: { x: 320, y: 210 },
      data: {
        label: 'Slack Export Nov 09',
        nodeType: 'Message',
        relatedEvidence: ['finance_slack_export_nov09.json'],
        description:
          'Exported #vendor-payouts thread containing two messages exchanged at 21:18 and 21:24 UTC.',
      },
    },
    {
      id: 'n-wire',
      type: 'forensicNode',
      position: { x: 580, y: 110 },
      data: {
        label: 'Wire Confirmation Scan',
        nodeType: 'Image',
        relatedEvidence: ['wire_confirmation_AGBC98745612.jpg'],
        description:
          'Scanned wire receipt displaying Transaction ID AGBC98745612 for 15,000.00 USD to ACME Corp International.',
      },
    },
    {
      id: 'n-email',
      type: 'forensicNode',
      position: { x: 580, y: 340 },
      data: {
        label: 'billing-audit@meridian-verify.co',
        nodeType: 'Email',
        relatedEvidence: ['suspicious_headers_meridian.txt'],
        description:
          'External sender address exhibiting SPF verification failure and external relay routing.',
      },
    },
    {
      id: 'n-phone',
      type: 'forensicNode',
      position: { x: 840, y: 120 },
      data: {
        label: '+44-20-7946-0821',
        nodeType: 'Phone Number',
        relatedEvidence: ['voicemail_ext4402_nov09.wav'],
        description:
          'Inbound VoIP number logged on Extension 4402 referencing Transaction ID AGBC98745612.',
      },
    },
    {
      id: 'n-ledger',
      type: 'forensicNode',
      position: { x: 840, y: 330 },
      data: {
        label: 'Vendor Audit Ledger Q4',
        nodeType: 'Document',
        relatedEvidence: ['vendor_audit_ledger_q4.pdf'],
        description:
          'Quarterly reconciliation PDF containing historical approved IBAN records for Invoice #3345.',
      },
    },
    {
      id: 'n-event',
      type: 'forensicNode',
      position: { x: 1080, y: 220 },
      data: {
        label: 'Corridor 2B Access (22:41)',
        nodeType: 'Event',
        relatedEvidence: ['server_room_rfid_exhibit_a4.jpg'],
        description:
          'Physical badge tap documented at Server Corridor 2B; temporal correlation only, identity unconfirmed.',
      },
    },
  ],
  edges: [
    { id: 'e1', source: 'n-vikram', target: 'n-msg', label: 'sent message' },
    { id: 'e2', source: 'n-maya', target: 'n-msg', label: 'replied in thread' },
    { id: 'e3', source: 'n-msg', target: 'n-wire', label: 'references #3345' },
    { id: 'e4', source: 'n-msg', target: 'n-ledger', label: 'master sheet check' },
    { id: 'e5', source: 'n-email', target: 'n-wire', label: 'requested routing' },
    { id: 'e6', source: 'n-phone', target: 'n-wire', label: 'cited AGBC98745612' },
    { id: 'e7', source: 'n-wire', target: 'n-event', label: 'same-night window' },
    { id: 'e8', source: 'n-ledger', target: 'n-event', label: 'audit scope' },
  ],
};

export const INITIAL_REPORTS = [
  {
    id: 'RPT-2026-091',
    caseId: 'CASE-2026-014',
    investigationName: 'Operation Ledger — Unauthorized Vendor Wire & Data Export',
    generatedDate: '2026-11-13',
    status: 'Completed',
    evidenceList: [
      {
        fileName: 'wire_confirmation_AGBC98745612.jpg',
        fileType: 'Image',
        fileSize: '1.8 MB',
        uploadDate: '2026-11-10',
      },
      {
        fileName: 'finance_slack_export_nov09.json',
        fileType: 'Chat Export',
        fileSize: '418 KB',
        uploadDate: '2026-11-10',
      },
      {
        fileName: 'server_room_rfid_exhibit_a4.jpg',
        fileType: 'Image',
        fileSize: '2.3 MB',
        uploadDate: '2026-11-10',
      },
      {
        fileName: 'voicemail_ext4402_nov09.wav',
        fileType: 'Audio',
        fileSize: '4.9 MB',
        uploadDate: '2026-11-11',
      },
    ],
    extractedText:
      'Wire Transfer Confirmation AGBC98745612 (15,000.00 USD) payable to ACME CORP INTERNATIONAL, IBAN DE44 5001 0517 0123 4567 89 for Invoice #3345. Slack #vendor-payouts thread reflects a 21:18 UTC fast-track request followed by a 21:24 UTC IBAN mismatch objection.',
    identifiedEntities: {
      People: ['Vikram Rao', 'Maya Lin', 'Daniel Vance (Unverified Caller)'],
      'Phone Numbers': ['+44-20-7946-0821'],
      'Email Addresses': ['billing-audit@meridian-verify.co', 'support@external-relay.net'],
      Dates: ['12 OCT 2023 (Document Stamp)', '2026-11-09 21:18–22:41 UTC'],
    },
    timelineSummary: [
      {
        timestamp: '2026-11-09 18:42 UTC',
        title: 'Spoofed Invoice Verification Email Received',
        category: 'Emails',
        sourceFile: 'suspicious_headers_meridian.txt',
      },
      {
        timestamp: '2026-11-09 21:18 UTC',
        title: 'Urgent Payout Escalation in #vendor-payouts',
        category: 'Messages',
        sourceFile: 'finance_slack_export_nov09.json',
      },
      {
        timestamp: '2026-11-09 21:24 UTC',
        title: 'Compliance Analyst Flagged Unmatched IBAN',
        category: 'Important observations',
        sourceFile: 'finance_slack_export_nov09.json',
      },
      {
        timestamp: '2026-11-09 22:41 UTC',
        title: 'After-Hours Server Corridor Badge Access',
        category: 'Important observations',
        sourceFile: 'server_room_rfid_exhibit_a4.jpg',
      },
    ],
    relationshipAnalysis:
      'Graph correlation links Transaction ID AGBC98745612 across the scanned wire confirmation, the #vendor-payouts Slack export, and the inbound VoIP call from +44-20-7946-0821. Temporal proximity to the 22:41 UTC Server Corridor 2B badge tap is noted for audit follow-up and does not establish attribution.',
    aiSummary:
      'Demonstration synthesis indicates Invoice #3345 was targeted by an IBAN discrepancy concurrent with an SPF-failing external verification email. Recommended next steps include confirming the vendor master sheet with Aurora Global Bank and reviewing physical CCTV alongside the Corridor 2B badge log.',
    integrityHashes: [
      {
        fileName: 'wire_confirmation_AGBC98745612.jpg',
        sha256: '8f4e2a91c0d47b881a52f39d01e84b76c2a1903d4f6a12e89c45b7d011e92a3c',
        verificationNote: 'Demo Sample Checksum',
      },
      {
        fileName: 'finance_slack_export_nov09.json',
        sha256: 'a94d2f0e1c7b8831094e56d2a3f7c8b90123d4e5f6a7b8c9d0e1f2a3b4c5d6e7',
        verificationNote: 'Demo Sample Checksum',
      },
      {
        fileName: 'server_room_rfid_exhibit_a4.jpg',
        sha256: '3c19d7b04e882a51b09f34c887d1a2e45f9b8c7d0123e4a5b6c7d8e9f0123456',
        verificationNote: 'Demo Sample Checksum',
      },
    ],
    limitationsNote:
      'This report was assembled in Demonstration Mode without an active Flask OCR/AI backend. Any real files uploaded during this browser session include genuine client-side SHA-256 hashes; preloaded exhibits use demonstration checksums. AI summaries represent investigative hypotheses requiring independent human verification.',
  },
  {
    id: 'RPT-2026-089',
    caseId: 'CASE-2026-022',
    investigationName: 'Apex Procurement Invoice Tampering Audit',
    generatedDate: '2026-11-06',
    status: 'Completed',
    evidenceList: [
      {
        fileName: 'vendor_audit_ledger_q4.pdf',
        fileType: 'Document',
        fileSize: '3.1 MB',
        uploadDate: '2026-11-05',
      },
    ],
    extractedText:
      'Q4 Vendor Reconciliation Ledger — Invoice #3345 flagged for duplicate IBAN routing adjustment on 2026-11-04 by user ID USR-882.',
    identifiedEntities: {
      People: ['Internal Account USR-882'],
      'Phone Numbers': [],
      'Email Addresses': ['ap-audit@apex-procurement.example'],
      Dates: ['2026-11-04', '2026-11-05'],
    },
    timelineSummary: [
      {
        timestamp: '2026-11-04 14:15 UTC',
        title: 'Ledger Routing Adjustment Recorded',
        category: 'Important observations',
        sourceFile: 'vendor_audit_ledger_q4.pdf',
      },
    ],
    relationshipAnalysis:
      'Single-document audit linking USR-882 ledger modification to Invoice #3345 baseline vendor profile.',
    aiSummary:
      'Historical audit confirms Invoice #3345 underwent an account routing modification on Nov 04, providing baseline context for subsequent Nov 09 alerts.',
    integrityHashes: [
      {
        fileName: 'vendor_audit_ledger_q4.pdf',
        sha256: 'd12e8f4a6b9c013579bdf02468ace13579bdf02468ace13579bdf02468ace135',
        verificationNote: 'Demo Sample Checksum',
      },
    ],
    limitationsNote:
      'Demonstration report generated from local sample dataset. Verify raw PDF metadata signatures in production.',
  },
  {
    id: 'RPT-2026-094',
    caseId: 'CASE-2026-019',
    investigationName: 'Meridian Credential Phishing & Chat Escalation',
    generatedDate: '2026-11-12',
    status: 'Pending',
    evidenceList: [
      {
        fileName: 'suspicious_headers_meridian.txt',
        fileType: 'Document',
        fileSize: '92 KB',
        uploadDate: '2026-11-12',
      },
    ],
    extractedText:
      'From: billing-audit@meridian-verify.co | Reply-To: support@external-relay.net | Received-SPF: fail (sender IP 185.220.101.44).',
    identifiedEntities: {
      People: [],
      'Phone Numbers': [],
      'Email Addresses': ['billing-audit@meridian-verify.co', 'support@external-relay.net'],
      Dates: ['2026-11-12'],
    },
    timelineSummary: [
      {
        timestamp: '2026-11-12 09:05 UTC',
        title: 'Phishing Header Artifact Archived',
        category: 'Emails',
        sourceFile: 'suspicious_headers_meridian.txt',
      },
    ],
    relationshipAnalysis:
      'Pending further gateway log ingestion to correlate external relay IP 185.220.101.44.',
    aiSummary:
      'Preliminary header inspection shows SPF failure and mismatched Reply-To domain; pending full mail server log intake.',
    integrityHashes: [
      {
        fileName: 'suspicious_headers_meridian.txt',
        sha256: '7e2c4a8b1d9f0356a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0',
        verificationNote: 'Demo Sample Checksum',
      },
    ],
    limitationsNote:
      'Report status is Pending while additional email artifacts are collected. Demonstration dataset only.',
  },
];
