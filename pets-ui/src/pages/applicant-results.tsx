import "./applicant-results.scss";

import { Helmet } from "react-helmet-async";

import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import ApplicantEmptyResult from "@/sections/applicant-no-results";

export default function ApplicantResultsPage() {
  return (
    <body className="govuk-template__body">
      <Helmet>
        <title>Applicant Results</title>
      </Helmet>
      <Header />
      <div className="govuk-width-container">
        <ApplicantEmptyResult />
      </div>
      <Footer />
    </body>
  );
}
