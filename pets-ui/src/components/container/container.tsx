import { ReactNode, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router";

import { useNavigationHistory } from "@/utils/useNavigationHistory";

import { useNavigationHistory } from "@/utils/useNavigationHistory";

import BackLink from "../backLink/backLink";
import CookieBanner from "../cookieBanner/cookieBanner";
import Footer from "../footer/footer";
import Header from "../header/header";
import PhaseBanner from "../phaseBanner/phaseBanner";
import SkipLink from "../skipLink/skipLink";

interface ContainerProps {
  title: string;
  backLinkTo?: string;
  children: ReactNode;
  feedbackUrl?: string;
  shouldClearHistory?: boolean;
  useTwoThirdsColumn?: boolean;
}

const Container = ({
  title,
  children,
  backLinkTo = "",
  shouldClearHistory = false,
  useTwoThirdsColumn = true,
}: Readonly<ContainerProps>) => {
  useNavigationHistory(shouldClearHistory);
  const pageStart = useRef<HTMLDivElement | null>(null);
  const mainContent = useRef<HTMLDivElement | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const target = location.hash.substring(1);
      if (target == "main-content") {
        mainContent.current?.focus({ preventScroll: true });
      }
    } else {
      pageStart.current?.focus({ preventScroll: true });
    }
  }, [location]);

  return (
    <div ref={pageStart}>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <CookieBanner />
      <SkipLink />
      <Header />
      <div className="govuk-width-container">
        <PhaseBanner />
        {backLinkTo && <BackLink fallbackUrl={backLinkTo} />}
        <main
          className="govuk-main-wrapper"
          id="main-content"
          role="main"
          ref={mainContent}
          tabIndex={-1}
        >
          {useTwoThirdsColumn ? (
            <div className="govuk-grid-row">
              <div className="govuk-grid-column-two-thirds">{children}</div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Container;
