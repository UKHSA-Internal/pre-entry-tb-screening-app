import Confirmation from "@/components/confirmation/confirmation";
import Container from "@/components/container/container";

export default function MedicalConfirmation() {
  return (
    <Container title="Medical screening confirmation" backLinkTo="/medical-summary">
      <Confirmation
        confirmationText={"Medical history and TB symptoms confirmed"}
        furtherInfo={["You can now return to the progress tracker."]}
        buttonText={"Continue"}
        buttonLink={"/tracker"}
        whatHappensNext
      />
    </Container>
  );
}
