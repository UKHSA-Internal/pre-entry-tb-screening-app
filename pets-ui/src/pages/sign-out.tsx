import { useMsal } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";

import Button from "@/components/button/button";
import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";
import NotificationBanner from "@/components/notificationBanner/notificationBanner";
import { useAppSelector } from "@/redux/hooks";
import { selectNavigation } from "@/redux/store";
import { ButtonType } from "@/utils/enums";

export default function SignOutPage() {
  const navigate = useNavigate();
  const { instance } = useMsal();

  const handleSignOut = () => {
    instance
      .logoutRedirect({
        postLogoutRedirectUri: "/you-have-signed-out",
      })
      .catch((error) => {
        console.error("MSAL logout error: ", error);
        navigate("/error");
      });
  };

  const navigation = useAppSelector(selectNavigation);
  const backLinkTo = navigation.signOutPreviousPage ?? "/";

  return (
    <Container
      title="Sign out - Complete UK pre-entry health screening - GOV.UK"
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
            type={ButtonType.WARNING}
            text="Sign out"
            handleClick={handleSignOut}
          />
          <Button
            id="sign-out-cancel"
            type={ButtonType.SECONDARY}
            text="Go back to screening"
            handleClick={() => navigate(backLinkTo)}
          />
        </div>
      </NotificationBanner>
    </Container>
  );
}
