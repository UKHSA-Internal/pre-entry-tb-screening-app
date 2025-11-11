import { useEffect, useState } from "react";

import { ButtonClass } from "@/utils/enums";
import { updateGoogleAnalyticsConsent } from "@/utils/helpers";

import Button from "../button/button";
import Heading from "../heading/heading";
import LinkLabel from "../linkLabel/LinkLabel";

export default function CookieBanner() {
  const [cookieConsent, setCookieConsent] = useState(localStorage.getItem("cookie-consent"));
  const [showCookieMessage, setShowCookieMessage] = useState(false);

  useEffect(() => {
    if (cookieConsent) {
      localStorage.setItem("cookie-consent", cookieConsent);
    }
  }, [cookieConsent]);

  if (cookieConsent && !showCookieMessage) {
    return null;
  } else if (!cookieConsent) {
    return (
      <section
        className="govuk-cookie-banner"
        data-nosnippet
        aria-label="Cookies on Complete UK pre-entry health screening"
      >
        <div className="govuk-cookie-banner__message govuk-width-container">
          <div className="govuk-grid-row">
            <div className="govuk-grid-column-two-thirds">
              <Heading
                title="Cookies on Complete UK pre-entry health screening"
                additionalClasses="govuk-cookie-banner__heading"
                level={2}
                size="m"
              />
              <div className="govuk-cookie-banner__content">
                <p className="govuk-body">
                  We use some essential cookies to make this service work.
                </p>
                <p className="govuk-body">
                  We would also like to use analytics cookies so we can understand how you use the
                  service and make improvements.
                </p>
              </div>
            </div>
          </div>
          <div className="govuk-button-group">
            <Button
              id="accept-analytics-cookies"
              text="Accept analytics cookies"
              class={ButtonClass.DEFAULT}
              handleClick={() => {
                setCookieConsent("accepted");
                setShowCookieMessage(true);
                updateGoogleAnalyticsConsent(true);
              }}
            />
            <Button
              id="reject-analytics-cookies"
              text="Reject analytics cookies"
              class={ButtonClass.DEFAULT}
              handleClick={() => {
                setCookieConsent("rejected");
                setShowCookieMessage(true);
                updateGoogleAnalyticsConsent(false);
              }}
            />
            <LinkLabel
              title="View cookies"
              to="/cookies"
              externalLink={false}
              className="govuk-link"
            />
          </div>
        </div>
      </section>
    );
  } else {
    return (
      <section
        className="govuk-cookie-banner"
        data-nosnippet
        aria-label="Cookies on Complete UK pre-entry health screening"
      >
        <div className="govuk-cookie-banner__message govuk-width-container">
          <div className="govuk-grid-row">
            <div className="govuk-grid-column-two-thirds">
              <div className="govuk-cookie-banner__content">
                <p className="govuk-body">
                  You have {cookieConsent} analytics cookies. You can{" "}
                  <LinkLabel
                    title="change your cookie settings"
                    to="/cookies"
                    externalLink={false}
                    className="govuk-link"
                  />{" "}
                  at any time.
                </p>
              </div>
            </div>
          </div>
          <div className="govuk-button-group">
            <Button
              id="hide-cookie-message"
              text="Hide cookie message"
              class={ButtonClass.DEFAULT}
              handleClick={() => {
                setShowCookieMessage(false);
              }}
            />
          </div>
        </div>
      </section>
    );
  }
}
