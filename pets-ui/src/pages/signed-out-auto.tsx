import { useNavigate } from "react-router";

import Button from "@/components/button/button";
import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";
import { ButtonClass } from "@/utils/enums";

export default function AutoSignedOutPage() {
  const navigate = useNavigate();

  return (
    <Container title="You have been signed out - Complete UK pre-entry health screening - GOV.UK">
      <Heading level={1} size="l" title="You have been signed out" />
      <p className="govuk-body ">Your session was inactive for 20 minutes.</p>
      <p className="govuk-body ">
        If you completed a section and viewed a confirmation page, we saved your answers. Any
        information you did not submit has been deleted.
      </p>
      <p className="govuk-body ">You need to sign in to continue or start a new screening.</p>
      <Button
        id="sign-in"
        class={ButtonClass.DEFAULT}
        text="Sign in"
        handleClick={() => {
          navigate("/");
        }}
      />
    </Container>
  );
}
