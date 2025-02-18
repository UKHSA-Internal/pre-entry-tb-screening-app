import "./cxr-confirmation.scss";

import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

import Breadcrumb, { IBreadcrumbItem } from "@/components/breadcrumb/breadcrumb";
import Confirmation from "@/components/confirmation/confirmation";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";

export default function CxrConfirmation() {
  const breadcrumbItems: IBreadcrumbItem[] = [
    {
      text: "Home",
      href: "#",
    },
  ];

  const furtherInfo = [
    "You cannot currently log sputum test information in this service.",
    <>
      Continue to TB certificate declaration or go to{" "}
      <Link to={"/tracker"} className="govuk-link" style={{ color: "#1d70b8" }}>
        TB screening progress tracker
      </Link>
      .
    </>,
  ];

  return (
    <body className="govuk-template__body">
      <Helmet>
        <title> Medical Screening Confirmation</title>
      </Helmet>
      <Header />
      <div className="govuk-width-container">
        <Breadcrumb items={breadcrumbItems} />
        <Confirmation
          confirmationText={"Chest X-ray information recorded"}
          furtherInfo={furtherInfo}
          buttonText={"Continue"}
          buttonLink={"/tb-declaration"}
        />
      </div>
      <Footer />
    </body>
  );
}
