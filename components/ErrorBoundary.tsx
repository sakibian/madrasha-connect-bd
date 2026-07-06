import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-white px-6">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-red-50 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={32} className="text-red-500" />
            </div>
            <h1 className="text-2xl font-bold mb-3">সাময়িক সমস্যা</h1>
            <p className="text-gray-500 mb-8 leading-relaxed">
              একটি প্রযুক্তিগত ত্রুটি ঘটেছে। আমাদের টিম ইতিমধ্যে বিষয়টি সম্পর্কে জ্ঞাত রয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।
            </p>
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 text-sm font-bold hover:bg-gray-800 transition-colors"
            >
              <RefreshCw size={16} />
              আবার চেষ্টা করুন
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
