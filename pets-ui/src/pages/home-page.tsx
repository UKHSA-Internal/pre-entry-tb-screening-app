import { useMsal } from "@azure/msal-react";
import { useEffect } from "react";

import { loginRequest } from "@/auth/auth";
import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";
import List from "@/components/list/list";
import StartButton from "@/components/startButton/startButton";
import { clearNavigationHistory } from "@/utils/useNavigationHistory";

export default function HomePage() {
  const { instance } = useMsal();

  useEffect(() => {
    clearNavigationHistory();
  }, []);

  const initializeSignIn = () => {
    instance
      .loginRedirect({
        scopes: loginRequest.scopes,
        storeInCache: loginRequest.storeInCache,
      })
      .catch(() => new Error("Failed to initialize sign in"));
  };

  return (
    <Container title="Complete UK pre-entry health screening - GOV.UK">
      <Heading level={1} size="l" title="Complete a UK visa applicant's TB screening" />
      <p className="govuk-body">
        Authorised staff can use this service to view, enter and update tuberculosis (TB) screening
        information for UK visa applicants.
      </p>
      <Heading level={2} size="m" title="Before you start" />
      <p className="govuk-body">
        You must have the visa applicant&apos;s written consent for TB screening (or the consent of
        their parent or legal guardian).
      </p>
      <p className="govuk-body">
        The visa applicant must have a valid passport. You will need the passport number and country
        of issue.
      </p>
      <Heading level={2} size="m" title="To complete the screening" />
      <p className="govuk-body">You will need the visa applicant&apos;s:</p>
      <List
        items={[
          "medical history, for example symptoms of pulmonary TB",
          "X-ray images or sputum sample results",
        ]}
      />
      <StartButton id="sign-in" text="Sign in" handleClick={initializeSignIn} />
      <p className="govuk-body">
        Use the username you set up when you were given access to the service.
      </p>
    </Container>
  );
}
