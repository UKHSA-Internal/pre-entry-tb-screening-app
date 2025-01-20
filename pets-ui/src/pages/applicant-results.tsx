import { Helmet } from 'react-helmet-async';
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import Breadcrumb, { IBreadcrumbItem } from "@/components/breadcrumb/breadcrumb";
import ApplicantEmptyResult from '@/sections/applicant-no-results';
import "./applicant-results.scss"

export default function ApplicantResultsPage() {
  const breadcrumbItems: IBreadcrumbItem[] = [
    {
      text: "Home",
      href: "#"
    }
  ]
  
  return (
    <body className="govuk-template__body">
      <Helmet>
        <title>Applicant Results</title>
      </Helmet>
      <Header/>
      <div className="govuk-width-container">
        <Breadcrumb items={breadcrumbItems}/>
        <ApplicantEmptyResult/>
      </div>
      <Footer/>
    </body>
  );
}
