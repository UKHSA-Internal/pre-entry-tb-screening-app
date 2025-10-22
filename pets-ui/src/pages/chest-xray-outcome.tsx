import Container from "@/components/container/container";
import ChestXrayOutcomeForm from "@/sections/chest-xray-outcome-form";

export default function ChestXrayOutcomePage() {
  return (
    <Container
      title="Enter radiological outcome - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo="/tracker"
    >
      <ChestXrayOutcomeForm />
    </Container>
  );
}
