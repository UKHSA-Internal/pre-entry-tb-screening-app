import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import Button from "@/components/button/button";
import Heading from "@/components/heading/heading";
import Spinner from "@/components/spinner/spinner";
import Summary from "@/components/summary/summary";
import { useAppSelector } from "@/redux/hooks";
import { selectSputum, setSputumStatus } from "@/redux/sputumSlice";
import { ApplicationStatus, ButtonType, PositiveOrNegative } from "@/utils/enums";
import { formatDateType } from "@/utils/helpers";

const SputumSummary = () => {
  const sputumData = useAppSelector(selectSputum);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    setIsLoading(true);
    try {
      const allSamplesComplete = [sputumData.sample1, sputumData.sample2, sputumData.sample3].every(
        (sample) => {
          const hasCollectionData =
            sample.collection.dateOfSample.day &&
            sample.collection.dateOfSample.month &&
            sample.collection.dateOfSample.year &&
            sample.collection.collectionMethod;

          const hasSmearResult =
            sample.smearResults.smearResult !== PositiveOrNegative.NOT_YET_ENTERED;
          const hasCultureResult =
            sample.cultureResults.cultureResult !== PositiveOrNegative.NOT_YET_ENTERED;

          return hasCollectionData && hasSmearResult && hasCultureResult;
        },
      );

      if (allSamplesComplete) {
        dispatch(setSputumStatus(ApplicationStatus.COMPLETE));
        navigate("/sputum-confirmation");
      } else {
        dispatch(setSputumStatus(ApplicationStatus.IN_PROGRESS));
        navigate("/sputum-confirmation");
      }
    } catch (error) {
      console.error(error);
      navigate("/error");
    }
    setIsLoading(false);
  };
  const getSampleStatus = (sampleNumber: 1 | 2 | 3): ApplicationStatus => {
    const sample =
      sampleNumber === 1
        ? sputumData.sample1
        : sampleNumber === 2
          ? sputumData.sample2
          : sputumData.sample3;

    const hasCollectionData =
      sample.collection.dateOfSample.day &&
      sample.collection.dateOfSample.month &&
      sample.collection.dateOfSample.year &&
      sample.collection.collectionMethod;

    const hasSmearResult = sample.smearResults.smearResult !== PositiveOrNegative.NOT_YET_ENTERED;
    const hasCultureResult =
      sample.cultureResults.cultureResult !== PositiveOrNegative.NOT_YET_ENTERED;

    const allFieldsComplete = hasCollectionData && hasSmearResult && hasCultureResult;
    const someFieldsComplete = hasCollectionData || hasSmearResult || hasCultureResult;

    if (allFieldsComplete) {
      return ApplicationStatus.COMPLETE;
    } else if (someFieldsComplete) {
      return ApplicationStatus.IN_PROGRESS;
    } else {
      return ApplicationStatus.NOT_YET_STARTED;
    }
  };

  const generateSampleSummaryData = (sampleNumber: 1 | 2 | 3) => {
    const sample =
      sampleNumber === 1
        ? sputumData.sample1
        : sampleNumber === 2
          ? sputumData.sample2
          : sputumData.sample3;

    const hasCollectionData =
      sample.collection.dateOfSample.day &&
      sample.collection.dateOfSample.month &&
      sample.collection.dateOfSample.year;

    const hasSmearResult = sample.smearResults.smearResult !== PositiveOrNegative.NOT_YET_ENTERED;
    const hasCultureResult =
      sample.cultureResults.cultureResult !== PositiveOrNegative.NOT_YET_ENTERED;

    return [
      {
        key: "Date taken",
        value: hasCollectionData ? formatDateType(sample.collection.dateOfSample) : "No data",
        link: sample.collection.submittedToDatabase ? "" : `/sputum-collection`,
        hiddenLabel: `date sample ${sampleNumber} was taken`,
      },
      {
        key: "Collection method",
        value: sample.collection.collectionMethod || "No data",
        link: sample.collection.submittedToDatabase ? "" : `/sputum-collection`,
        hiddenLabel: `collection method for sample ${sampleNumber}`,
      },
      {
        key: "Smear result",
        value: hasSmearResult ? sample.smearResults.smearResult : "No data",
        link: sample.smearResults.submittedToDatabase ? "" : `/enter-sputum-sample-results`,
        hiddenLabel: `smear result for sample ${sampleNumber}`,
      },
      {
        key: "Culture result",
        value: hasCultureResult ? sample.cultureResults.cultureResult : "No data",
        link: sample.cultureResults.submittedToDatabase ? "" : `/enter-sputum-sample-results`,
        hiddenLabel: `culture result for sample ${sampleNumber}`,
      },
    ];
  };

  return (
    <div>
      {isLoading && <Spinner />}

      <Heading level={1} size="l" title="Check sputum sample information and results" />

      <Heading level={2} size="m" title="Sputum sample 1" />
      <Summary status={getSampleStatus(1)} summaryElements={generateSampleSummaryData(1)} />

      <Heading level={2} size="m" title="Sputum sample 2" />
      <Summary status={getSampleStatus(2)} summaryElements={generateSampleSummaryData(2)} />

      <Heading level={2} size="m" title="Sputum sample 3" />
      <Summary status={getSampleStatus(3)} summaryElements={generateSampleSummaryData(3)} />

      <div style={{ marginTop: 40 }}>
        {(sputumData.status === ApplicationStatus.NOT_YET_STARTED ||
          sputumData.status === ApplicationStatus.IN_PROGRESS) && (
          <Button
            id="confirm"
            type={ButtonType.DEFAULT}
            text="Save and continue"
            handleClick={handleSubmit}
          />
        )}
        {(sputumData.status === ApplicationStatus.COMPLETE ||
          sputumData.status === ApplicationStatus.NOT_REQUIRED) && (
          <Button
            id="back-to-tracker"
            type={ButtonType.DEFAULT}
            text="Return to tracker"
            handleClick={() => navigate("/tracker")}
          />
        )}
      </div>
    </div>
  );
};

export default SputumSummary;
