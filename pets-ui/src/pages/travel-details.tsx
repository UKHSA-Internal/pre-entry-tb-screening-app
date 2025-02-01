import "./travel-details.scss";

import { Helmet } from "react-helmet-async";

import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import ApplicantTravelForm from "@/sections/applicant-travel-form";

export default function TravelDetailsPage() {
  return (
    <body className="govuk-template__body">
      <Helmet>
        <title> Applicant Travel Information Form</title>
      </Helmet>
      <Header />
      <div className="govuk-width-container">
        <main className="govuk-main-wrapper">
          <h1 className="govuk-heading-l">Travel Information</h1>
          <p className="govuk-body">Enter the applicant&apos;s travel information below.</p>
          <ApplicantTravelForm />
        </main>
      </div>
      <Footer />
    </body>
  );
}
