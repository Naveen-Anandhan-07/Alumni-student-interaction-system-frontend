import { Component } from "react";
import "../styles/LoadingState.css";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.log(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="loading-state">
          <div className="loading-card">
            <div className="loading-mark error-mark">!</div>
            <div>
              <h2>Something went wrong</h2>
              <p>Refresh the page or go back and try again.</p>
            </div>
            <button
              className="error-action"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
