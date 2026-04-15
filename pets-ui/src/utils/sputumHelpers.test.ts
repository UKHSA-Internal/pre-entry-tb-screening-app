import { ReduxSputumSampleType, ReduxSputumType } from "@/types";

import { PositiveOrNegative, SputumCollectionMethod, TaskStatus } from "./enums";
import { areAllSamplesComplete, buildSamplePayload } from "./sputumHelpers";

const createBaseSample = (): ReduxSputumSampleType => ({
  collection: {
    dateOfSample: { day: "", month: "", year: "" },
    collectionMethod: SputumCollectionMethod.NOT_KNOWN,
    submittedToDatabase: false,
  },
  smearResults: {
    smearResult: PositiveOrNegative.NOT_YET_ENTERED,
    submittedToDatabase: false,
  },
  cultureResults: {
    cultureResult: PositiveOrNegative.NOT_YET_ENTERED,
    submittedToDatabase: false,
  },
  lastUpdatedDate: {
    year: "",
    month: "",
    day: "",
  },
});

describe("buildSamplePayload", () => {
  beforeAll(() => {
    vi.useFakeTimers().setSystemTime(new Date("2024-01-01"));
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it("returns null when sample has no data", () => {
    const sample = createBaseSample();

    const result = buildSamplePayload(sample);

    expect(result).toEqual({
      collectionMethod: "Not known",
      dateUpdated: "2024-01-01",
    });
  });

  it("includes formatted collection date when present", () => {
    const sample = createBaseSample();

    sample.collection.dateOfSample = {
      day: "5",
      month: "2",
      year: "2024",
    };

    const result = buildSamplePayload(sample);

    expect(result).toEqual({
      collectionMethod: "Not known",
      dateOfSample: "2024-02-05",
      dateUpdated: "2024-01-01",
    });
  });

  it("includes collection method when present", () => {
    const sample = createBaseSample();

    sample.collection.collectionMethod = SputumCollectionMethod.GASTRIC_LAVAGE;

    const result = buildSamplePayload(sample);

    expect(result).toEqual({
      collectionMethod: SputumCollectionMethod.GASTRIC_LAVAGE,
      dateUpdated: "2024-01-01",
    });
  });

  it("includes smear result when present", () => {
    const sample = createBaseSample();

    sample.smearResults.smearResult = PositiveOrNegative.POSITIVE;

    const result = buildSamplePayload(sample);

    expect(result).toEqual({
      collectionMethod: "Not known",
      smearResult: PositiveOrNegative.POSITIVE,
      dateUpdated: "2024-01-01",
    });
  });

  it("includes culture result when present", () => {
    const sample = createBaseSample();

    sample.cultureResults.cultureResult = PositiveOrNegative.NEGATIVE;

    const result = buildSamplePayload(sample);

    expect(result).toEqual({
      collectionMethod: "Not known",
      cultureResult: PositiveOrNegative.NEGATIVE,
      dateUpdated: "2024-01-01",
    });
  });

  it("includes all fields when all data present", () => {
    const sample = createBaseSample();

    sample.collection.dateOfSample = {
      day: "1",
      month: "3",
      year: "2024",
    };

    sample.collection.collectionMethod = SputumCollectionMethod.COUGHED_UP;
    sample.smearResults.smearResult = PositiveOrNegative.POSITIVE;
    sample.cultureResults.cultureResult = PositiveOrNegative.NEGATIVE;

    const result = buildSamplePayload(sample);

    expect(result).toEqual({
      dateOfSample: "2024-03-01",
      collectionMethod: SputumCollectionMethod.COUGHED_UP,
      smearResult: PositiveOrNegative.POSITIVE,
      cultureResult: PositiveOrNegative.NEGATIVE,
      dateUpdated: "2024-01-01",
    });
  });
});

describe("areAllSamplesComplete", () => {
  const createCompleteSample = (): ReduxSputumSampleType => ({
    collection: {
      dateOfSample: { day: "1", month: "1", year: "2024" },
      collectionMethod: SputumCollectionMethod.COUGHED_UP,
      submittedToDatabase: false,
    },
    smearResults: {
      smearResult: PositiveOrNegative.POSITIVE,
      submittedToDatabase: false,
    },
    cultureResults: {
      cultureResult: PositiveOrNegative.NEGATIVE,
      submittedToDatabase: false,
    },
    lastUpdatedDate: {
      year: "2024",
      month: "2",
      day: "2",
    },
  });

  const createIncompleteSample = (): ReduxSputumSampleType => ({
    collection: {
      dateOfSample: { day: "", month: "", year: "" },
      collectionMethod: "",
      submittedToDatabase: false,
    },
    smearResults: {
      smearResult: PositiveOrNegative.NOT_YET_ENTERED,
      submittedToDatabase: false,
    },
    cultureResults: {
      cultureResult: PositiveOrNegative.NOT_YET_ENTERED,
      submittedToDatabase: false,
    },
    lastUpdatedDate: {
      year: "",
      month: "",
      day: "",
    },
  });

  it("returns true when all samples are complete", () => {
    const sputumData: ReduxSputumType = {
      status: TaskStatus.NOT_YET_STARTED,
      sample1: createCompleteSample(),
      sample2: createCompleteSample(),
      sample3: createCompleteSample(),
    };

    expect(areAllSamplesComplete(sputumData)).toBe(true);
  });

  it("returns false when any sample is incomplete", () => {
    const sputumData: ReduxSputumType = {
      status: TaskStatus.NOT_YET_STARTED,
      sample1: createCompleteSample(),
      sample2: createIncompleteSample(),
      sample3: createCompleteSample(),
    };

    expect(areAllSamplesComplete(sputumData)).toBe(false);
  });

  it("returns false when all samples are incomplete", () => {
    const sputumData: ReduxSputumType = {
      status: TaskStatus.NOT_YET_STARTED,
      sample1: createIncompleteSample(),
      sample2: createIncompleteSample(),
      sample3: createIncompleteSample(),
    };

    expect(areAllSamplesComplete(sputumData)).toBe(false);
  });
});
