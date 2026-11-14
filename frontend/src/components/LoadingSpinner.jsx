import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ label = 'Loading...', size = 'md' }) {
  const iconClass =
    size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-7 h-7' : 'w-5 h-5';

  return (
    <div className="inline-flex items-center gap-2.5 text-sm font-medium text-[#64748B]">
      <Loader2 className={`${iconClass} animate-spin text-[#7656E8]`} aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

