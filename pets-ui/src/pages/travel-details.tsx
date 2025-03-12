import "./travel-details.scss";

import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";
import ApplicantTravelForm from "@/sections/applicant-travel-form";

export default function TravelDetailsPage() {
  return (
    <Container title="Applicant Travel Information Form">
      <Heading level={1} size="l" title="Travel Information" />
      <p className="govuk-body">Enter the applicant&apos;s travel information below.</p>
      <ApplicantTravelForm />
    </Container>
  );
}
