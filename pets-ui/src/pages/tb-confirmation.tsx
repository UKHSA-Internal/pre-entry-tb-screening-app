import React from "react";

import Button from "@/components/button/button";
import Container from "@/components/container/container";
import LinkLabel from "@/components/linkLabel/LinkLabel";
import { useAppSelector } from "@/redux/hooks";
import { selectTbCertificate } from "@/redux/tbCertificateSlice";
import { ButtonType, YesOrNo } from "@/utils/enums";

export default function TbConfirmationPage() {
  const tbCertificateData = useAppSelector(selectTbCertificate);

  const isCertificateIssued = tbCertificateData.isIssued === YesOrNo.YES;

  const panelStyles: React.CSSProperties = {
    marginBottom: "40px",
  };

  const warningPanelStyles: React.CSSProperties = {
    backgroundColor: "#d4351c",
    border: "5px solid #d4351c",
  };

  const panelTitleStyles: React.CSSProperties = {
    marginBlock: "30px",
    marginInline: "20px",
    color: "white",
  };

  const panelBodyStyles: React.CSSProperties = {
    color: "white",
    fontSize: "1.2rem",
  };

  const referenceNumberStyles: React.CSSProperties = {
    fontSize: "1.5rem",
  };

  const actionButtonStyles: React.CSSProperties = {
    marginBottom: "20px",
  };

  return (
    <Container title="TB screening complete" backLinkTo="/tb-certificate-summary">
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <div
            className={`govuk-panel ${
              isCertificateIssued ? "govuk-panel--confirmation" : "govuk-panel--warning"
            }`}
            style={{
              ...panelStyles,
              ...(isCertificateIssued ? {} : warningPanelStyles),
            }}
          >
            <h1 className="govuk-panel__title" style={panelTitleStyles}>
              TB screening complete
              <br />
              {isCertificateIssued ? "Certificate issued" : "Certificate not issued"}
            </h1>
            {isCertificateIssued && tbCertificateData.certificateNumber && (
              <div className="govuk-panel__body" style={panelBodyStyles}>
                Certificate reference number
                <br />
                <strong style={referenceNumberStyles}>{tbCertificateData.certificateNumber}</strong>
              </div>
            )}
          </div>

          <p className="govuk-body">The visa applicant TB screening is complete.</p>

          <h2 className="govuk-heading-m">What happens next</h2>
          <p className="govuk-body">We&apos;ve sent the certificate information to UKHSA.</p>

          {isCertificateIssued && (
            <div style={actionButtonStyles}>
              <Button
                id="view-certificate"
                type={ButtonType.DEFAULT}
                text="View or print certificate"
                handleClick={() => {
                  console.info("View certificate clicked");
                }}
              />
            </div>
          )}

          <p className="govuk-body">
            <LinkLabel
              to="/tracker"
              title="View a summary for this visa applicant"
              externalLink={false}
            />
          </p>

          <p className="govuk-body">
            <LinkLabel
              to="/applicant-search"
              title="Search for another visa applicant"
              externalLink={false}
            />
          </p>

          <p className="govuk-body">
            <LinkLabel
              to="https://forms.office.com/pages/responsepage.aspx?id=mRRO7jVKLkutR188-d6GZtaAaJfrhApCue13O2-oStFUNlIyRkRMWVBNQkszSTJISDJGU1pJTTkxNy4u&route=shorturl"
              title="What did you think of this service?"
              externalLink={true}
            />{" "}
            (takes 30 seconds)
          </p>
        </div>
      </div>
    </Container>
  );
}
