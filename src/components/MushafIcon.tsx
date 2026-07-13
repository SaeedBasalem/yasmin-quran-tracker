/** أيقونة المصحف (شعار الترويسة). */
export function MushafIcon() {
  return (
    <div className="logo-wrap">
      <svg
        width="80"
        height="80"
        viewBox="0 0 100 120"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="مصحف"
      >
        <defs>
          <linearGradient id="cov" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2E7D57" />
            <stop offset="1" stopColor="#1B5E3F" />
          </linearGradient>
        </defs>
        <rect x="16" y="16" width="70" height="94" rx="6" fill="#EFE7CE" />
        <rect
          x="20"
          y="12"
          width="66"
          height="98"
          rx="8"
          fill="url(#cov)"
          stroke="#14512F"
          strokeWidth="1.5"
        />
        <rect x="78" y="12" width="8" height="98" rx="4" fill="#14512F" opacity=".45" />
        <rect x="28" y="20" width="50" height="82" rx="5" fill="none" stroke="#D4AF37" strokeWidth="1.6" />
        <rect x="31.5" y="23.5" width="43" height="75" rx="4" fill="none" stroke="#D4AF37" strokeWidth="0.8" />
        <g transform="translate(53,61)" fill="none" stroke="#D4AF37" strokeWidth="1.8">
          <rect x="-11" y="-11" width="22" height="22" rx="1.5" />
          <rect x="-11" y="-11" width="22" height="22" rx="1.5" transform="rotate(45)" />
        </g>
        <circle cx="53" cy="61" r="3.2" fill="#D4AF37" />
        <g fill="#D4AF37">
          <circle cx="34" cy="26" r="1.5" />
          <circle cx="72" cy="26" r="1.5" />
          <circle cx="34" cy="96" r="1.5" />
          <circle cx="72" cy="96" r="1.5" />
        </g>
      </svg>
    </div>
  )
}
