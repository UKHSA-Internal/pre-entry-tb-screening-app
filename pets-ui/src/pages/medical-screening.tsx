import "./medical-screening.scss";

import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";
import MedicalScreeningForm from "@/sections/medical-screening-form";

export default function MedicalScreeningPage() {
  return (
    <Container title="Medical Screening Form">
      <Heading level={1} size="l" title="Medical Screening" />
      <p className="govuk-body">
        Enter the applicant&apos;s profile information. You should answer every question.
      </p>
      <MedicalScreeningForm />
    </Container>
  );
}
