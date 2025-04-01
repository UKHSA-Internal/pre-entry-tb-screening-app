import "./error-page.scss";

import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";

export default function ErrorPage() {
  return (
    <Container title={"Error"}>
      <Heading
        level={1}
        size="l"
        title="Sorry, there is a problem with the Complete UK pre-entry health screening service"
      />
      <p className="govuk-body">Try again now or later.</p>
      <p className="govuk-body">
        Contact uktbscreeningsupport@ukhsa.gov.uk if the problem continues.
      </p>
    </Container>
  );
}
