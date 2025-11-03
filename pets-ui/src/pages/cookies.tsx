import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import Button from "@/components/button/button";
import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";
import LinkLabel from "@/components/linkLabel/LinkLabel";
import List from "@/components/list/list";
import NotificationBanner from "@/components/notificationBanner/notificationBanner";
import Radio from "@/components/radio/radio";
import Table from "@/components/table/table";
import { ButtonType, RadioIsInline, YesOrNo } from "@/utils/enums";

export default function CookiesPage() {
  const methods = useForm<{ cookieConsent: YesOrNo }>({ reValidateMode: "onSubmit" });
  const { handleSubmit } = methods;

  const [cookieConsent, setCookieConsent] = useState(localStorage.getItem("cookie-consent"));
  const [showSubmissionBanner, setShowSubmissionBanner] = useState(false);

  const onSubmit: SubmitHandler<{ cookieConsent: YesOrNo }> = (data) => {
    if (data.cookieConsent == YesOrNo.YES) {
      setCookieConsent("accepted");
      setShowSubmissionBanner(true);
    } else if (data.cookieConsent == YesOrNo.NO) {
      setCookieConsent("rejected");
      setShowSubmissionBanner(true);
    }
  };

  useEffect(() => {
    if (cookieConsent) {
      localStorage.setItem("cookie-consent", cookieConsent);
    }
  }, [cookieConsent]);

  return (
    <Container title="Cookies - Complete UK pre-entry health screening - GOV.UK" backLinkTo="/">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {showSubmissionBanner && (
            <NotificationBanner bannerTitle="Success" successBanner>
              <p className="govuk-notification-banner__heading">
                You&apos;ve set your cookie preferences.{" "}
                <LinkLabel
                  title="Go back to the page you were looking at"
                  to=""
                  externalLink={false}
                  className="govuk-notification-banner__link"
                />
                .
              </p>
            </NotificationBanner>
          )}
          <Heading level={1} size="xl" title="Cookies" />
          <p className="govuk-body">
            Cookies are small files saved on your phone, tablet or computer when you visit a
            website.
          </p>
          <p className="govuk-body">
            We use cookies to make this site work and collect information about how you use our
            service.
          </p>
          <Heading level={2} size="l" title="Essential cookies" />
          <p className="govuk-body">
            Essential cookies keep your information secure while you use this service. We do not
            need to ask permission to use them.
          </p>
          <Table
            title="Essential cookies we use"
            columnHeaders={["Name", "Purpose", "Expires"]}
            tableRows={[
              {
                rowTitle: "session_cookie",
                cells: ["Used to keep you signed in", "20 hours"],
              },
              {
                rowTitle: "Server Load Balancer Cookies",
                cells: ["Used by the server to handle traffic", "End of session"],
              },
              {
                rowTitle: "cookie_policy",
                cells: ["Saves your cookie consent settings", "1 year"],
              },
            ]}
          />
          <Heading level={2} size="l" title="Analytics cookies (optional)" />
          <p className="govuk-body">
            With your permission, we use Google Analytics to collect data about how you use Complete
            UK pre-entry health screening. This information helps us to improve our service.
          </p>
          <p className="govuk-body">
            We use Google Analytics cookies to collect information about:
          </p>
          <List
            items={[
              "how you got to our service",
              "the pages you visit on our service and how long you spend on them",
              "any errors you see while using our service",
            ]}
          />
          <Table
            title="Google Analytics cookies we use"
            columnHeaders={["Name", "Purpose", "Expires"]}
            tableRows={[
              {
                rowTitle: "_gat",
                cells: ["These help to regulate requests", "1 minute"],
              },
              {
                rowTitle: "_ga",
                cells: ["Used by the server to handle traffic", "End of session"],
              },
              {
                rowTitle: "_gid",
                cells: ["Saves your cookie consent settings", "1 year"],
              },
            ]}
          />
          <Radio
            id="accept-analytics-cookies"
            heading="Do you want to accept analytics cookies?"
            headingLevel={2}
            headingSize="m"
            isInline={RadioIsInline.TRUE}
            answerOptions={["Yes", "No"]}
            defaultValue={
              cookieConsent == "accepted" ? "Yes" : cookieConsent == "rejected" ? "No" : undefined
            }
            sortAnswersAlphabetically={false}
            errorMessage=""
            formValue="cookieConsent"
            required={false}
          />
          <Button id="save-cookie-settings" type={ButtonType.DEFAULT} text="Save cookie settings" />
        </form>
      </FormProvider>
    </Container>
  );
}
