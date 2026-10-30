import { Component, type ErrorInfo, type ReactNode } from "react";

interface State {
  hasError: boolean;
}

/**
 * Last line of defence: a rendering error in one section or a malformed config
 * shows a recoverable message instead of a blank white page.
 */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary] Render failed:", error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#05080a] px-4 text-white">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p className="mt-3 text-sm text-white/60">
            This page hit an unexpected error. Reloading usually fixes it.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => window.location.reload()}
              className="rounded-full bg-amber-400 px-5 py-2 text-xs font-bold uppercase tracking-wider text-black"
            >
              Reload
            </button>
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = "/";
              }}
              className="rounded-full border border-white/15 px-5 py-2 text-xs font-semibold text-white/80"
            >
              Go to Home
            </a>
          </div>
        </div>
      </div>
    );
  }
}
