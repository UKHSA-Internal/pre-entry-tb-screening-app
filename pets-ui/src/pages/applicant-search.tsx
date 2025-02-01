import "./applicant-search.scss";

import { Helmet } from "react-helmet-async";

import Breadcrumb, { IBreadcrumbItem } from "@/components/breadcrumb/breadcrumb";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import ApplicantSearchForm from "@/sections/applicant-search-form";

export default function ApplicantSearchPage() {
  const breadcrumbItems: IBreadcrumbItem[] = [
    {
      text: "Home",
      href: "/",
    },
    {
      text: "Applicant Search",
      href: "#",
    },
  ];

  return (
    <body className="govuk-template__body">
      <Helmet>
        <title>Applicant Search</title>
      </Helmet>
      <Header />
      <div className="govuk-width-container">
        <Breadcrumb items={breadcrumbItems} />
        <main className="govuk-main-wrapper">
          <h1 className="govuk-heading-l">Search for a visa applicant</h1>
          <p className="govuk-heading-s">
            Enter the applicant&apos;s passport number and the passport&apos;s country of issue.
          </p>
          <ApplicantSearchForm />
        </main>
      </div>
      <Footer />
    </body>
  );
}
