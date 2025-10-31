import React from "react";
import { useNavigate } from "react-router-dom";

import Confirmation from "@/components/confirmation/confirmation";
import Container from "@/components/container/container";
import LinkLabel from "@/components/linkLabel/LinkLabel";
import { useAppSelector } from "@/redux/hooks";
import { selectTbCertificate } from "@/redux/store";
import { YesOrNo } from "@/utils/enums";

export default function TbConfirmationPage() {
  const navigate = useNavigate();
  const tbCertificateData = useAppSelector(selectTbCertificate);

  const isCertificateIssued = tbCertificateData.isIssued === YesOrNo.YES;

  const furtherInfo = [
    <LinkLabel
      key="tracker"
      to="/tracker"
      title="View a summary for this visa applicant"
      externalLink={false}
    />,
    <LinkLabel
      key="search"
      to="/search-for-visa-applicant"
      title="Search for another visa applicant"
      externalLink={false}
    />,
    <React.Fragment key="feedback">
      <LinkLabel
        to="https://forms.office.com/pages/responsepage.aspx?id=mRRO7jVKLkutR188-d6GZtaAaJfrhApCue13O2-oStFUNlIyRkRMWVBNQkszSTJISDJGU1pJTTkxNy4u&route=shorturl"
        title="What did you think of this service?"
        externalLink={true}
      />{" "}
      (takes 30 seconds)
    </React.Fragment>,
  ];

  return (
    <Container
      title="TB screening complete - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo="/tb-certificate-summary"
    >
      <Confirmation
        confirmationText={
          isCertificateIssued
            ? "TB screening complete\nCertificate issued"
            : "TB screening complete\nCertificate not issued"
        }
        isSuccess={isCertificateIssued}
        showApplicationNumber={isCertificateIssued}
        applicationNumber={tbCertificateData.certificateNumber}
        preWhatHappensNextText="The visa applicant TB screening is complete."
        whatHappensNext={true}
        postWhatHappensNextText="We've sent the certificate information to UKHSA."
        furtherInfo={furtherInfo}
        showSearchForAnotherVisaApplicantLink={false}
        actionButton={
          isCertificateIssued
            ? {
                text: "View or print certificate",
                onClick: () => {
                  navigate("/tb-clearance-certificate");
                },
              }
            : undefined
        }
      />
    </Container>
  );
}
