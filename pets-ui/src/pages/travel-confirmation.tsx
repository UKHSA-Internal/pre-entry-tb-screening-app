import Confirmation from "@/components/confirmation/confirmation";
import Container from "@/components/container/container";

export default function TravelConfirmation() {
  const furtherInfo = [
    "The applicant is now ready to conduct their medical screening with the panel physician.",
  ];

  return (
    <Container title="Travel details confirmation" backLinkTo="/travel-summary">
      <Confirmation
        confirmationText={"Travel information record created"}
        furtherInfo={furtherInfo}
        buttonText={"Continue"}
        buttonLink={"/tracker"}
        whatHappensNext
      />
    </Container>
  );
}
