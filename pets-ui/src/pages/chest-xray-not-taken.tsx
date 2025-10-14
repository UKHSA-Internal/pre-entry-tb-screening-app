import Container from "@/components/container/container";
import ChestXrayNotTakenForm from "@/sections/chest-xray-not-taken-form";

export default function ChestXrayNotTaken() {
  return (
    <Container
      title="Reason X-ray is not required - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo="/is-an-x-ray-required"
    >
      <ChestXrayNotTakenForm />
    </Container>
  );
}
