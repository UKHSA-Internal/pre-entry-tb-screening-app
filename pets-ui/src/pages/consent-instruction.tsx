import { useEffect } from "react";
import { useNavigate } from "react-router";

import Button from "@/components/button/button";
import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";
import NotificationBanner from "@/components/notificationBanner/notificationBanner";
import { ButtonClass } from "@/utils/enums";
import { sendGoogleAnalyticsJourneyEvent } from "@/utils/google-analytics-utils";

export default function ConsentInstructionPage() {
  const navigate = useNavigate();

  useEffect(() => {
    sendGoogleAnalyticsJourneyEvent("get_written_consent", "UNK", "Visa Applicant Details");
  }, []);

  return (
    <Container title="Get written consent - Complete UK pre-entry health screening - GOV.UK">
      <NotificationBanner
        bannerTitle="Important"
        bannerHeading="You need the visa applicant's consent"
      />

      <Heading level={1} size="l" title="Get written consent" />
      <p className="govuk-body">
        The visa applicant (or their parent or guardian) must have signed a paper consent form
        before you start TB screening.
      </p>

      <Button
        id="search-again"
        class={ButtonClass.DEFAULT}
        text="Search again"
        handleClick={() => navigate("/search-for-visa-applicant")}
      />
    </Container>
  );
}
