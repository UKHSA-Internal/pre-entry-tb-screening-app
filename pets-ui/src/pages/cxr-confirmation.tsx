import "./cxr-confirmation.scss";

import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";

import Breadcrumb, { IBreadcrumbItem } from "@/components/breadcrumb/breadcrumb";
import Button from "@/components/button/button";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import { ButtonType } from "@/utils/enums";

export default function CxrConfirmation() {
  const breadcrumbItems: IBreadcrumbItem[] = [
    {
      text: "Home",
      href: "#",
    },
  ];
  const navigate = useNavigate();

  return (
    <body className="govuk-template__body">
      <Helmet>
        <title> Medical Screening Confirmation</title>
      </Helmet>
      <Header />
      <div className="govuk-width-container">
        <Breadcrumb items={breadcrumbItems} />
        <main className="govuk-main-wrapper govuk-main-wrapper--l" id="main-content" role="main">
          <div className="govuk-grid-row">
            <div className="govuk-grid-column-two-thirds">
              <div className="govuk-panel govuk-panel--confirmation">
                <h1 className="govuk-panel__title">Chest X-ray information recorded</h1>
              </div>
              <h2 className="govuk-heading-m">What happens next</h2>
              <p className="govuk-body">
                You cannot currently log sputum test information in this service.
              </p>
              <p className="govuk-body">
                Continue to TB certificate declaration or go to{" "}
                <Link to={"/tracker"} className="govuk-link" style={{ color: "#1d70b8" }}>
                  TB screening progress tracker
                </Link>
                .
              </p>
              <Button
                id="continue"
                type={ButtonType.DEFAULT}
                text="Continue"
                href="/tb-declaration"
                handleClick={() => {
                  navigate("/tb-declaration");
                }}
              />
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </body>
  );
}
