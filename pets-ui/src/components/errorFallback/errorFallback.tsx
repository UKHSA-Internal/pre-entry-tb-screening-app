import { useEffect } from "react";
import { useNavigate } from "react-router";

import ErrorPage from "@/pages/error-page";

export default function ErrorFallback() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/error");
  }, [navigate]);

  return <ErrorPage />;
}
