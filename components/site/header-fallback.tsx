import { Logo } from './logo';

/** Static stand-in while the interactive header (which reads the URL) streams in. */
export function HeaderFallback() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 pt-2 sm:pt-3">
      <div className="shell">
        <div className="flex h-16 items-center px-3 text-white sm:px-5">
          <Logo />
        </div>
      </div>
    </header>
  );
}
