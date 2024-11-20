import { Helmet } from 'react-helmet-async';
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import ApplicantForm from '@/sections/applicant-form';
import "./contact-details.scss"

export default function ContactDetailsPage() {
  return (
    <body className="govuk-template__body">
    <Helmet>
      <title> Applicant Details Form</title>
    </Helmet>
    <Header/>
      <div className="govuk-width-container">
        <main className="govuk-main-wrapper">
          <h1 className="govuk-heading-xl">Enter Applicant Details</h1>
          <ApplicantForm/>
        </main>
      </div>
      <Footer/>
    </body>
  );
}
