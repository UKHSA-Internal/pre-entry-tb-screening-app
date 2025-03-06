import "./error-page.scss";

import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";

export default function ErrorPage() {
  return (
    <Container title={"Error"}>
      <Heading level={1} size="l" title="An error occurred" />
    </Container>
  );
}
