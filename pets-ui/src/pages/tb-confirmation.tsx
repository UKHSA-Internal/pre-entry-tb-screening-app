import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Confirmation from "@/components/confirmation/confirmation";
import Container from "@/components/container/container";
import LinkLabel from "@/components/linkLabel/LinkLabel";
import { useAppSelector } from "@/redux/hooks";
import { selectApplication, selectTbCertificate } from "@/redux/store";
import { YesOrNo } from "@/utils/enums";
import { sendGoogleAnalyticsJourneyEvent } from "@/utils/helpers";

export default function TbConfirmationPage() {
  const navigate = useNavigate();
  const applicationData = useAppSelector(selectApplication);
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

  useEffect(() => {
    sendGoogleAnalyticsJourneyEvent(
      "tb_clearance_complete",
      applicationData.applicationId,
      "TB certificate outcome",
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container title="TB screening complete - Complete UK pre-entry health screening - GOV.UK">
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
        secondaryButton={
          isCertificateIssued
            ? {
                text: "Check or change certificate information",
                onClick: () => navigate("/tb-certificate-summary?from=/tb-screening-complete"),
              }
            : undefined
        }
      />
    </Container>
  );
}
