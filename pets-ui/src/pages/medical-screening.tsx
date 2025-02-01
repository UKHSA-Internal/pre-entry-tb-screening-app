import "./medical-screening.scss";

import { Helmet } from "react-helmet-async";

import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import MedicalScreeningForm from "@/sections/medical-screening-form";

export default function MedicalScreeningPage() {
  return (
    <body className="govuk-template__body">
      <Helmet>
        <title>Medical Screening Form</title>
      </Helmet>
      <Header />
      <div className="govuk-width-container">
        <main className="govuk-main-wrapper">
          <h1 className="govuk-heading-l">Medical Screening</h1>
          <p className="govuk-body">
            Enter the applicant&apos;s profile information. You should answer every question.
          </p>
          <MedicalScreeningForm />
        </main>
      </div>
      <Footer />
    </body>
  );
}
