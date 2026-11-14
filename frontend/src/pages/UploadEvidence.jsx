import {
  CheckCircle2,
  Eye,
  File,
  FileAudio,
  FileImage,
  FileText,
  Filter,
  ShieldAlert,
  Trash2,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import EvidenceCard from '../components/EvidenceCard';
import FileUpload from '../components/FileUpload';
import SearchBar from '../components/SearchBar';
import { useAuth } from '../context/AuthContext';
import { useEvidence } from '../hooks/useEvidence';
import { formatDateDisplay } from '../utils/crypto';

function getRowIcon(fileType) {
  if (fileType === 'Image') return FileImage;
  if (fileType === 'Audio') return FileAudio;
  if (fileType === 'Document' || fileType === 'Chat Export') return FileText;
  return File;
}

export default function UploadEvidence() {
  const { preferences } = useAuth();
  const { investigations, evidence, uploadFiles, removeEvidence } = useEvidence();
  const location = useLocation();

  const [selectedCaseId, setSelectedCaseId] = useState(investigations[0]?.id || 'CASE-2026-014');
  const [typeFilter, setTypeFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvidenceId, setSelectedEvidenceId] = useState(
    location.state?.highlightEvidenceId || evidence[0]?.id || null
  );
  const [confirmDeleteItem, setConfirmDeleteItem] = useState(null);

  useEffect(() => {
    if (location.state?.highlightEvidenceId) {
      setSelectedEvidenceId(location.state.highlightEvidenceId);
    }
  }, [location.state]);

  const filteredEvidence = useMemo(() => {
    const now = Date.now();
    return evidence.filter((item) => {
      if (typeFilter !== 'All' && item.fileType !== typeFilter) return false;

      if (dateFilter !== 'All') {
        const diffDays = (now - new Date(item.uploadDate).getTime()) / (1000 * 60 * 60 * 24);
        if (dateFilter === 'Today' && diffDays > 1.5) return false;
        if (dateFilter === 'Last 7 Days' && diffDays > 7) return false;
        if (dateFilter === 'Older' && diffDays <= 7) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          item.fileName.toLowerCase().includes(q) ||
          item.caseId.toLowerCase().includes(q) ||
          item.fileType.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [evidence, typeFilter, dateFilter, searchQuery]);

  const selectedEvidence = useMemo(
    () => evidence.find((e) => e.id === selectedEvidenceId) || filteredEvidence[0] || null,
    [evidence, selectedEvidenceId, filteredEvidence]
  );

  const handleUploadComplete = async (files, caseId, onProgress) => {
    const uploaded = await uploadFiles(files, caseId, onProgress);
    if (uploaded.length > 0) {
      setSelectedEvidenceId(uploaded[0].record.id);
    }
    return uploaded;
  };

  const handleConfirmDelete = async () => {
    if (!confirmDeleteItem) return;
    await removeEvidence(confirmDeleteItem.id);
    toast.success(`Removed ${confirmDeleteItem.fileName}`);
    if (selectedEvidenceId === confirmDeleteItem.id) {
      setSelectedEvidenceId(null);
    }
    setConfirmDeleteItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-[#172554]">
          Evidence Collection
        </h1>
        <p className="mt-1 text-sm text-[#64748B]">
          Upload and manage digital evidence securely.
        </p>
      </div>

      {/* Drag & Drop Upload Interface */}
      <FileUpload
        investigations={investigations}
        selectedCaseId={selectedCaseId}
        onSelectCaseId={setSelectedCaseId}
        onUploadComplete={handleUploadComplete}
      />

      {/* Uploaded Evidence Table + Details Preview Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-8 forensic-card overflow-hidden">
          <div className="p-5 border-b border-[#E5E7F0] flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-[#172554]">
                Uploaded Evidence ({filteredEvidence.length})
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Click any row to inspect content preview and SHA-256 checksum
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="w-full sm:w-48">
                <SearchBar
                  globalMode={false}
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Filter filename..."
                />
              </div>

              <div className="inline-flex items-center gap-1.5 text-xs text-[#64748B]">
                <Filter className="w-3.5 h-3.5" aria-hidden="true" />
                <select
                  aria-label="Filter by file type"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="h-10 px-3 rounded-xl bg-[#F5F6FC] border border-[#E5E7F0] text-xs font-medium text-[#172554] focus:outline-none focus:border-[#7656E8]"
                >
                  <option value="All">All Types</option>
                  <option value="Image">Image</option>
                  <option value="Document">Document</option>
                  <option value="Audio">Audio</option>
                  <option value="Chat Export">Chat Export</option>
                </select>
              </div>

              <select
                aria-label="Filter by upload date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="h-10 px-3 rounded-xl bg-[#F5F6FC] border border-[#E5E7F0] text-xs font-medium text-[#172554] focus:outline-none focus:border-[#7656E8]"
              >
                <option value="All">All Dates</option>
                <option value="Today">Today</option>
                <option value="Last 7 Days">Last 7 Days</option>
                <option value="Older">Older</option>
              </select>
            </div>
          </div>

          {filteredEvidence.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-sm font-semibold text-[#172554]">No evidence files match your filters</p>
              <p className="mt-1 text-xs text-[#64748B]">
                Clear your search or upload new evidence files above.
              </p>
              <button
                type="button"
                onClick={() => {
                  setTypeFilter('All');
                  setDateFilter('All');
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-[#F0EBFF] text-[#7656E8] text-xs font-semibold"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E5E7F0] bg-[#F5F6FC]/60 text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                    <th className="py-3 px-4">File Name</th>
                    <th className="py-3 px-4">File Type</th>
                    <th className="py-3 px-4">File Size</th>
                    <th className="py-3 px-4">Upload Date</th>
                    <th className="py-3 px-4">Integrity Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7F0] text-sm">
                  {filteredEvidence.map((item) => {
                    const Icon = getRowIcon(item.fileType);
                    const isSelected = selectedEvidence?.id === item.id;
                    const isClientHash = item.integrityStatus.includes('Client');

                    return (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedEvidenceId(item.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-[#F0EBFF]/45' : 'hover:bg-[#F5F6FC]'
                        }`}
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3 min-w-[200px]">
                            <div className="w-8 h-8 rounded-lg bg-[#EAF2FF] text-[#367FEA] flex items-center justify-center shrink-0">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-medium text-[#172554] truncate max-w-[220px]">
                                {item.fileName}
                              </div>
                              <div className="text-[11px] font-mono text-[#64748B]">
                                {item.caseId}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-[#64748B] whitespace-nowrap">
                          {item.fileType} ({item.extension})
                        </td>
                        <td className="py-3.5 px-4 text-xs font-mono text-[#172554] tabular-nums whitespace-nowrap">
                          {item.fileSize}
                        </td>
                        <td className="py-3.5 px-4 text-xs font-mono text-[#64748B] tabular-nums whitespace-nowrap">
                          {formatDateDisplay(item.uploadDate, preferences.dateFormat)}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                              isClientHash ? 'text-[#22B981]' : 'text-[#367FEA]'
                            }`}
                          >
                            {isClientHash ? (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            ) : (
                              <ShieldAlert className="w-3.5 h-3.5" />
                            )}
                            <span>{item.integrityStatus}</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEvidenceId(item.id);
                              }}
                              aria-label={`Inspect ${item.fileName}`}
                              className="p-2 rounded-lg text-[#64748B] hover:text-[#7656E8] hover:bg-[#F0EBFF]"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setConfirmDeleteItem(item);
                              }}
                              aria-label={`Delete ${item.fileName}`}
                              className="p-2 rounded-lg text-[#64748B] hover:text-rose-600 hover:bg-rose-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Selected File Preview Panel */}
        <div className="xl:col-span-4">
          <EvidenceCard item={selectedEvidence} />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDeleteItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172554]/30 backdrop-blur-[1px]">
          <div className="w-full max-w-sm bg-white border border-[#E5E7F0] rounded-2xl shadow-xl p-6">
            <h3 className="text-base font-bold text-[#172554]">Remove Evidence Artifact?</h3>
            <p className="mt-2 text-xs text-[#64748B] leading-relaxed">
              This will delete <span className="font-semibold text-[#172554]">{confirmDeleteItem.fileName}</span> from the current session evidence repository.
            </p>
            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setConfirmDeleteItem(null)}
                className="px-4 py-2 rounded-xl border border-[#E5E7F0] text-xs font-semibold text-[#64748B] hover:bg-[#F5F6FC]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
              >
                Delete File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
