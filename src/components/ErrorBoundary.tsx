'use client';

import { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
  reportIssueUrl?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="mb-4 p-4 bg-red-50 rounded-2xl">
            <svg
              className="w-12 h-12 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Something went wrong
          </h3>

          <p className="text-sm text-gray-500 max-w-sm mb-6">
            {this.state.error?.message || 'An unexpected error occurred. Please try again.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={this.handleReset}
              className="
                px-5 py-2.5 bg-orange-500 text-white text-sm font-semibold
                rounded-xl hover:bg-orange-600 active:scale-[0.98]
                transition-all duration-150 shadow-sm
              "
            >
              Try Again
            </button>

            {this.props.reportIssueUrl && (
              <a
                href={this.props.reportIssueUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  px-5 py-2.5 text-gray-600 text-sm font-medium
                  rounded-xl hover:bg-gray-100 active:scale-[0.98]
                  transition-all duration-150
                "
              >
                Report Issue
              </a>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
