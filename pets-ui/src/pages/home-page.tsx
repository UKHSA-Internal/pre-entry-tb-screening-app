import "./home-page.scss";

import { useMsal } from "@azure/msal-react";
import { Helmet } from "react-helmet-async";

import { loginRequest } from "@/auth/authConfig";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
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
    <body className="govuk-template__body">
      <Helmet>
        <title>UK Pre-Entry Health Screening</title>
      </Helmet>
      <Header />
      <div className="govuk-width-container">
        <main className="govuk-main-wrapper">
          <h1 className="govuk-heading-l">Complete a UK visa applicant&apos;s TB screening</h1>
          <p className="govuk-body">
            This service is for authorised staff to enter TB screening information for UK visa
            applicants. For advice and guidance on the process, visa applicants should visit{" "}
            <a href="https://www.gov.uk/tb-test-visa">
              Tuberculosis tests for visa applicants: Check if you need a TB test for your visa
              application
            </a>
            {/* */}.
          </p>
          <p className="govuk-body">Use this service to:</p>
          <ul className="govuk-body">
            <li>enter the applicant details</li>
            <li>enter their travel information</li>
            <li>complete the TB medical screening</li>
            <li>upload and view X-ray images</li>
            <li>search for screening information for an existing UK visa applicant</li>
            <li>check on a TB screening applicant&apos;s progress</li>
          </ul>
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
          <StartButton id="sign-in" text="Sign In" href="" handleClick={initializeSignIn} />
        </main>
      </div>
      <Footer />
    </body>
  );
}
