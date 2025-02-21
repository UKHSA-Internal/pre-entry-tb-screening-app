import "./travel-details.scss";

import { Helmet } from "react-helmet-async";

import Breadcrumb, { IBreadcrumbItem } from "@/components/breadcrumb/breadcrumb";
import Confirmation from "@/components/confirmation/confirmation";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";

export default function TravelConfirmation() {
  const breadcrumbItems: IBreadcrumbItem[] = [
    {
      text: "Home",
      href: "#",
    },
  ];
  const furtherInfo = [
    "The applicant is now ready to conduct their medical screening with the panel physician.",
  ];

  return (
    <body className="govuk-template__body">
      <Helmet>
        <title>Travel Details Confirmation</title>
      </Helmet>
      <Header />
      <div className="govuk-width-container">
        <Breadcrumb items={breadcrumbItems} />
        <Confirmation
          confirmationText={"Travel Information record created"}
          furtherInfo={furtherInfo}
          buttonText={"Continue to medical screening"}
          buttonLink={"/medical-screening"}
        />
      </div>
      <Footer />
    </body>
  );
}
