import { ReactNode, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

import Breadcrumb, { IBreadcrumbItem } from "../breadcrumb/breadcrumb";
import Footer from "../footer/footer";
import Header from "../header/header";
import SkipLink from "../skipLink/skipLink";

interface ContainerProps {
  title: string;
  breadcrumbItems?: IBreadcrumbItem[];
  children: ReactNode;
}

const Container = ({ title, children, breadcrumbItems = [] }: Readonly<ContainerProps>) => {
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
      <SkipLink />
      <Header />
      <div className="govuk-width-container">
        {breadcrumbItems && <Breadcrumb items={breadcrumbItems} />}
        <main
          className="govuk-main-wrapper"
          id="main-content"
          role="main"
          ref={mainContent}
          tabIndex={-1}
        >
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Container;
