import Confirmation from "@/components/confirmation/confirmation";
import Container from "@/components/container/container";
import { useAppSelector } from "@/redux/hooks";
import { selectSputum } from "@/redux/store";
import { ApplicationStatus, PositiveOrNegative } from "@/utils/enums";

export default function SputumConfirmation() {
  const sputumData = useAppSelector(selectSputum);

  const samples = [sputumData.sample1, sputumData.sample2, sputumData.sample3];

  const allDatesComplete = samples.every(
    (sample) =>
      sample.collection.dateOfSample.day &&
      sample.collection.dateOfSample.month &&
      sample.collection.dateOfSample.year &&
      sample.collection.collectionMethod,
  );

  const allResultsComplete = samples.every((sample) => {
    const hasCollectionData =
      sample.collection.dateOfSample.day &&
      sample.collection.dateOfSample.month &&
      sample.collection.dateOfSample.year &&
      sample.collection.collectionMethod;
    const hasSmearResult = sample.smearResults.smearResult !== PositiveOrNegative.NOT_YET_ENTERED;
    const hasCultureResult =
      sample.cultureResults.cultureResult !== PositiveOrNegative.NOT_YET_ENTERED;
    return hasCollectionData && hasSmearResult && hasCultureResult;
  });

  const hasAnyResults = samples.some((sample) => {
    const hasSmearResult = sample.smearResults.smearResult !== PositiveOrNegative.NOT_YET_ENTERED;
    const hasCultureResult =
      sample.cultureResults.cultureResult !== PositiveOrNegative.NOT_YET_ENTERED;
    return hasSmearResult || hasCultureResult;
  });

  const confirmationText =
    sputumData.status === ApplicationStatus.COMPLETE || allResultsComplete
      ? "All sputum sample information confirmed"
      : "Partial sputum sample information confirmed";

  const furtherInfo = (() => {
    if (allResultsComplete) {
      return ["You can now return to the progress tracker."];
    } else if (allDatesComplete && hasAnyResults) {
      return ["The panel physician should wait to confirm the remaining sputum sample results"];
    } else {
      return ["You can now return to the progress tracker."];
    }
  })();

  return (
    <Container title="Sputum confirmation" backLinkTo="/check-sputum-sample-information-results">
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
