import "./spinner.scss";

import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function Spinner() {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => navigate("/sorry-there-is-problem-with-service"), 20000);
    return clearTimeout(timeout);
  }, [navigate]);

  return (
    <div id="spinner-container" data-testid="spinner-container">
      <div id="spinner-overlay" data-testid="spinner-overlay">
        <div id="spinner" data-testid="spinner" />
      </div>
    </div>
  );
}
