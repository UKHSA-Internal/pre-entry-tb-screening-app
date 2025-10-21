import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";
import LinkLabel from "@/components/linkLabel/LinkLabel";

export default function ErrorPage() {
  return (
    <Container
      title={
        "Sorry, there is a problem with the service - Complete UK pre-entry health screening - GOV.UK"
      }
      backLinkTo="/search-for-visa-applicant"
    >
      <Heading level={1} size="l" title="Sorry, there is a problem with the service" />
      <p className="govuk-body">Try again later.</p>
      <p className="govuk-body">
        If you completed a section and viewed a confirmation page, we saved your answers.
      </p>
      <p className="govuk-body">
        If you did not view a confirmation page, we have not saved your answers. When the service is
        available, you will have to start the section again.
      </p>
      <p className="govuk-body">
        Email{" "}
        <LinkLabel
          to="mailto:uktbscreeningsupport@ukhsa.gov.uk"
          title="uktbscreeningsupport@ukhsa.gov.uk"
          externalLink
        />{" "}
        if you need support.
      </p>
    </Container>
  );
}
