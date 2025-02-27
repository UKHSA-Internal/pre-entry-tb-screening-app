import "./applicant-confirmation.scss";

import { Helmet } from "react-helmet-async";

import Breadcrumb, { IBreadcrumbItem } from "@/components/breadcrumb/breadcrumb";
import Confirmation from "@/components/confirmation/confirmation";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";

export default function ApplicantConfirmation() {
  const breadcrumbItems: IBreadcrumbItem[] = [
    {
      text: "Application progress tracker",
      href: "/tracker",
    },
  ];

  const furtherInfo = ["You can now add travel information for this applicant."];

  return (
    <body className="govuk-template__body">
      <Helmet>
        <title> Applicant Details Confirmation</title>
      </Helmet>
      <Header />
      <div className="govuk-width-container">
        <Breadcrumb items={breadcrumbItems} />
        <Confirmation
          confirmationText={"Applicant record created"}
          furtherInfo={furtherInfo}
          buttonText={"Continue to travel information"}
          buttonLink={"/travel-details"}
        />
      </div>
      <Footer />
    </body>
  );
}
