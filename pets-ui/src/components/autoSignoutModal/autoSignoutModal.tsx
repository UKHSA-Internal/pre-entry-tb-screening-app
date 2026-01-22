import "./autoSignoutModal.scss";

import { useMsal } from "@azure/msal-react";
import { useState } from "react";
import { useIdleTimer } from "react-idle-timer";

import { ButtonClass } from "@/utils/enums";

import Button from "../button/button";
import Heading from "../heading/heading";
import LinkLabel from "../linkLabel/LinkLabel";

export default function AutoSignoutModal() {
  const { accounts } = useMsal();
  const [showModal, setShowModal] = useState(false);

  useIdleTimer({
    timeout: 1000 * 60 * 18,
    crossTab: true,
    onIdle: () => {
      if (accounts.length > 0) {
        setShowModal(true);
        // start normal timer, sign out after 2 mins
      }
    },
  });

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
                // reset normal timer
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
              onClick={() => {
                // sign out flow
              }}
            />
          </div>
        </div>
      </div>
    )
  );
}
