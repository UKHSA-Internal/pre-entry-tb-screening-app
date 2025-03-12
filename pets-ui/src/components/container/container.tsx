import { ReactNode } from "react";
import { Helmet } from "react-helmet-async";

import Breadcrumb, { IBreadcrumbItem } from "../breadcrumb/breadcrumb";
import Footer from "../footer/footer";
import Header from "../header/header";

interface ContainerProps {
  title: string;
  breadcrumbItems?: IBreadcrumbItem[];
  children: ReactNode;
}

const Container = ({ title, children, breadcrumbItems = [] }: ContainerProps) => {
  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
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
