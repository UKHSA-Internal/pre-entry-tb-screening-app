import "./autoSignoutModal.scss";

import { useMsal } from "@azure/msal-react";
import { useRef, useState } from "react";
import { useIdleTimer } from "react-idle-timer";
import { useNavigate } from "react-router";

import { ButtonClass } from "@/utils/enums";
import { setGoogleAnalyticsParams } from "@/utils/google-analytics-utils";

import Button from "../button/button";
import Heading from "../heading/heading";
import LinkLabel from "../linkLabel/LinkLabel";

const IDLE_DELAY = 1000 * 60 * 18;
const SIGN_OUT_DELAY = 1000 * 60 * 2;

export default function AutoSignoutModal() {
  const navigate = useNavigate();
  const { accounts, instance } = useMsal();
  const [showModal, setShowModal] = useState(false);

  const signOutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startSignOutTimer = () => {
    if (signOutTimerRef.current) return;
    signOutTimerRef.current = setTimeout(handleSignOut, SIGN_OUT_DELAY);
  };

  const cancelSignOutTimer = () => {
    if (signOutTimerRef.current != null) {
      clearTimeout(signOutTimerRef.current);
      signOutTimerRef.current = null;
    }
  };

  useIdleTimer({
    timeout: IDLE_DELAY,
    crossTab: true,
    onIdle: () => {
      if (accounts.length > 0) {
        setShowModal(true);
        startSignOutTimer();
      }
    },
  });

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

  return (
    showModal && (
      <div id="signout-modal-container" data-testid="signout-modal-container">
        <div id="signout-modal-overlay" data-testid="signout-modal-overlay">
          <div id="signout-modal" data-testid="signout-modal">
            <Heading title="You're about to be signed out" level={1} size="m" />
            <p className="govuk-body" style={{ margin: 0 }}>
              For your security, we will sign you out in <strong>2 minutes</strong>.
            </p>
            <Button
              id="stay-signed-in"
              class={ButtonClass.DEFAULT}
              text="Stay signed in"
              handleClick={() => {
                setShowModal(false);
                cancelSignOutTimer();
              }}
            />
            <br />
            <LinkLabel
              key="sign-out"
              className="govuk-link"
              style={{ fontSize: "19px" }}
              to="/"
              title="Sign out"
              externalLink={false}
              onClick={handleSignOut}
            />
          </div>
        </div>
      </div>
    )
  );
}
