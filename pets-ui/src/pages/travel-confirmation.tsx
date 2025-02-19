import "./travel-details.scss";

import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

import Breadcrumb, { IBreadcrumbItem } from "@/components/breadcrumb/breadcrumb";
import Button from "@/components/button/button";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import { ButtonType } from "@/utils/enums";

export default function TravelConfirmation() {
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
        <title>Travel Details Confirmation</title>
      </Helmet>
      <Header />
      <div className="govuk-width-container">
        <Breadcrumb items={breadcrumbItems} />
        <main className="govuk-main-wrapper govuk-main-wrapper--l" id="main-content" role="main">
          <div className="govuk-grid-row">
            <div className="govuk-grid-column-two-thirds">
              <div className="govuk-panel govuk-panel--confirmation">
                <h1 className="govuk-panel__title">Travel Information record created</h1>
              </div>
              <h2 className="govuk-heading-m">What happens next</h2>
              <p className="govuk-body">
                The applicant is now ready to conduct their medical screening with the panel
                physician.
              </p>
              <Button
                id="continue"
                type={ButtonType.DEFAULT}
                text="Continue to medical screening"
                href="/medical-screening"
                handleClick={() => {
                  navigate("/medical-screening");
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
