import { FileText, FolderSearch, Search, User, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvidence } from '../hooks/useEvidence';

export default function SearchBar({
  placeholder = 'Search cases, evidence, people...',
  value,
  onChange,
  globalMode = true,
  className = '',
}) {
  const [internalQuery, setInternalQuery] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const { investigations, evidence, graphData } = useEvidence();

  const query = value !== undefined ? value : internalQuery;

  const setQuery = (val) => {
    if (onChange) onChange(val);
    else setInternalQuery(val);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const results = useMemo(() => {
    if (!globalMode) return [];
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const matchedCases = investigations
      .filter(
        (c) =>
          c.id.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      )
      .slice(0, 3)
      .map((c) => ({
        id: c.id,
        kind: 'Case',
        title: c.title,
        subtitle: `${c.id} · ${c.status}`,
        route: '/timeline',
        state: { caseId: c.id },
      }));

    const matchedEvidence = evidence
      .filter(
        (e) =>
          e.fileName.toLowerCase().includes(q) ||
          e.fileType.toLowerCase().includes(q) ||
          e.caseId.toLowerCase().includes(q)
      )
      .slice(0, 4)
      .map((e) => ({
        id: e.id,
        kind: 'Evidence',
        title: e.fileName,
        subtitle: `${e.fileType} · ${e.fileSize} · ${e.caseId}`,
        route: '/upload',
        state: { highlightEvidenceId: e.id },
      }));

    const matchedPeople = (graphData?.nodes || [])
      .filter(
        (n) =>
          n.data.label.toLowerCase().includes(q) ||
          n.data.nodeType.toLowerCase().includes(q)
      )
      .slice(0, 3)
      .map((n) => ({
        id: n.id,
        kind: n.data.nodeType,
        title: n.data.label,
        subtitle: n.data.relatedEvidence?.[0] || 'Relationship Node',
        route: '/graph',
        state: { focusNodeId: n.id },
      }));

    return [...matchedCases, ...matchedEvidence, ...matchedPeople];
  }, [globalMode, query, investigations, evidence, graphData]);

  const handleSelectResult = (item) => {
    setOpen(false);
    setQuery('');
    navigate(item.route, { state: item.state });
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <div className="relative flex items-center">
        <Search
          className="w-4 h-4 text-[#64748B] absolute left-3.5 pointer-events-none"
          aria-hidden="true"
        />
        <input
          type="text"
          value={query}
          onFocus={() => globalMode && setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            if (globalMode) setOpen(true);
          }}
          placeholder={placeholder}
          aria-label={placeholder}
          className="w-full h-10 pl-10 pr-9 text-sm bg-[#F5F6FC] border border-[#E5E7F0] rounded-xl text-[#172554] placeholder:text-[#64748B] focus:outline-none focus:bg-white focus:border-[#7656E8] focus:ring-2 focus:ring-[#F0EBFF] transition-all"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="Clear search"
            className="absolute right-2.5 p-1 text-[#64748B] hover:text-[#172554] rounded-md"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {globalMode && open && query.trim().length > 0 && (
        <div className="absolute left-0 right-0 mt-2 bg-white border border-[#E5E7F0] rounded-xl shadow-lg z-50 overflow-hidden">
          {results.length === 0 ? (
            <div className="px-4 py-5 text-center text-sm text-[#64748B]">
              No matching cases, evidence files, or entities for "{query}".
            </div>
          ) : (
            <ul className="divide-y divide-[#E5E7F0] max-h-80 overflow-y-auto">
              {results.map((item) => (
                <li key={`${item.kind}-${item.id}`}>
                  <button
                    type="button"
                    onClick={() => handleSelectResult(item)}
                    className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-[#F5F6FC] transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#F0EBFF] text-[#7656E8] flex items-center justify-center shrink-0">
                      {item.kind === 'Case' ? (
                        <FolderSearch className="w-4 h-4" />
                      ) : item.kind === 'Evidence' ? (
                        <FileText className="w-4 h-4" />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-[#172554] truncate">
                        {item.title}
                      </div>
                      <div className="text-xs text-[#64748B] truncate">
                        {item.kind} · {item.subtitle}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

