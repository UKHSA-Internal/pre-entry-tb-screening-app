import { ReactNode } from "react";
import { Helmet } from "react-helmet-async";

import Breadcrumb, { IBreadcrumbItem } from "../breadcrumb/breadcrumb";
import Footer from "../footer/footer";
import Header from "../header/header";
import SkipLink from "../skipLink/skipLink";

interface ContainerProps {
  title: string;
  breadcrumbItems?: IBreadcrumbItem[];
  children: ReactNode;
  skipLinkHref: string;
}

const Container = ({
  title,
  children,
  breadcrumbItems = [],
  skipLinkHref = "",
}: ContainerProps) => {
  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <SkipLink href={skipLinkHref} />
      <Header />
      <div className="govuk-width-container">
        {breadcrumbItems && <Breadcrumb items={breadcrumbItems} />}
        <main className="govuk-main-wrapper" id="main-content" role="main">
          {children}
        </main>
      </div>
      <Footer />
    </>
  );
};

export default Container;
