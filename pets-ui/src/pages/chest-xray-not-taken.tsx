import Container from "@/components/container/container";
import ChestXrayNotTakenForm from "@/sections/chest-xray-not-taken-form";

export default function ChestXrayNotTaken() {
  return (
    <Container title="Chest X-ray not taken" backLinkTo="/chest-xray-question">
      <ChestXrayNotTakenForm />
    </Container>
  );
}
