import "./home-page.scss";

import { useMsal } from "@azure/msal-react";

import { loginRequest } from "@/auth/auth";
import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";
import LinkLabel from "@/components/linkLabel/LinkLabel";
import List from "@/components/list/list";
import StartButton from "@/components/startButton/startButton";

export default function HomePage() {
  const { instance } = useMsal();

  const initializeSignIn = () => {
    instance
      .loginRedirect({
        scopes: loginRequest.scopes,
        storeInCache: loginRequest.storeInCache,
      })
      .catch(() => new Error("Failed to initialize sign in"));
  };

  return (
    <Container title="UK Pre-Entry Health Screening">
      <Heading level={1} size="l" title="Complete a UK visa applicant's TB screening" />
      <p className="govuk-body">
        This service is for authorised staff to enter TB screening information for UK visa
        applicants. For advice and guidance on the process, visa applicants should visit{" "}
        <LinkLabel
          to="https://www.gov.uk/tb-test-visa"
          title="Tuberculosis tests for visa applicants: Check if you need a TB test for your visa
          application"
        />
        .
      </p>
      <p className="govuk-body">Use this service to:</p>
      <List
        items={[
          "enter the applicant details",
          "enter their travel information",
          "complete the TB medical screening",
          "upload and view X-ray images",
          "search for screening information for an existing UK visa applicant",
          "check on a TB screening applicant's progress",
        ]}
      />
      <p className="govuk-body">Applicants need a:</p>
      <ul className="govuk-body">
        <li>valid passport</li>
        <li>UK address</li>
        <li>UK visa type</li>
      </ul>
      <p className="govuk-body">
        If you&apos;re a clinician you can also sign in to resume a medical screening case.
      </p>
      <p className="govuk-body">Use the username and password you were assigned to sign in.</p>
      <StartButton id="sign-in" text="Sign in" href="" handleClick={initializeSignIn} />
    </Container>
  );
}
