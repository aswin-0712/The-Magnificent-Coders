import {
  BrainCircuit,
  Calendar,
  FileAudio,
  FileImage,
  FileText,
  HardDrive,
  ShieldCheck,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatDateDisplay } from '../utils/crypto';

export default function EvidenceCard({ item }) {
  const { preferences } = useAuth();
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  if (!item) {
    return (
      <div className="forensic-card p-6 text-center">
        <div className="w-11 h-11 mx-auto rounded-xl bg-[#F5F6FC] text-[#64748B] flex items-center justify-center">
          <FileText className="w-5 h-5" />
        </div>
        <h3 className="mt-3 text-sm font-semibold text-[#172554]">No Evidence Selected</h3>
        <p className="mt-1 text-xs text-[#64748B]">
          Select any row in the uploaded evidence table to inspect metadata, preview content, and view its SHA-256 hash.
        </p>
      </div>
    );
  }

  const isAudio = item.fileType === 'Audio';
  const isImage = item.fileType === 'Image';

  return (
    <div className="forensic-card p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-medium text-[#7656E8]">Selected Artifact · {item.id}</div>
          <h3 className="mt-0.5 text-sm font-semibold text-[#172554] break-all">
            {item.fileName}
          </h3>
        </div>
        <span className="px-2.5 py-1 rounded-lg bg-[#EAF2FF] text-[#367FEA] text-xs font-medium shrink-0">
          {item.extension}
        </span>
      </div>

      {/* Preview Viewport */}
      {isImage && item.previewUrl && !imgError ? (
        <div className="rounded-xl border border-[#E5E7F0] overflow-hidden bg-[#F5F6FC]">
          <img
            src={item.previewUrl}
            alt={`Evidence preview of ${item.fileName}`}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-48 object-cover"
          />
        </div>
      ) : isImage ? (
        <div className="rounded-xl border border-[#E5E7F0] bg-gradient-to-br from-[#F0EBFF] to-[#EAF2FF] h-40 flex flex-col items-center justify-center p-4 text-center">
          <FileImage className="w-8 h-8 text-[#7656E8]" />
          <p className="mt-2 text-xs font-medium text-[#172554]">{item.fileName}</p>
          <p className="text-[11px] text-[#64748B]">Image artifact staged in repository</p>
        </div>
      ) : isAudio && item.previewUrl ? (
        <div className="rounded-xl border border-[#E5E7F0] bg-[#F5F6FC] p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-[#172554]">
            <FileAudio className="w-4 h-4 text-[#22B981]" />
            <span>Browser Audio Playback</span>
          </div>
          <audio controls src={item.previewUrl} className="w-full h-9" />
        </div>
      ) : (
        <div className="rounded-xl border border-[#E5E7F0] bg-[#F5F6FC] p-3.5">
          <div className="text-[11px] font-medium text-[#64748B] mb-1.5">
            Local Preview / Content Excerpt
          </div>
          <p className="text-xs font-mono text-[#172554] leading-relaxed break-words max-h-36 overflow-y-auto">
            {item.extractedPreview || 'Binary document preview unavailable offline.'}
          </p>
        </div>
      )}

      {/* Key Metadata */}
      <dl className="grid grid-cols-2 gap-3 text-xs pt-1 border-t border-[#E5E7F0]">
        <div>
          <dt className="text-[#64748B] flex items-center gap-1">
            <HardDrive className="w-3.5 h-3.5" /> File Size
          </dt>
          <dd className="mt-0.5 font-medium text-[#172554] tabular-nums">{item.fileSize}</dd>
        </div>
        <div>
          <dt className="text-[#64748B] flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> Uploaded
          </dt>
          <dd className="mt-0.5 font-medium text-[#172554] tabular-nums">
            {formatDateDisplay(item.uploadDate, preferences.dateFormat)}
          </dd>
        </div>
        <div className="col-span-2">
          <dt className="text-[#64748B] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#22B981]" /> Integrity Status
          </dt>
          <dd className="mt-0.5 font-medium text-[#172554]">{item.integrityStatus}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-[#64748B]">SHA-256 Digest</dt>
          <dd className="mt-1 p-2 rounded-lg bg-[#F5F6FC] border border-[#E5E7F0] font-mono text-[11px] text-[#172554] break-all">
            {item.sha256}
          </dd>
        </div>
      </dl>

      <button
        type="button"
        onClick={() => navigate('/analysis', { state: { caseId: item.caseId, evidenceId: item.id } })}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#F0EBFF] hover:bg-[#e5dcff] text-[#7656E8] text-xs font-semibold transition-colors"
      >
        <BrainCircuit className="w-4 h-4" />
        <span>Open in AI Analysis</span>
      </button>
    </div>
  );
}
