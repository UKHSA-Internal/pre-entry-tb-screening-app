import { useNavigate } from "react-router-dom";

import Button from "@/components/button/button";
import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";
import NotificationBanner from "@/components/notificationBanner/notificationBanner";
import { ButtonType } from "@/utils/enums";

export default function ConsentInstructionPage() {
  const navigate = useNavigate();

  return (
    <Container title="Get written consent - Complete UK pre-entry health screening - GOV.UK">
      <NotificationBanner
        bannerTitle="Important"
        bannerText="You need the visa applicant's consent"
      />

      <Heading level={1} size="l" title="Get written consent" />
      <p className="govuk-body">
        The visa applicant (or their parent or guardian) must have signed a paper consent form
        before you start TB screening.
      </p>

      <Button
        id="search-again"
        type={ButtonType.DEFAULT}
        text="Search again"
        handleClick={() => navigate("/search-for-visa-applicant")}
      />
    </Container>
  );
}
