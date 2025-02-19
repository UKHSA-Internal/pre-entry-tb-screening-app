import "./applicant-confirmation.scss";

import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

import Breadcrumb, { IBreadcrumbItem } from "@/components/breadcrumb/breadcrumb";
import Button from "@/components/button/button";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import { ButtonType } from "@/utils/enums";

export default function ApplicantConfirmation() {
  const breadcrumbItems: IBreadcrumbItem[] = [
    {
      text: "Application progress tracker",
      href: "/tracker",
    },
  ];
  const navigate = useNavigate();

  return (
    <body className="govuk-template__body">
      <Helmet>
        <title> Applicant Details Confirmation</title>
      </Helmet>
      <Header />
      <div className="govuk-width-container">
        <Breadcrumb items={breadcrumbItems} />
        <main className="govuk-main-wrapper govuk-main-wrapper--l" id="main-content" role="main">
          <div className="govuk-grid-row">
            <div className="govuk-grid-column-two-thirds">
              <div className="govuk-panel govuk-panel--confirmation">
                <h1 className="govuk-panel__title">Applicant record created</h1>
              </div>
              <h2 className="govuk-heading-m">What happens next</h2>
              <p className="govuk-body">You can now add travel information for this applicant.</p>
              <Button
                id="continue"
                type={ButtonType.DEFAULT}
                text="Continue to travel information"
                href="/travel-details"
                handleClick={() => {
                  navigate("/travel-details");
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
