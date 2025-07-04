import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";
import ProgressTracker from "@/sections/progress-tracker";

export default function ProgressTrackerPage() {
  return (
    <Container title="Complete UK pre-entry health screening">
      <Heading level={1} size="l" title="Complete UK pre-entry health screening" />
      <ProgressTracker />
    </Container>
  );
}
