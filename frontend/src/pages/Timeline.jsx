import {
  ArrowDownUp,
  BrainCircuit,
  Calendar,
  Clock,
  ExternalLink,
  FileText,
  Filter,
  RotateCcw,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import TimelineItem from '../components/TimelineItem';
import { useAuth } from '../context/AuthContext';
import { useEvidence } from '../hooks/useEvidence';
import { formatDateDisplay } from '../utils/crypto';

const EVENT_CATEGORIES = [
  'All',
  'Messages',
  'Emails',
  'Calls',
  'File uploads',
  'Important observations',
  'AI analysis events',
];

export default function Timeline() {
  const { preferences } = useAuth();
  const { investigations, evidence, timelineEvents } = useEvidence();
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedCaseId, setSelectedCaseId] = useState(location.state?.caseId || 'ALL');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortOrder, setSortOrder] = useState('oldest'); // 'oldest' | 'newest'
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    if (location.state?.caseId) {
      setSelectedCaseId(location.state.caseId);
    }
  }, [location.state]);

  const filteredEvents = useMemo(() => {
    const items = timelineEvents.filter((evt) => {
      if (selectedCaseId !== 'ALL' && evt.caseId !== selectedCaseId) return false;
      if (categoryFilter !== 'All' && evt.category !== categoryFilter) return false;

      const evtDay = evt.timestamp.slice(0, 10);
      if (startDate && evtDay < startDate) return false;
      if (endDate && evtDay > endDate) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          evt.title.toLowerCase().includes(q) ||
          evt.description.toLowerCase().includes(q) ||
          evt.evidenceFile.toLowerCase().includes(q) ||
          evt.category.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });

    return [...items].sort((a, b) => {
      const tA = new Date(a.timestamp).getTime();
      const tB = new Date(b.timestamp).getTime();
      return sortOrder === 'oldest' ? tA - tB : tB - tA;
    });
  }, [timelineEvents, selectedCaseId, categoryFilter, startDate, endDate, searchQuery, sortOrder]);

  useEffect(() => {
    if (filteredEvents.length > 0 && (!selectedEvent || !filteredEvents.some((e) => e.id === selectedEvent.id))) {
      setSelectedEvent(filteredEvents[0]);
    } else if (filteredEvents.length === 0) {
      setSelectedEvent(null);
    }
  }, [filteredEvents, selectedEvent]);

  const linkedEvidence = useMemo(() => {
    if (!selectedEvent) return null;
    return (
      evidence.find((e) => e.id === selectedEvent.evidenceId) ||
      evidence.find((e) => e.fileName === selectedEvent.evidenceFile) ||
      null
    );
  }, [selectedEvent, evidence]);

  const resetFilters = () => {
    setSelectedCaseId('ALL');
    setCategoryFilter('All');
    setSearchQuery('');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-[#172554]">
            Incident Timeline
          </h1>
          <p className="mt-1 text-sm text-[#64748B]">
            Understand the sequence of events through chronological analysis.
          </p>
        </div>

        {/* Chronological Order Toggle */}
        <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-white border border-[#E5E7F0] self-start">
          <button
            type="button"
            onClick={() => setSortOrder('oldest')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
              sortOrder === 'oldest'
                ? 'bg-[#7656E8] text-white'
                : 'text-[#64748B] hover:text-[#172554]'
            }`}
          >
            <ArrowDownUp className="w-3.5 h-3.5" />
            <span>Oldest First</span>
          </button>
          <button
            type="button"
            onClick={() => setSortOrder('newest')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
              sortOrder === 'newest'
                ? 'bg-[#7656E8] text-white'
                : 'text-[#64748B] hover:text-[#172554]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Newest First</span>
          </button>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="forensic-card p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          <div className="lg:col-span-4">
            <label htmlFor="timeline-case" className="block text-xs font-semibold text-[#172554] mb-1">
              Investigation
            </label>
            <select
              id="timeline-case"
              value={selectedCaseId}
              onChange={(e) => setSelectedCaseId(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-[#F5F6FC] border border-[#E5E7F0] text-xs font-medium text-[#172554] focus:outline-none focus:border-[#7656E8]"
            >
              <option value="ALL">All Investigations</option>
              {investigations.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id} — {c.title}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-4">
            <label className="block text-xs font-semibold text-[#172554] mb-1">Search Events</label>
            <SearchBar
              globalMode={false}
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search event title, file, summary..."
            />
          </div>

          <div className="lg:col-span-2">
            <label htmlFor="tl-start-date" className="block text-xs font-semibold text-[#172554] mb-1">
              From Date
            </label>
            <input
              id="tl-start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-[#F5F6FC] border border-[#E5E7F0] text-xs text-[#172554] focus:outline-none focus:border-[#7656E8]"
            />
          </div>

          <div className="lg:col-span-2">
            <label htmlFor="tl-end-date" className="block text-xs font-semibold text-[#172554] mb-1">
              To Date
            </label>
            <input
              id="tl-end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-[#F5F6FC] border border-[#E5E7F0] text-xs text-[#172554] focus:outline-none focus:border-[#7656E8]"
            />
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#E5E7F0]">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 text-xs font-medium text-[#64748B] mr-1">
              <Filter className="w-3.5 h-3.5" /> Category:
            </span>
            {EVENT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  categoryFilter === cat
                    ? 'bg-[#F0EBFF] text-[#7656E8] font-semibold'
                    : 'bg-[#F5F6FC] text-[#64748B] hover:text-[#172554]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {(selectedCaseId !== 'ALL' || categoryFilter !== 'All' || searchQuery || startDate || endDate) && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#7656E8] hover:underline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Split: Vertical Timeline + Event Details Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-8">
          {filteredEvents.length === 0 ? (
            <div className="forensic-card p-10 text-center">
              <p className="text-sm font-semibold text-[#172554]">No timeline events match these filters</p>
              <p className="mt-1 text-xs text-[#64748B]">
                Try clearing your date range or selecting All Categories.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-4 px-4 py-2 rounded-xl bg-[#F0EBFF] text-[#7656E8] text-xs font-semibold"
              >
                Show All Events
              </button>
            </div>
          ) : (
            <div className="pt-1">
              {filteredEvents.map((evt) => (
                <TimelineItem
                  key={evt.id}
                  event={evt}
                  isSelected={selectedEvent?.id === evt.id}
                  onSelect={setSelectedEvent}
                  onViewEvidence={(clickedEvent) => setSelectedEvent(clickedEvent)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Event & Source Evidence Inspection Panel */}
        <aside className="xl:col-span-4 forensic-card p-5 sm:p-6 xl:sticky xl:top-22 space-y-4">
          {!selectedEvent ? (
            <div className="text-center py-6">
              <Calendar className="w-8 h-8 text-[#94A3B8] mx-auto" />
              <p className="mt-2 text-sm font-semibold text-[#172554]">Select a Timeline Event</p>
              <p className="mt-1 text-xs text-[#64748B]">
                Click any chronological card to inspect its source artifact and extracted excerpt.
              </p>
            </div>
          ) : (
            <>
              <div className="pb-3 border-b border-[#E5E7F0]">
                <div className="text-xs font-semibold text-[#7656E8]">
                  {selectedEvent.category} · {selectedEvent.caseId}
                </div>
                <h2 className="mt-1 text-base font-bold text-[#172554]">{selectedEvent.title}</h2>
                <div className="mt-1 text-xs font-mono text-[#64748B] tabular-nums">
                  {formatDateDisplay(selectedEvent.timestamp, preferences.dateFormat)}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  Event Summary
                </h3>
                <p className="mt-1.5 text-sm text-[#172554] leading-relaxed">
                  {selectedEvent.description}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F5F6FC] border border-[#E5E7F0] space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#172554]">
                  <FileText className="w-3.5 h-3.5 text-[#367FEA]" />
                  <span>Extracted Source Information</span>
                </div>
                <p className="text-xs font-mono text-[#475569] leading-relaxed break-words">
                  {selectedEvent.extractedSnippet}
                </p>
              </div>

              <div className="pt-2 border-t border-[#E5E7F0] space-y-2.5">
                <div className="text-xs font-semibold text-[#172554]">Source Evidence File</div>
                <div className="text-xs font-mono text-[#64748B] break-all">
                  {selectedEvent.evidenceFile}
                </div>
                {linkedEvidence && (
                  <div className="text-[11px] text-[#64748B]">
                    {linkedEvidence.fileType} · {linkedEvidence.fileSize} ·{' '}
                    <span className="text-[#22B981] font-medium">
                      {linkedEvidence.integrityStatus}
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() =>
                      navigate('/upload', {
                        state: { highlightEvidenceId: linkedEvidence?.id || selectedEvent.evidenceId },
                      })
                    }
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#F5F6FC] hover:bg-[#EAF2FF] text-xs font-semibold text-[#367FEA] transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Artifact</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      navigate('/analysis', {
                        state: {
                          caseId: selectedEvent.caseId,
                          evidenceId: linkedEvidence?.id || selectedEvent.evidenceId,
                        },
                      })
                    }
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#F0EBFF] hover:bg-[#e5dcff] text-xs font-semibold text-[#7656E8] transition-colors"
                  >
                    <BrainCircuit className="w-3.5 h-3.5" />
                    <span>Analyze</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}

