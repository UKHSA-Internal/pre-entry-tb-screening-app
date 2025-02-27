import "./medical-screening-confirmation.scss";

import { Helmet } from "react-helmet-async";

import Breadcrumb, { IBreadcrumbItem } from "@/components/breadcrumb/breadcrumb";
import Confirmation from "@/components/confirmation/confirmation";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";

export default function MedicalConfirmation() {
  const breadcrumbItems: IBreadcrumbItem[] = [
    {
      text: "Application progress tracker",
      href: "/tracker",
    },
  ];

  const furtherInfo = ["The applicant is now ready to conduct their chest x-ray or sputum test."];

  return (
    <body className="govuk-template__body">
      <Helmet>
        <title> Medical Screening Confirmation</title>
      </Helmet>
      <Header />
      <div className="govuk-width-container">
        <Breadcrumb items={breadcrumbItems} />
        <Confirmation
          confirmationText={"Medical screening record created"}
          furtherInfo={furtherInfo}
          buttonText={"Continue to chest x-ray"}
          buttonLink={"/chest-xray-question"}
        />
      </div>
      <Footer />
    </body>
  );
}
