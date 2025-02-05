import "./applicant-summary.scss";

import { Helmet } from "react-helmet-async";

import Breadcrumb, { IBreadcrumbItem } from "@/components/breadcrumb/breadcrumb";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import ApplicantReview from "@/sections/applicant-details-summary";

export default function ApplicantSummaryPage() {
  const breadcrumbItems: IBreadcrumbItem[] = [
    {
      text: "Home",
      href: "#",
    },
  ];

  return (
    <body className="govuk-template__body">
      <Helmet>
        <title> Applicant Details Summary</title>
      </Helmet>
      <Header />
      <div className="govuk-width-container">
        <Breadcrumb items={breadcrumbItems} />
        <main className="govuk-main-wrapper">
          <h1 className="govuk-heading-l">Check applicant details</h1>
          <ApplicantReview />
        </main>
      </div>
      <Footer />
    </body>
  );
}
