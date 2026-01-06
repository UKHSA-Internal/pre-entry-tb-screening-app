import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";
import LinkLabel from "@/components/linkLabel/LinkLabel";

export default function PageNotFound() {
  return (
    <Container
      title={"Page not found - Complete UK pre-entry health screening - GOV.UK"}
      backLinkTo="/"
    >
      <Heading level={1} size="l" title="Page not found" />
      <p className="govuk-body">If you typed the web address, check it is correct.</p>
      <p className="govuk-body">
        If you pasted the web address, check you copied the entire address.
      </p>
      <p className="govuk-body">
        If the web address is correct or you selected a link or button, email{" "}
        <LinkLabel
          to="mailto:uktbscreeningsupport@ukhsa.gov.uk"
          title="uktbscreeningsupport@ukhsa.gov.uk"
          externalLink
        />{" "}
        for support.
      </p>
    </Container>
  );
}
