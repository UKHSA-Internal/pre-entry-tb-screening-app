import Container from "@/components/container/container";
import ChestXrayFindingsForm from "@/sections/chest-xray-findings-form";

export default function ChestXrayFindingsPage() {
  return (
    <Container
      title="Enter radiological outcome and findings - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo="/chest-xray-upload"
    >
      <ChestXrayFindingsForm />
    </Container>
  );
}
