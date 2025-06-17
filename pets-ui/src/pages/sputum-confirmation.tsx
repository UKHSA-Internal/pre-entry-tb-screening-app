import Confirmation from "@/components/confirmation/confirmation";
import Container from "@/components/container/container";
import { useAppSelector } from "@/redux/hooks";
import { selectSputum } from "@/redux/sputumSlice";
import { ApplicationStatus, PositiveOrNegative } from "@/utils/enums";

export default function SputumConfirmation() {
  const sputumData = useAppSelector(selectSputum);

  const allResultsComplete = [sputumData.sample1, sputumData.sample2, sputumData.sample3].every(
    (sample) => {
      const hasCollectionData =
        sample.collection.dateOfSample.day &&
        sample.collection.dateOfSample.month &&
        sample.collection.dateOfSample.year &&
        sample.collection.collectionMethod;
      const hasSmearResult = sample.smearResults.smearResult !== PositiveOrNegative.NOT_YET_ENTERED;
      const hasCultureResult =
        sample.cultureResults.cultureResult !== PositiveOrNegative.NOT_YET_ENTERED;
      return hasCollectionData && hasSmearResult && hasCultureResult;
    },
  );

  const confirmationText =
    sputumData.status === ApplicationStatus.COMPLETE || allResultsComplete
      ? "All sputum sample information confirmed"
      : "Partial sputum sample information confirmed";

  const furtherInfo = allResultsComplete
    ? ["You can now return to the progress tracker."]
    : ["You can add more results later or return to the progress tracker."];

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
