import { useMsal } from "@azure/msal-react";
import { useNavigate, useSearchParams } from "react-router";

import Button from "@/components/button/button";
import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";
import NotificationBanner from "@/components/notificationBanner/notificationBanner";
import { ButtonClass } from "@/utils/enums";
import { setGoogleAnalyticsParams } from "@/utils/google-analytics-utils";
import { useNavigationHistory } from "@/utils/useNavigationHistory";

export default function SignOutPage() {
  const navigate = useNavigate();
  const { goBack } = useNavigationHistory();
  const { instance } = useMsal();

  const handleSignOut = () => {
    setGoogleAnalyticsParams("user_properties", {
      user_role: undefined,
      clinic_id: undefined,
    });
    instance
      .logoutRedirect({
        postLogoutRedirectUri: "/you-have-signed-out",
      })
      .catch((error) => {
        console.error("MSAL logout error: ", error);
        navigate("/sorry-there-is-problem-with-service");
      });
  };

  const [searchParams] = useSearchParams();
  if (searchParams.get("skipSignOutCheck") == "true") {
    handleSignOut();
  }

  const backLinkTo = "/";

  return (
    <Container
      title="Are you sure you want to sign out? - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo={backLinkTo}
    >
      <NotificationBanner bannerTitle="Important">
        <Heading level={3} size="m" title="Are you sure you want to sign out?"></Heading>
        <p className="govuk-body govuk-!-font-size-19 govuk-!-margin-bottom-2">
          Signing out will lose any unsaved information.
        </p>
        <div className="govuk-button-group">
          <Button
            id="sign-out-confirm"
            class={ButtonClass.WARNING}
            text="Sign out"
            handleClick={handleSignOut}
          />
          <Button
            id="sign-out-cancel"
            class={ButtonClass.SECONDARY}
            text="Go back to screening"
            handleClick={() => goBack(backLinkTo)}
          />
        </div>
      </NotificationBanner>
    </Container>
  );
}
