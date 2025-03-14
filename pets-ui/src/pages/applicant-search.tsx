import "./applicant-search.scss";

import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";
import ApplicantSearchForm from "@/sections/applicant-search-form";

export default function ApplicantSearchPage() {
  return (
    <Container title="Applicant Search" skipLinkHref={""}>
      <Heading level={1} size="l" title="Search for a visa applicant" />
      <p className="govuk-heading-s">
        Enter the applicant&apos;s passport number and the passport&apos;s country of issue.
      </p>
      <ApplicantSearchForm />
    </Container>
  );
}
