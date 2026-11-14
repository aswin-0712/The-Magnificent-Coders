import {
  BrainCircuit,
  Clock,
  FileBarChart2,
  LayoutDashboard,
  Network,
  Settings,
  UploadCloud,
  X,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { BrandLogo, ShieldLockIllustration } from './BrandLogo';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/upload', label: 'Upload Evidence', icon: UploadCloud },
  { to: '/analysis', label: 'AI Analysis', icon: BrainCircuit },
  { to: '/timeline', label: 'Incident Timeline', icon: Clock },
  { to: '/graph', label: 'Relationship Graph', icon: Network },
  { to: '/reports', label: 'Reports', icon: FileBarChart2 },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ mobileOpen, onClose }) {
  const sidebarBody = (
    <div className="flex flex-col h-full bg-white border-r border-[#E5E7F0] w-[230px] select-none">
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-[#E5E7F0] shrink-0">
        <BrandLogo />
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="lg:hidden p-1.5 rounded-lg text-[#64748B] hover:text-[#172554] hover:bg-[#F5F6FC]"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Primary Navigation */}
      <nav aria-label="Main navigation" className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13.5px] font-medium transition-all duration-150 whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-[#7656E8] to-[#367FEA] text-white shadow-sm'
                    : 'text-[#64748B] hover:text-[#172554] hover:bg-[#F5F6FC]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-[18px] h-[18px] shrink-0 transition-colors ${
                      isActive ? 'text-white' : 'text-[#64748B] group-hover:text-[#7656E8]'
                    }`}
                    aria-hidden="true"
                  />
                  <span className="truncate">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Promotional Card */}
      <div className="p-3 shrink-0">
        <div className="rounded-2xl bg-gradient-to-br from-[#F0EBFF] via-[#F5F6FC] to-[#EAF2FF] border border-[#E5E7F0] p-3.5">
          <div className="flex items-center gap-3">
            <ShieldLockIllustration />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#172554] leading-snug">
                Your Evidence.
                <br />
                Our Intelligence.
              </p>
            </div>
          </div>
          <p className="mt-2.5 text-[11px] text-[#64748B] leading-relaxed">
            Client-side SHA-256 hashing &amp; structured case workflows.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Fixed Desktop Sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 z-30 w-[230px] no-print">
        {sidebarBody}
      </aside>

      {/* Mobile & Tablet Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex no-print">
          <div
            className="fixed inset-0 bg-[#172554]/30 backdrop-blur-[1px]"
            onClick={onClose}
            aria-hidden="true"
          />
          <div className="relative z-10 h-full shadow-xl">{sidebarBody}</div>
        </div>
      )}
    </>
  );
}

