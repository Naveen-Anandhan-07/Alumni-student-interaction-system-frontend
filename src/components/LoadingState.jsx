import "../styles/LoadingState.css";

function LoadingState({ title = "Loading data", subtitle = "Please wait while we prepare your workspace." }) {
  return (
    <div className="loading-state">
      <div className="loading-card">
        <div className="loading-mark">
          <span></span>
        </div>

        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>

        <div className="loading-skeleton">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
}

export default LoadingState;
