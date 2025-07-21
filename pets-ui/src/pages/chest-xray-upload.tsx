import Container from "@/components/container/container";
import ChestXrayForm from "@/sections/chest-xray-form";

export default function ChestXrayUploadPage() {
  return (
    <Container title="Chest X-ray not taken" backLinkTo="/chest-xray-question">
      <ChestXrayForm />
    </Container>
  );
}
