import Confirmation from "@/components/confirmation/confirmation";
import Container from "@/components/container/container";

export default function SputumDecisionConfirmation() {
  return (
    <Container title="Sputum decision confirmed - Complete UK pre-entry health screening - GOV.UK">
      <Confirmation
        confirmationText={"Sputum decision confirmed"}
        furtherInfo={[
          "We have sent the sputum decision to UKHSA.",
          "You can now view a summary for this visa applicant.",
        ]}
        buttonText={"Continue"}
        buttonLink={"/tracker"}
        whatHappensNext
      />
    </Container>
  );
}
