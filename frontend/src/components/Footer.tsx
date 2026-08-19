/**
 * Footer — site footer.
 * Preserves exact design from source HTML.
 */
export function Footer() {
  return (
    <footer className="w-full py-xl bg-[#141414] border-t border-border-subtle mt-auto relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-center px-lg max-w-container-max mx-auto gap-md">
        <div className="text-body-lg font-body-lg text-on-surface font-bold tracking-tight">
          Stunning
        </div>
        <div className="flex gap-md font-label-mono text-label-mono text-text-muted">
          <a href="#" className="hover:text-primary transition-colors uppercase tracking-wider">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-primary transition-colors uppercase tracking-wider">
            Terms of Service
          </a>
          <a href="#" className="hover:text-primary transition-colors uppercase tracking-wider">
            Cookie Policy
          </a>
        </div>
        <div className="font-label-mono text-label-mono text-text-muted">
          © 2024 Stunning AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
