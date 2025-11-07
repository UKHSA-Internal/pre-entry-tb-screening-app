import Confirmation from "@/components/confirmation/confirmation";
import Container from "@/components/container/container";

export default function TravelConfirmation() {
  return (
    <Container title="Travel information confirmed - Complete UK pre-entry health screening - GOV.UK">
      <Confirmation
        confirmationText={"Travel information confirmed"}
        furtherInfo={["You can now return to the progress tracker."]}
        buttonText={"Continue"}
        buttonLink={"/tracker"}
        whatHappensNext
      />
    </Container>
  );
}
