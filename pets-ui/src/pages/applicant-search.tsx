import { Helmet } from 'react-helmet-async';
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import ApplicantSearchForm from '@/sections/applicant-search-form';
import "./applicant-search.scss"

export default function ApplicantSearchPage() {
  return (
    <body className="govuk-template__body">
    <Helmet>
      <title>Applicant Search</title>
    </Helmet>
    <Header/>
      <div className="govuk-width-container">
        <main className="govuk-main-wrapper">
          <h1 className="govuk-heading-l">Search for a visa applicant</h1>
          <p className="govuk-heading-s">Enter the applicant&apos;s passport number and the passport&apos;s country of issue.</p>
          <ApplicantSearchForm/>
        </main>
      </div>
      <Footer/>
    </body>
  );
}
