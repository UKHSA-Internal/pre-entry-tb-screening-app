import React, { useEffect } from "react";

import Confirmation from "@/components/confirmation/confirmation";
import Container from "@/components/container/container";
import LinkLabel from "@/components/linkLabel/LinkLabel";
import { useAppSelector } from "@/redux/hooks";
import { selectApplication } from "@/redux/store";
import { sendGoogleAnalyticsJourneyEvent } from "@/utils/google-analytics-utils";

export default function CancellationConfirmationPage() {
  const applicationData = useAppSelector(selectApplication);

  const preWhatHappensNextElems = [
    `The visa applicant TB screening has been cancelled because ${applicationData.cancellationReason?.charAt(0).toLowerCase()}${applicationData.cancellationReason?.slice(1)}.`,
    <>
      The screening details have been saved in the{" "}
      <LinkLabel
        title="visa applicant's screening history"
        to="/screening-history"
        externalLink={false}
      />
      .
    </>,
  ];

  const furtherInfo = [
    <LinkLabel
      key="search"
      to="/search-for-visa-applicant"
      title="Search for another visa applicant"
      externalLink={false}
    />,
    <React.Fragment key="feedback">
      <LinkLabel
        to="https://forms.office.com/pages/responsepage.aspx?id=mRRO7jVKLkutR188-d6GZtaAaJfrhApCue13O2-oStFUNlIyRkRMWVBNQkszSTJISDJGU1pJTTkxNy4u&route=shorturl"
        title="What did you think of this service? (opens in new tab)"
        externalLink={true}
      />{" "}
      (takes 30 seconds)
    </React.Fragment>,
  ];

  useEffect(() => {
    sendGoogleAnalyticsJourneyEvent(
      "tb_screening_cancelled",
      applicationData.applicationId,
      "Cancel application",
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container title="TB screening cancelled - Complete UK pre-entry health screening - GOV.UK">
      <Confirmation
        confirmationText="TB screening cancelled"
        isSuccess={false}
        preWhatHappensNextElems={preWhatHappensNextElems}
        whatHappensNext={true}
        postWhatHappensNextText="If the visa applicant returns for a new screening, you will need to start again."
        furtherInfo={furtherInfo}
        showSearchForAnotherVisaApplicantLink={false}
      />
    </Container>
  );
}
