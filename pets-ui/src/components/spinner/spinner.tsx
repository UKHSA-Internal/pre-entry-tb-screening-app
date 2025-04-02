import "./spinner.scss";

import { useEffect } from "react";
import { useNavigate } from "react-router";

interface SpinnerProps {
  isLoading: boolean;
}

export default function Spinner(props: Readonly<SpinnerProps>) {
  const navigate = useNavigate();

  useEffect(() => {
    if (props.isLoading) {
      const timeout = setTimeout(() => navigate("/error"), 20000);
      return clearTimeout(timeout);
    }
  }, [navigate, props.isLoading]);

  return (
    <div id="spinner-container" data-testid="spinner-container">
      {props.isLoading && (
        <div id="spinner-overlay" data-testid="spinner-overlay">
          <div id="spinner" data-testid="spinner" />
        </div>
      )}
    </div>
  );
}
