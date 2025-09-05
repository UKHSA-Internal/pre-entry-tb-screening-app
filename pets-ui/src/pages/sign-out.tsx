import { useNavigate } from "react-router-dom";

import Button from "@/components/button/button";
import Container from "@/components/container/container";
import { useAppSelector } from "@/redux/hooks";
import { selectNavigation } from "@/redux/store";
import { ButtonType } from "@/utils/enums";

export default function SignOutPage() {
  const navigate = useNavigate();

  const handleSignOut = () => {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < window.localStorage.length; i += 1) {
        const key = window.localStorage.key(i);
        if (key?.startsWith("msal.")) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => window.localStorage.removeItem(k));
    } catch (e) {
      console.error("Sign out error: ", e);
      navigate("/error");
      return;
    }
    window.location.replace("/signed-out");
  };

  const navigation = useAppSelector(selectNavigation);
  const backLinkTo = navigation.signOutPreviousPage ?? "/";

  return (
    <Container
      title="Sign out - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo={backLinkTo}
    >
      <div className="govuk-grid-row govuk-!-margin-top-4">
        <div className="govuk-grid-column-two-thirds">
          <section
            className="govuk-notification-banner"
            aria-labelledby="sign-out-banner-title"
            data-module="govuk-notification-banner"
          >
            <div className="govuk-notification-banner__header">
              <h2 className="govuk-notification-banner__title" id="sign-out-banner-title">
                Important
              </h2>
            </div>
            <div className="govuk-notification-banner__content">
              <h3 className="govuk-notification-banner__heading">
                Are you sure you want to sign out?
              </h3>
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
            </div>
          </section>
        </div>
      </div>
    </Container>
  );
}
