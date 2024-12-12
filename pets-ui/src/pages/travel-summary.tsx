import { Helmet } from 'react-helmet-async';
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import TravelReview from '@/sections/applicant-travel-summary';
import "./travel-summary.scss"

export default function TravelSummaryPage() {
  return (
    <body className="govuk-template__body">
    <Helmet>
      <title> Applicant Travel Information Form</title>
    </Helmet>
    <Header/>
      <div className="govuk-width-container">
        <main className="govuk-main-wrapper">
          <h1 className="govuk-heading-l">Check travel information</h1>
          <TravelReview/>
        </main>
      </div>
      <Footer/>
    </body>
  );
}
