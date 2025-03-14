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

const Container = ({ title, children, breadcrumbItems = [] }: ContainerProps) => {
  const mainContent = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      const target = location.hash.substring(1);
      const refMap: { [key: string]: HTMLElement | null } = {
        mainContent: mainContent.current,
      };

      const targetRef = refMap[target];
      if (targetRef) {
        targetRef.scrollIntoView();
      }
    }
  }, [location]);

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <SkipLink />
      <Header />
      <div className="govuk-width-container">
        {breadcrumbItems && <Breadcrumb items={breadcrumbItems} />}
        <main className="govuk-main-wrapper" id="main-content" role="main" ref={mainContent}>
          {children}
        </main>
      </div>
      <Footer />
    </>
  );
};

export default Container;
