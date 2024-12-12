import { Helmet } from 'react-helmet-async';
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import Breadcrumb, { IBreadcrumbItem } from "@/components/breadcrumb/breadcrumb";
import ApplicantTravelForm from '@/sections/applicant-travel-form';
import "./travel-details.scss"

export default function TravelDetailsPage() {
  const breadcrumbItems: IBreadcrumbItem[] = [
    {
      text: "Home",
      href: "#"
    },
    {
      text: "New Applicant",
      href: "#"
    },
  ]
  
  return (
    <body className="govuk-template__body">
    <Helmet>
      <title> Applicant Travel Information Form</title>
    </Helmet>
    <Header/>
      <div className="govuk-width-container">
        <Breadcrumb items={breadcrumbItems}/>
        <main className="govuk-main-wrapper">
          <h1 className="govuk-heading-l">Travel Information</h1>
          <p className="govuk-body">Enter the applicant&apos;s travel information below.</p>
          <ApplicantTravelForm/>
        </main>
      </div>
      <Footer/>
    </body>
  );
}
