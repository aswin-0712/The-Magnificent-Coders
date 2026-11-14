import { CheckCircle2, File, FileAudio, FileImage, FileText, Trash2, UploadCloud } from 'lucide-react';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { formatFileSize } from '../utils/crypto';

const ACCEPTED_EXTENSIONS = ['PNG', 'JPG', 'JPEG', 'PDF', 'DOCX', 'TXT', 'MP3', 'WAV', 'CSV', 'JSON'];
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

function getFileIcon(ext) {
  const upper = ext.toUpperCase();
  if (['PNG', 'JPG', 'JPEG'].includes(upper)) return FileImage;
  if (['MP3', 'WAV'].includes(upper)) return FileAudio;
  if (['PDF', 'DOCX', 'TXT', 'CSV', 'JSON'].includes(upper)) return FileText;
  return File;
}

export default function FileUpload({ investigations = [], selectedCaseId, onSelectCaseId, onUploadComplete }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [stagedFiles, setStagedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState('');

  const validateAndStage = (fileList) => {
    const incoming = Array.from(fileList || []);
    if (incoming.length === 0) return;

    const valid = [];
    const rejected = [];

    incoming.forEach((file) => {
      const ext = (file.name.split('.').pop() || '').toUpperCase();
      if (!ACCEPTED_EXTENSIONS.includes(ext)) {
        rejected.push(`${file.name} (unsupported .${ext || 'unknown'} format)`);
        return;
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        rejected.push(`${file.name} (exceeds 50 MB limit)`);
        return;
      }
      const duplicate = stagedFiles.some(
        (existing) => existing.name === file.name && existing.size === file.size
      );
      if (!duplicate) {
        valid.push(file);
      }
    });

    if (rejected.length > 0) {
      toast.error(`Skipped: ${rejected.join(', ')}`);
    }
    if (valid.length > 0) {
      setStagedFiles((prev) => [...prev, ...valid]);
      toast.success(`Staged ${valid.length} file${valid.length > 1 ? 's' : ''} for hashing & upload`);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    validateAndStage(e.dataTransfer?.files);
  };

  const handleRemoveStaged = (index) => {
    setStagedFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleStartUpload = async () => {
    if (stagedFiles.length === 0 || uploading) return;
    setUploading(true);
    setProgress(8);
    setProgressLabel('Computing client-side SHA-256 digests...');

    try {
      const results = await onUploadComplete(stagedFiles, selectedCaseId, (pct, label) => {
        setProgress(pct);
        setProgressLabel(label);
      });

      const backendConnected = results.some((r) => r.backendConnected);
      toast.success(
        backendConnected
          ? `Uploaded ${results.length} evidence file(s) to server.`
          : `Recorded ${results.length} file(s) locally with real SHA-256 hashes (Flask offline fallback).`
      );
      setStagedFiles([]);
    } catch (err) {
      toast.error('Failed to process selected files. Please retry.');
    } finally {
      setTimeout(() => {
        setUploading(false);
        setProgress(0);
        setProgressLabel('');
      }, 350);
    }
  };

  return (
    <div className="forensic-card p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="text-base font-semibold text-[#172554]">Upload Digital Artifacts</h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Client-side SHA-256 integrity hashing runs automatically upon intake.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <label htmlFor="upload-case-select" className="text-xs font-medium text-[#64748B] whitespace-nowrap">
            Target Case:
          </label>
          <select
            id="upload-case-select"
            value={selectedCaseId}
            onChange={(e) => onSelectCaseId(e.target.value)}
            className="h-9 px-3 text-xs font-medium bg-[#F5F6FC] border border-[#E5E7F0] rounded-xl text-[#172554] focus:outline-none focus:border-[#7656E8]"
          >
            {investigations.map((c) => (
              <option key={c.id} value={c.id}>
                {c.id} — {c.title.slice(0, 34)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
        onDrop={handleDrop}
        className={`rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
          isDragging
            ? 'border-[#7656E8] bg-[#F0EBFF]/50'
            : 'border-[#D5D9EA] bg-[#F5F6FC]/70 hover:border-[#7656E8]/60'
        }`}
      >
        <div className="w-14 h-14 mx-auto rounded-2xl bg-[#F0EBFF] text-[#7656E8] flex items-center justify-center">
          <UploadCloud className="w-7 h-7" aria-hidden="true" />
        </div>

        <h3 className="mt-4 text-base font-semibold text-[#172554]">
          Drag and drop your evidence files here
        </h3>
        <p className="mt-1 text-sm text-[#64748B]">
          Select screenshots, documents, audio recordings, or chat exports
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7656E8] to-[#367FEA] text-white text-sm font-medium shadow-sm hover:opacity-95 transition-opacity whitespace-nowrap"
          >
            Browse Files
          </button>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept=".png,.jpg,.jpeg,.pdf,.docx,.txt,.mp3,.wav,.csv,.json"
            onChange={(e) => {
              validateAndStage(e.target.files);
              e.target.value = '';
            }}
            className="hidden"
          />
        </div>

        <div className="mt-5 pt-4 border-t border-[#E5E7F0] flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-[#64748B]">
          <span>Images: PNG, JPG, JPEG</span>
          <span aria-hidden="true">·</span>
          <span>Docs: PDF, DOCX, TXT</span>
          <span aria-hidden="true">·</span>
          <span>Audio: MP3, WAV</span>
          <span aria-hidden="true">·</span>
          <span>Chat: CSV, JSON, TXT</span>
          <span aria-hidden="true">·</span>
          <span>Max 50 MB per file</span>
        </div>
      </div>

      {/* Staged Queue */}
      {stagedFiles.length > 0 && (
        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-[#172554] uppercase tracking-wider">
              Ready to Upload ({stagedFiles.length})
            </h4>
            <button
              type="button"
              onClick={() => setStagedFiles([])}
              disabled={uploading}
              className="text-xs font-medium text-[#64748B] hover:text-rose-600 disabled:opacity-50"
            >
              Clear Queue
            </button>
          </div>

          <ul className="divide-y divide-[#E5E7F0] border border-[#E5E7F0] rounded-xl bg-white overflow-hidden">
            {stagedFiles.map((file, idx) => {
              const ext = (file.name.split('.').pop() || 'FILE').toUpperCase();
              const Icon = getFileIcon(ext);
              return (
                <li
                  key={`${file.name}-${file.size}-${idx}`}
                  className="px-4 py-3 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-[#EAF2FF] text-[#367FEA] flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#172554] truncate">{file.name}</p>
                      <p className="text-xs text-[#64748B] tabular-nums">
                        {ext} · {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveStaged(idx)}
                    disabled={uploading}
                    aria-label={`Remove ${file.name} from queue`}
                    className="p-2 rounded-lg text-[#64748B] hover:text-rose-600 hover:bg-rose-50 disabled:opacity-40"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              );
            })}
          </ul>

          {uploading && (
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-[#172554]">{progressLabel}</span>
                <span className="text-[#7656E8] tabular-nums">{progress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#F0EBFF] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#7656E8] to-[#367FEA] transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={handleStartUpload}
              disabled={uploading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7656E8] hover:bg-[#6445d8] text-white text-sm font-medium shadow-sm disabled:opacity-60 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{uploading ? 'Computing SHA-256 & Registering...' : 'Confirm & Upload Evidence'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

