/**
 * Navbar — top navigation bar.
 * Preserves exact design from source HTML.
 */
export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-[#141414]/80 backdrop-blur-md border-b border-border-subtle">
      <div className="flex justify-between items-center px-lg h-16 w-full max-w-container-max mx-auto">
        <div className="flex items-center gap-md">
          <span className="text-headline-lg font-headline-lg font-bold text-on-surface tracking-tight">
            Stunning
          </span>
        </div>
        <div className="hidden md:flex items-center gap-xl">
          <a href="#" className="text-text-muted hover:text-primary transition-colors duration-200 font-label-mono text-label-mono">
            Features
          </a>
          <a href="#" className="text-text-muted hover:text-primary transition-colors duration-200 font-label-mono text-label-mono">
            Templates
          </a>
          <a href="#" className="text-text-muted hover:text-primary transition-colors duration-200 font-label-mono text-label-mono">
            Showcase
          </a>
          <a href="#" className="text-text-muted hover:text-primary transition-colors duration-200 font-label-mono text-label-mono">
            Pricing
          </a>
        </div>
        <div className="flex items-center gap-md">
          <button
            className="hidden md:flex items-center justify-center w-10 h-10 rounded text-text-muted hover:text-primary transition-colors bg-surface border border-border-subtle"
            aria-label="View code"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              code
            </span>
          </button>
          <button className="px-md py-sm bg-surface text-text-primary border border-border-subtle rounded hover:border-text-muted transition-colors font-label-mono text-label-mono">
            Sign In
          </button>
        </div>
      </div>
    </nav>
  );
}
