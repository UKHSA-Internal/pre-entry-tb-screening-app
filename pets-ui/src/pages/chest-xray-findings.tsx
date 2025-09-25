import Container from "@/components/container/container";
import ChestXrayFindingsForm from "@/sections/chest-xray-findings-form";

export default function ChestXrayFindingsPage() {
  return (
    <Container
      title="Enter X-ray findings - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo="/radiological-outcome-chest-xray-results"
    >
      <ChestXrayFindingsForm />
    </Container>
  );
}
