/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

interface HeaderProps {
  asLink?: boolean;
}

export function Header({ asLink = false }: HeaderProps) {
  const content = (
    <div className="flex items-center gap-3">
      <img
        src="/logo-white.svg"
        alt="Remotion"
        style={{
          width: 32,
        }}
      />
      <span className="text-xl font-bold text-white font-sans">
        Remotion - Prompt to Motion Graphics
      </span>
    </div>
  );

  const logo = asLink ? (
    <Link
      href="/"
      className="flex items-center hover:opacity-80 transition-opacity"
    >
      {content}
    </Link>
  ) : (
    content
  );

  return (
    <div className="flex items-center justify-between w-full">
      {logo}
      <a
        href="http://localhost:3001"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-sm text-white/60 hover:text-white border border-white/15 hover:border-white/30 rounded-lg px-4 py-2 transition-all"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
          <rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
          <rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
          <rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
        Remotion Studio
      </a>
    </div>
  );
}
