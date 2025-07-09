import Confirmation from "@/components/confirmation/confirmation";
import Container from "@/components/container/container";

export default function MedicalConfirmation() {
  const furtherInfo = ["The applicant is now ready to conduct their chest x-ray or sputum test."];

  return (
    <Container title="Medical screening confirmation" backLinkTo="/medical-summary">
      <Confirmation
        confirmationText={"Medical screening record created"}
        furtherInfo={furtherInfo}
        buttonText={"Continue"}
        buttonLink={"/tracker"}
        whatHappensNext
      />
    </Container>
  );
}
