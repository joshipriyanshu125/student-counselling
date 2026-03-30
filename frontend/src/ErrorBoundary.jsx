import React from "react";

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: "20px", color: "red", backgroundColor: "#fee" }}>
                    <h1>Application Error</h1>
                    <pre>{this.state.error?.toString()}</pre>
                    <pre style={{ whiteSpace: "pre-wrap" }}>{this.state.error?.stack}</pre>
                </div>
            );
        }
        return this.props.children;
    }
}
