import Container from "@/components/container/container";
import ChestXrayFindingsForm from "@/sections/chest-xray-findings-form";

export default function ChestXrayFindingsPage() {
  return (
    <Container title="Enter chest X-ray findings" backLinkTo="/chest-xray-upload">
      <ChestXrayFindingsForm />
    </Container>
  );
}
