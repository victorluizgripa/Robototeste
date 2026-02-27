type RobotoLogoProps = {
  /** Tamanho do container (quadrado). Header: 32, login: 48 */
  size?: 24 | 32 | 48;
  /** Incluir texto "Roboto" ao lado */
  showText?: boolean;
  /** Classe do container (ex: para link) */
  className?: string;
};

const SIZES = { 24: "h-6 w-6", 32: "h-8 w-8", 48: "h-12 w-12" } as const;
const RADII = { 24: "rounded-lg", 32: "rounded-xl", 48: "rounded-2xl" } as const;
const TEXT_SIZES = { 24: "text-base", 32: "text-lg", 48: "text-2xl" } as const;

export function RobotoLogo({
  size = 32,
  showText = true,
  className = "",
}: RobotoLogoProps) {
  const iconSize = SIZES[size];
  const textSize = TEXT_SIZES[size];
  const radius = RADII[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div
        className={`flex shrink-0 items-center justify-center bg-accent-600 ${radius} ${iconSize}`}
        aria-hidden
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="white"
          className={size === 24 ? "h-4 w-4" : size === 32 ? "h-5 w-5" : "h-6 w-6"}
          aria-hidden
        >
          {/* Antena curvada */}
          <path
            stroke="white"
            strokeWidth="1.1"
            fill="none"
            strokeLinecap="round"
            d="M12 4.2V2.2l-1.2 1"
          />
          <circle cx="10.8" cy="2.2" r="0.65" fill="white" />
          {/* Cabeça (retângulo arredondado) */}
          <rect x="5" y="3.8" width="14" height="5.8" rx="1.4" />
          {/* Olhos (dois retângulos horizontais) */}
          <rect x="7.6" y="5.3" width="2" height="1.1" rx="0.25" fill="#6d28d9" />
          <rect x="14.4" y="5.3" width="2" height="1.1" rx="0.25" fill="#6d28d9" />
          {/* Corpo */}
          <rect x="6" y="10" width="12" height="7.5" rx="1.2" />
          {/* Braços */}
          <rect x="3.2" y="12.6" width="3.2" height="1.2" rx="0.35" />
          <rect x="17.6" y="12.6" width="3.2" height="1.2" rx="0.35" />
        </svg>
      </div>
      {showText && (
        <span className={`font-bold text-txt ${textSize}`}>Roboto</span>
      )}
    </div>
  );
}
