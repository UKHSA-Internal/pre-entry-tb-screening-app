import { useEffect } from "react";

import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";
import NotificationBanner from "@/components/notificationBanner/notificationBanner";
import { useAppSelector } from "@/redux/hooks";
import { selectApplication, selectTbCertificate } from "@/redux/store";
import TbSummary from "@/sections/tb-summary";
import { ApplicationStatus, YesOrNo } from "@/utils/enums";
import { sendGoogleAnalyticsJourneyEvent } from "@/utils/helpers";

export default function TbSummaryPage() {
  const applicationData = useAppSelector(selectApplication);
  const tbCertificateData = useAppSelector(selectTbCertificate);

  let backLinkUrl = "/enter-clinic-certificate-information";
  if (tbCertificateData.status === ApplicationStatus.COMPLETE) {
    backLinkUrl = "/tracker";
  } else if (tbCertificateData.isIssued === YesOrNo.NO) {
    backLinkUrl = "/why-are-you-not-issuing-certificate";
  }

  const pageTitle =
    tbCertificateData.isIssued === YesOrNo.NO
      ? "Check TB clearance outcome"
      : "Check certificate information";

  useEffect(() => {
    sendGoogleAnalyticsJourneyEvent(
      pageTitle,
      applicationData.applicationId,
      "TB certificate outcome",
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container
      title={pageTitle + " - Complete UK pre-entry health screening - GOV.UK"}
      backLinkTo={backLinkUrl}
    >
      {tbCertificateData.isIssued === YesOrNo.NO && (
        <NotificationBanner
          bannerTitle="Important"
          bannerText="If a visa applicant's chest X-rays indicate they have pulmonary TB, the panel physician must give them a referral letter and copies of the:"
          list={["chest X-ray", "radiology report", "medical record form"]}
        />
      )}
      <Heading level={1} size="l" title={pageTitle} />
      <TbSummary />
    </Container>
  );
}
