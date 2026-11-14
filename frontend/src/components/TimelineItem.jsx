import {
  AlertCircle,
  BrainCircuit,
  Eye,
  FileUp,
  Mail,
  MessageSquare,
  Phone,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatDateDisplay } from '../utils/crypto';

const CATEGORY_STYLES = {
  Messages: {
    icon: MessageSquare,
    bg: '#EAF2FF',
    color: '#367FEA',
  },
  Emails: {
    icon: Mail,
    bg: '#F0EBFF',
    color: '#7656E8',
  },
  Calls: {
    icon: Phone,
    bg: '#ECFDF5',
    color: '#22B981',
  },
  'File uploads': {
    icon: FileUp,
    bg: '#F1F5F9',
    color: '#475569',
  },
  'Important observations': {
    icon: AlertCircle,
    bg: '#FEF3C7',
    color: '#D97706',
  },
  'AI analysis events': {
    icon: BrainCircuit,
    bg: '#F0EBFF',
    color: '#7656E8',
  },
};

export default function TimelineItem({ event, isSelected, onSelect, onViewEvidence }) {
  const { preferences } = useAuth();
  const style = CATEGORY_STYLES[event.category] || CATEGORY_STYLES['Important observations'];
  const Icon = style.icon;

  return (
    <div className="relative pl-10 sm:pl-12 pb-6 last:pb-0">
      {/* Vertical connector line */}
      <div
        className="absolute left-[15px] sm:left-[19px] top-9 bottom-0 w-px bg-[#E5E7F0]"
        aria-hidden="true"
      />

      {/* Category Node Icon */}
      <div
        className="absolute left-0 top-1 w-8 h-8 sm:w-10 sm:h-10 rounded-xl border border-[#E5E7F0] flex items-center justify-center shadow-xs"
        style={{ backgroundColor: style.bg, color: style.color }}
      >
        <Icon className="w-4 h-4" aria-hidden="true" />
      </div>

      {/* Card */}
      <div
        onClick={() => onSelect(event)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(event);
          }
        }}
        className={`forensic-card p-4 sm:p-5 cursor-pointer transition-all ${
          isSelected ? 'ring-2 ring-[#7656E8] border-[#7656E8]' : 'hover:border-[#CBD5E1]'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-medium">
            <span style={{ color: style.color }}>{event.category}</span>
            <span className="text-[#CBD5E1]" aria-hidden="true">·</span>
            <span className="text-[#64748B] font-mono tabular-nums">
              {formatDateDisplay(event.timestamp, preferences.dateFormat)}
            </span>
          </div>
          <span className="text-xs font-mono text-[#64748B]">{event.caseId}</span>
        </div>

        <h3 className="mt-1.5 text-[15px] font-semibold text-[#172554]">{event.title}</h3>
        <p className="mt-1 text-sm text-[#64748B] leading-relaxed">{event.description}</p>

        <div className="mt-3.5 pt-3 border-t border-[#E5E7F0] flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-[#64748B] font-mono truncate max-w-xs sm:max-w-md">
            Source: {event.evidenceFile}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onViewEvidence(event);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F5F6FC] hover:bg-[#F0EBFF] text-xs font-semibold text-[#7656E8] transition-colors whitespace-nowrap"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Evidence</span>
          </button>
        </div>
      </div>
    </div>
  );
}

