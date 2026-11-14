export function BrandLogo({ compact = false }) {
  return (
    <div className="flex items-center gap-3 min-w-0">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7656E8] to-[#367FEA] flex items-center justify-center shrink-0 shadow-sm">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className="text-white"
        >
          <path
            d="M12 2.5L4.5 5.6V11.4C4.5 16.2 7.7 20.5 12 21.8C16.3 20.5 19.5 16.2 19.5 11.4V5.6L12 2.5Z"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
          <path
            d="M9.5 11.5C9.5 10.1 10.6 9 12 9C13.4 9 14.5 10.1 14.5 11.5V13.8"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M12 11.4V15.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M7.8 12.2C7.8 9.2 9.7 7 12 7C14.3 7 16.2 9.2 16.2 12.2"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            opacity="0.85"
          />
        </svg>
      </div>
      {!compact && (
        <div className="min-w-0">
          <div className="text-[15px] font-bold tracking-tight text-[#172554] leading-tight whitespace-nowrap">
            EVIDENCE AI
          </div>
          <div className="text-[11px] font-medium text-[#64748B] truncate">
            Analyze • Investigate • Uncover
          </div>
        </div>
      )}
    </div>
  );
}

export function ShieldLockIllustration() {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect width="48" height="48" rx="12" fill="#F0EBFF" />
      <path
        d="M24 9L12 14V23C12 30.8 17.1 37.9 24 39.8C30.9 37.9 36 30.8 36 23V14L24 9Z"
        fill="#FFFFFF"
        stroke="#7656E8"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <rect
        x="19.5"
        y="22.5"
        width="9"
        height="7.5"
        rx="2"
        fill="#EAF2FF"
        stroke="#367FEA"
        strokeWidth="1.8"
      />
      <path
        d="M21.5 22.5V20.5C21.5 19.1 22.6 18 24 18C25.4 18 26.5 19.1 26.5 20.5V22.5"
        stroke="#7656E8"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="24" cy="26.2" r="1.1" fill="#7656E8" />
    </svg>
  );
}

export function ForensicFingerprintGraphic({ className = '' }) {
  return (
    <svg
      viewBox="0 0 220 220"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <circle cx="110" cy="110" r="96" stroke="#7656E8" strokeWidth="1.2" strokeDasharray="4 6" opacity="0.35" />
      <circle cx="110" cy="110" r="78" stroke="#367FEA" strokeWidth="1.4" opacity="0.25" />
      <path
        d="M66 120C66 94.6 85.7 74 110 74C134.3 74 154 94.6 154 120C154 140 144 156 130 165"
        stroke="#7656E8"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M78 122C78 102.7 92.3 87 110 87C127.7 87 142 102.7 142 122C142 138 134 150 121 157"
        stroke="#367FEA"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path
        d="M90 123C90 110.3 99 100 110 100C121 100 130 110.3 130 123C130 135 123 145 113 150"
        stroke="#7656E8"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M102 123C102 117.5 105.6 113 110 113C114.4 113 118 117.5 118 123V138"
        stroke="#367FEA"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M110 123V148"
        stroke="#7656E8"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M62 96C70 72 88 59 110 59C135 59 156 76 163 102"
        stroke="#7656E8"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.45"
      />
      <path
        d="M84 158C94 163 103 165 114 165"
        stroke="#367FEA"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}
