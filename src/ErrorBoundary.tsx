import React, { type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error to an error reporting service if needed
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    const { hasError, error } = this.state;

    if (hasError) {
      return (
        <div style={{ padding: 32, color: "red" }}>
          <h2>Something went wrong.</h2>
          {error?.message && <pre>{error.message}</pre>}
        </div>
      );
    }

    return this.props.children;
  }
}
