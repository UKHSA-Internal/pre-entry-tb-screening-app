import Container from "@/components/container/container";
import ChestXrayForm from "@/sections/chest-xray-form";

export default function ChestXrayUploadPage() {
  return (
    <Container
      title="Upload chest X-ray images - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo="/chest-xray-question"
    >
      <ChestXrayForm />
    </Container>
  );
}
