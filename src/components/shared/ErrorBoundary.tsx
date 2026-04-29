import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: undefined });
    if (typeof window !== "undefined") window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-black text-white text-center">
          <div className="max-w-md space-y-4">
            <h1 className="text-2xl font-light tracking-wide">Une erreur est survenue</h1>
            <p className="text-white/60 text-sm">
              {this.state.error?.message || "Quelque chose s'est mal passé. Réessayez."}
            </p>
            <button
              onClick={this.handleReload}
              className="px-6 py-2 border border-white/20 rounded-full hover:bg-white/10 transition"
            >
              Recharger la page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
