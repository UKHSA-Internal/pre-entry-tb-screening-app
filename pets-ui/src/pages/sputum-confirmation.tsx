import Confirmation from "@/components/confirmation/confirmation";
import Container from "@/components/container/container";
import { useAppSelector } from "@/redux/hooks";
import { selectSputum } from "@/redux/sputumSlice";
import { ApplicationStatus } from "@/utils/enums";

export default function SputumConfirmation() {
  const sputumData = useAppSelector(selectSputum);
  const confirmationText =
    sputumData.status == ApplicationStatus.COMPLETE
      ? "All sputum sample information confirmed"
      : "Partial sputum sample information confirmed";
  const furtherInfo = ["You can now add return to the progress tracker."];

  return (
    <Container breadcrumbItems={[]} title="Sputum confirmation">
      <Confirmation
        confirmationText={confirmationText}
        furtherInfo={furtherInfo}
        buttonText={"Continue"}
        buttonLink={"/tracker"}
        whatHappensNext
      />
    </Container>
  );
}
