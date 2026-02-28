type RobotoLogoProps = {
  /** Tamanho do container (quadrado). Header: 32, login: 48 */
  size?: 24 | 32 | 48;
  /** Incluir texto "Roboto" ao lado */
  showText?: boolean;
  /** Classe do container (ex: para link) */
  className?: string;
};

const SIZES = { 24: "h-6 w-6", 32: "h-8 w-8", 48: "h-12 w-12" } as const;
const RADII = {
  24: "rounded-[0.75rem]",
  32: "rounded-[1rem]",
  48: "rounded-[1.25rem]",
} as const;
const TEXT_SIZES = { 24: "text-base", 32: "text-lg", 48: "text-2xl" } as const;
const SVG_SIZES = { 24: "h-4 w-4", 32: "h-5 w-5", 48: "h-10 w-10" } as const;

export function RobotoLogo({
  size = 32,
  showText = true,
  className = "",
}: RobotoLogoProps) {
  const iconSize = SIZES[size];
  const textSize = TEXT_SIZES[size];
  const radius = RADII[size];
  const svgSize = SVG_SIZES[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div
        className={`flex shrink-0 items-center justify-center bg-accent-600 ${radius} ${iconSize}`}
        aria-hidden
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-white ${svgSize}`}
          aria-hidden
        >
          <rect x="4" y="6" width="16" height="12" rx="3" ry="3" />
          <circle cx="9" cy="11" r="0.9" fill="white" stroke="none" />
          <circle cx="15" cy="11" r="0.9" fill="white" stroke="none" />
          <path d="M12 3v3" />
          <path d="M2 12h2M20 12h2" />
        </svg>
      </div>
      {showText && (
        <span className={`font-bold text-txt ${textSize}`}>Roboto</span>
      )}
    </div>
  );
}
