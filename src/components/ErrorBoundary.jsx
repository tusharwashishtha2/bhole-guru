import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 p-4 text-center">
                    <h1 className="text-3xl font-bold text-red-800 mb-4">Something went wrong.</h1>
                    <p className="text-red-600 mb-8">We apologize for the inconvenience. Please try refreshing the page.</p>
                    <details className="text-left bg-white p-4 rounded shadow-lg max-w-2xl overflow-auto border border-red-200">
                        <summary className="cursor-pointer font-bold text-red-700 mb-2">Error Details</summary>
                        <pre className="text-xs text-red-500 whitespace-pre-wrap">
                            {this.state.error && this.state.error.toString()}
                            <br />
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </pre>
                    </details>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-8 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Refresh Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
