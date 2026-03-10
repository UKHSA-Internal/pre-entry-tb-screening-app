import { ReduxSputumSampleType, ReduxSputumType } from "@/types";

import { PositiveOrNegative } from "./enums";

const hasCollectionDate = (sample: ReduxSputumSampleType) =>
  sample.collection.dateOfSample.day &&
  sample.collection.dateOfSample.month &&
  sample.collection.dateOfSample.year;

const hasCollectionMethod = (sample: ReduxSputumSampleType) => !!sample.collection.collectionMethod;

const hasSmearResult = (sample: ReduxSputumSampleType) =>
  sample.smearResults.smearResult !== PositiveOrNegative.NOT_YET_ENTERED;

const hasCultureResult = (sample: ReduxSputumSampleType) =>
  sample.cultureResults.cultureResult !== PositiveOrNegative.NOT_YET_ENTERED;

const formatDate = (date: { year: string; month: string; day: string }) =>
  `${date.year}-${date.month.padStart(2, "0")}-${date.day.padStart(2, "0")}`;

export const buildSamplePayload = (sample: ReduxSputumSampleType) => {
  const hasCollection = hasCollectionDate(sample) || hasCollectionMethod(sample);
  const smear = hasSmearResult(sample);
  const culture = hasCultureResult(sample);

  if (!hasCollection && !smear && !culture) return null;

  const payload: {
    dateOfSample?: string;
    collectionMethod?: string;
    smearResult?: PositiveOrNegative;
    cultureResult?: PositiveOrNegative;
    dateUpdated: string;
  } = {
    dateUpdated: new Date().toISOString().split("T")[0],
  };

  if (hasCollectionDate(sample)) {
    payload.dateOfSample = formatDate(sample.collection.dateOfSample);
  }

  if (hasCollectionMethod(sample)) {
    payload.collectionMethod = sample.collection.collectionMethod;
  }

  if (smear) {
    payload.smearResult = sample.smearResults.smearResult;
  }
  if (culture) {
    payload.cultureResult = sample.cultureResults.cultureResult;
  }

  return payload;
};

const isSampleComplete = (sample: ReduxSputumSampleType) =>
  hasCollectionDate(sample) &&
  hasCollectionMethod(sample) &&
  hasSmearResult(sample) &&
  hasCultureResult(sample);

const sampleKeys = ["sample1", "sample2", "sample3"] as const;

export const areAllSamplesComplete = (sputumData: ReduxSputumType) =>
  sampleKeys.every((key) => isSampleComplete(sputumData[key]));
