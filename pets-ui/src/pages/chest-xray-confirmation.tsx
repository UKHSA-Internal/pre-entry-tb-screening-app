import Confirmation from "@/components/confirmation/confirmation";
import Container from "@/components/container/container";

export default function ChestXrayConfirmation() {
  return (
    <Container title="Radiological outcome confirmed" backLinkTo="/chest-xray-summary">
      <Confirmation
        confirmationText={"Radiological outcome confirmed"}
        furtherInfo={["You can now return to the progress tracker."]}
        buttonText={"Continue"}
        buttonLink={"/tracker"}
        whatHappensNext
      />
    </Container>
  );
}
