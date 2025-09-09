import Confirmation from "@/components/confirmation/confirmation";
import Container from "@/components/container/container";

export default function ChestXrayConfirmation() {
  return (
    <Container title="Chest X-ray images confirmed - Complete UK pre-entry health screening - GOV.UK">
      <Confirmation
        confirmationText={"Chest X-ray images confirmed"}
        furtherInfo={[
          "We have sent the chest X-ray images to UKHSA.",
          "You can now view a summary for this visa applicant.",
        ]}
        buttonText={"Continue"}
        buttonLink={"/tracker"}
        whatHappensNext
      />
    </Container>
  );
}
