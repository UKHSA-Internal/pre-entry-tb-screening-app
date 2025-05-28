import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";
import ProgressTracker from "@/sections/progress-tracker";

export default function ProgressTrackerPage() {
  return (
    <Container title="TB screening progress tracker">
      <Heading level={1} size="l" title="TB screening progress tracker" />
      <ProgressTracker />
    </Container>
  );
}
