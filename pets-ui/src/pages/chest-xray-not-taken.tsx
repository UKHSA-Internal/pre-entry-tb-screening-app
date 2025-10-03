import Container from "@/components/container/container";
import ChestXrayNotTakenForm from "@/sections/chest-xray-not-taken-form";

export default function ChestXrayNotTaken() {
  return (
    <Container
      title="Enter reason X-ray not taken - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo="/chest-xray-question"
    >
      <ChestXrayNotTakenForm />
    </Container>
  );
}
