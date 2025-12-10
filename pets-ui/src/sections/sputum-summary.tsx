import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { postSputumDetails } from "@/api/api";
import Button from "@/components/button/button";
import Heading from "@/components/heading/heading";
import Spinner from "@/components/spinner/spinner";
import Summary from "@/components/summary/summary";
import { useAppSelector } from "@/redux/hooks";
import {
  setSample1Collection,
  setSample1CultureResults,
  setSample1SmearResults,
  setSample2Collection,
  setSample2CultureResults,
  setSample2SmearResults,
  setSample3Collection,
  setSample3CultureResults,
  setSample3SmearResults,
  setSputumStatus,
  setSputumVersion,
} from "@/redux/sputumSlice";
import { selectApplication, selectSputum } from "@/redux/store";
import { ApplicationStatus, ButtonClass, PositiveOrNegative } from "@/utils/enums";
import { formatDateForDisplay } from "@/utils/helpers";

const SputumSummary = () => {
  const sputumData = useAppSelector(selectSputum);
  const applicationData = useAppSelector(selectApplication);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const sputumSamples: Record<
        string,
        {
          dateOfSample?: string;
          collectionMethod?: string;
          smearResult?: PositiveOrNegative;
          cultureResult?: PositiveOrNegative;
          dateUpdated: string;
        }
      > = {};

      const formatDate = (date: { year: string; month: string; day: string }) =>
        `${date.year}-${date.month.padStart(2, "0")}-${date.day.padStart(2, "0")}`;

      const sampleKeys = ["sample1", "sample2", "sample3"] as const;
      const collectionActions = [setSample1Collection, setSample2Collection, setSample3Collection];
      const smearActions = [setSample1SmearResults, setSample2SmearResults, setSample3SmearResults];
      const cultureActions = [
        setSample1CultureResults,
        setSample2CultureResults,
        setSample3CultureResults,
      ];

      sampleKeys.forEach((sampleKey) => {
        const sample = sputumData[sampleKey];

        const hasCollectionDate =
          sample.collection.dateOfSample.day &&
          sample.collection.dateOfSample.month &&
          sample.collection.dateOfSample.year;
        const hasCollectionMethod = !!sample.collection.collectionMethod;
        const hasAnyCollectionData = hasCollectionDate || hasCollectionMethod;

        const hasSmearResult =
          sample.smearResults.smearResult !== PositiveOrNegative.NOT_YET_ENTERED;
        const hasCultureResult =
          sample.cultureResults.cultureResult !== PositiveOrNegative.NOT_YET_ENTERED;

        if (hasAnyCollectionData || hasSmearResult || hasCultureResult) {
          const sampleData: {
            dateOfSample?: string;
            collectionMethod?: string;
            smearResult?: PositiveOrNegative;
            cultureResult?: PositiveOrNegative;
            dateUpdated: string;
          } = {
            dateUpdated: new Date().toISOString().split("T")[0],
          };

          if (hasCollectionDate) {
            sampleData.dateOfSample = formatDate(sample.collection.dateOfSample);
          }
          if (hasCollectionMethod) {
            sampleData.collectionMethod = sample.collection.collectionMethod;
          }

          if (hasSmearResult) {
            sampleData.smearResult = sample.smearResults.smearResult;
          }

          if (hasCultureResult) {
            sampleData.cultureResult = sample.cultureResults.cultureResult;
          }

          sputumSamples[sampleKey] = sampleData;
        }
      });

      if (Object.keys(sputumSamples).length > 0) {
        const response = await postSputumDetails(
          applicationData.applicationId,
          sputumSamples,
          sputumData.version,
        );

        if (response.data.version !== undefined) {
          dispatch(setSputumVersion(response.data.version));
        }

        sampleKeys.forEach((sampleKey, index) => {
          const sample = sputumData[sampleKey];

          if (
            sputumSamples[sampleKey]?.dateOfSample ||
            sputumSamples[sampleKey]?.collectionMethod
          ) {
            dispatch(
              collectionActions[index]({
                ...sample.collection,
                submittedToDatabase: true,
              }),
            );
          }

          if (sputumSamples[sampleKey]?.smearResult) {
            dispatch(
              smearActions[index]({
                ...sample.smearResults,
                submittedToDatabase: true,
              }),
            );
          }

          if (sputumSamples[sampleKey]?.cultureResult) {
            dispatch(
              cultureActions[index]({
                ...sample.cultureResults,
                submittedToDatabase: true,
              }),
            );
          }
        });
      }

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
        navigate("/sputum-sample-information-confirmed");
      } else {
        dispatch(setSputumStatus(ApplicationStatus.IN_PROGRESS));
        navigate("/sputum-sample-information-confirmed");
      }
    } catch (error) {
      console.error(error);
      navigate("/sorry-there-is-problem-with-service");
    }
  };

  const getSampleStatus = (sampleNumber: 1 | 2 | 3): ApplicationStatus => {
    let sample;
    if (sampleNumber === 1) {
      sample = sputumData.sample1;
    } else if (sampleNumber === 2) {
      sample = sputumData.sample2;
    } else {
      sample = sputumData.sample3;
    }

    const hasCollectionData = !!(
      sample.collection.dateOfSample.day &&
      sample.collection.dateOfSample.month &&
      sample.collection.dateOfSample.year
    );

    const hasSmearResult = sample.smearResults.smearResult !== PositiveOrNegative.NOT_YET_ENTERED;
    const hasCultureResult =
      sample.cultureResults.cultureResult !== PositiveOrNegative.NOT_YET_ENTERED;

    const collectionSaved = sample.collection.submittedToDatabase;
    const smearSaved = sample.smearResults.submittedToDatabase;
    const cultureSaved = sample.cultureResults.submittedToDatabase;

    const allPresent = hasCollectionData && hasSmearResult && hasCultureResult;
    const allSaved = collectionSaved && smearSaved && cultureSaved;

    if (allPresent && allSaved) {
      return ApplicationStatus.COMPLETE;
    }

    if (hasCollectionData || hasSmearResult || hasCultureResult) {
      return ApplicationStatus.IN_PROGRESS;
    }

    return ApplicationStatus.NOT_YET_STARTED;
  };

  const generateSampleSummaryData = (sampleNumber: 1 | 2 | 3) => {
    let sample;
    if (sampleNumber === 1) {
      sample = sputumData.sample1;
    } else if (sampleNumber === 2) {
      sample = sputumData.sample2;
    } else {
      sample = sputumData.sample3;
    }

    const hasCollectionData: boolean = !!(
      sample.collection.dateOfSample.day &&
      sample.collection.dateOfSample.month &&
      sample.collection.dateOfSample.year
    );
    const hasSmearResult = sample.smearResults.smearResult !== PositiveOrNegative.NOT_YET_ENTERED;
    const hasCultureResult =
      sample.cultureResults.cultureResult !== PositiveOrNegative.NOT_YET_ENTERED;

    const summaryData: {
      key: string;
      value: string;
      link?: string;
      hiddenLabel: string;
    }[] = [];

    const dateTaken: {
      key: string;
      value: string;
      link?: string;
      hiddenLabel: string;
    } = {
      key: "Date collected",
      value: hasCollectionData ? formatDateForDisplay(sample.collection.dateOfSample) : "No data",
      hiddenLabel: `date sample ${sampleNumber} was taken`,
    };

    if (hasCollectionData && !sample.collection.submittedToDatabase) {
      dateTaken.link = "/sputum-collection-details";
    }
    summaryData.push(dateTaken);

    const collectionMethod: {
      key: string;
      value: string;
      link?: string;
      hiddenLabel: string;
    } = {
      key: "Collection method",
      value: sample.collection.collectionMethod || "No data",
      hiddenLabel: `collection method for sample ${sampleNumber}`,
    };

    if (sample.collection.collectionMethod && !sample.collection.submittedToDatabase) {
      collectionMethod.link = "/sputum-collection-details";
    }
    summaryData.push(collectionMethod);

    const smearResult: {
      key: string;
      value: string;
      link?: string;
      hiddenLabel: string;
    } = {
      key: "Smear result",
      value: hasSmearResult ? sample.smearResults.smearResult : "No data",
      hiddenLabel: `smear result for sample ${sampleNumber}`,
    };

    if (hasSmearResult && !sample.smearResults.submittedToDatabase) {
      smearResult.link = "/enter-sputum-sample-results";
    }
    summaryData.push(smearResult);

    const cultureResult: {
      key: string;
      value: string;
      link?: string;
      hiddenLabel: string;
    } = {
      key: "Culture result",
      value: hasCultureResult ? sample.cultureResults.cultureResult : "No data",
      hiddenLabel: `culture result for sample ${sampleNumber}`,
    };

    if (hasCultureResult && !sample.cultureResults.submittedToDatabase) {
      cultureResult.link = "/enter-sputum-sample-results";
    }
    summaryData.push(cultureResult);

    return summaryData;
  };

  return (
    <div>
      {isLoading && <Spinner />}

      <Heading level={1} size="l" title="Check sputum collection details and results" />

      <Heading level={2} size="m" title="Sputum sample 1" />
      <Summary status={getSampleStatus(1)} summaryElements={generateSampleSummaryData(1)} />

      <Heading level={2} size="m" title="Sputum sample 2" />
      <Summary status={getSampleStatus(2)} summaryElements={generateSampleSummaryData(2)} />

      <Heading level={2} size="m" title="Sputum sample 3" />
      <Summary status={getSampleStatus(3)} summaryElements={generateSampleSummaryData(3)} />

      <Heading title="Now send the sputum collection details and results" level={2} size="m" />
      <p className="govuk-body">
        You will not be able to change the collection details and results after you submit this
        information. However, you will be able to return and complete any information that you have
        not provided.
      </p>

      <div style={{ marginTop: 40 }}>
        {(sputumData.status === ApplicationStatus.NOT_YET_STARTED ||
          sputumData.status === ApplicationStatus.IN_PROGRESS) && (
          <Button
            id="submit"
            class={ButtonClass.DEFAULT}
            text="Submit and continue"
            handleClick={handleSubmit}
          />
        )}
        {(sputumData.status === ApplicationStatus.COMPLETE ||
          sputumData.status === ApplicationStatus.NOT_REQUIRED) && (
          <Button
            id="back-to-tracker"
            class={ButtonClass.DEFAULT}
            text="Return to tracker"
            handleClick={() => navigate("/tracker")}
          />
        )}
      </div>
    </div>
  );
};

export default SputumSummary;
