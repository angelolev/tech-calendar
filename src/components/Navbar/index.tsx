import { AuthButton } from "../AuthButton";

export const Navbar = () => {
  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur-md"
      style={{
        background: 'rgba(42, 49, 66, 0.8)',
        boxShadow: 'var(--shadow-md)',
        borderBottom: '1px solid rgba(67, 78, 120, 0.3)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo/Brand */}
          <div className="flex items-center gap-3">
            <div
              className="text-2xl font-light tracking-tight"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Calendario Tech
            </div>
            <div
              className="hidden md:block text-xs uppercase tracking-wider px-3 py-1 rounded-full"
              style={{
                background: 'rgba(90, 106, 168, 0.2)',
                color: 'var(--color-lavender)',
                border: '1px solid rgba(90, 106, 168, 0.3)',
              }}
            >
              Coding Latam
            </div>
          </div>

          {/* Auth Button */}
          <div>
            <AuthButton />
          </div>
        </div>
      </div>
    </nav>
  );
};
