import "./medical-screening-summary.scss";

import { Helmet } from "react-helmet-async";

import Breadcrumb, { IBreadcrumbItem } from "@/components/breadcrumb/breadcrumb";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import MedicalScreeningReview from "@/sections/medical-screening-summary";

export default function MedicalSummaryPage() {
  const breadcrumbItems: IBreadcrumbItem[] = [
    {
      text: "Home",
      href: "#",
    },
  ];

  return (
    <body className="govuk-template__body">
      <Helmet>
        <title> Medical Screening Summary</title>
      </Helmet>
      <Header />
      <div className="govuk-width-container">
        <Breadcrumb items={breadcrumbItems} />
        <main className="govuk-main-wrapper">
          <h1 className="govuk-heading-l">Check medical screening</h1>
          <MedicalScreeningReview />
        </main>
      </div>
      <Footer />
    </body>
  );
}
