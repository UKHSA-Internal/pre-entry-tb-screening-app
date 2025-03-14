import "./contact-details.scss";

import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";
import ApplicantForm from "@/sections/applicant-details-form";

export default function ContactDetailsPage() {
  return (
    <Container title="Applicant details form">
      <Heading level={1} size="l" title="Enter applicant information" />
      <p className="govuk-body">
        Enter the applicant&apos;s profile information below. Select &apos;Save and continue&apos;
        to save any information added.
      </p>
      <ApplicantForm />
    </Container>
  );
}
