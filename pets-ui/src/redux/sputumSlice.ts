import { RootState } from "@redux/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  DateType,
  PostedSputumSampleType,
  ReceivedSputumType,
  ReduxSputumCollectionType,
  ReduxSputumCultureResultType,
  ReduxSputumSampleType,
  ReduxSputumSmearResultType,
  ReduxSputumType,
} from "@/applicant";
import { ApplicationStatus, BackendApplicationStatus, PositiveOrNegative } from "@/utils/enums";

const initialState: ReduxSputumType = {
  status: ApplicationStatus.NOT_YET_STARTED,
  sample1: {
    collection: {
      submittedToDatabase: false,
      dateOfSample: {
        year: "",
        month: "",
        day: "",
      },
      collectionMethod: "",
    },
    smearResults: {
      submittedToDatabase: false,
      smearResult: PositiveOrNegative.NOT_YET_ENTERED,
    },
    cultureResults: {
      submittedToDatabase: false,
      cultureResult: PositiveOrNegative.NOT_YET_ENTERED,
    },
    lastUpdatedDate: {
      year: "",
      month: "",
      day: "",
    },
  },
  sample2: {
    collection: {
      submittedToDatabase: false,
      dateOfSample: {
        year: "",
        month: "",
        day: "",
      },
      collectionMethod: "",
    },
    smearResults: {
      submittedToDatabase: false,
      smearResult: PositiveOrNegative.NOT_YET_ENTERED,
    },
    cultureResults: {
      submittedToDatabase: false,
      cultureResult: PositiveOrNegative.NOT_YET_ENTERED,
    },
    lastUpdatedDate: {
      year: "",
      month: "",
      day: "",
    },
  },
  sample3: {
    collection: {
      submittedToDatabase: false,
      dateOfSample: {
        year: "",
        month: "",
        day: "",
      },
      collectionMethod: "",
    },
    smearResults: {
      submittedToDatabase: false,
      smearResult: PositiveOrNegative.NOT_YET_ENTERED,
    },
    cultureResults: {
      submittedToDatabase: false,
      cultureResult: PositiveOrNegative.NOT_YET_ENTERED,
    },
    lastUpdatedDate: {
      year: "",
      month: "",
      day: "",
    },
  },
};

export const sputumSlice = createSlice({
  name: "sputumDetails",
  initialState,
  reducers: {
    setSputumStatus: (state, action: PayloadAction<ApplicationStatus>) => {
      state.status = action.payload;
    },
    setSample1Collection: (state, action: PayloadAction<ReduxSputumCollectionType>) => {
      state.sample1.collection = action.payload;
    },
    setSample2Collection: (state, action: PayloadAction<ReduxSputumCollectionType>) => {
      state.sample2.collection = action.payload;
    },
    setSample3Collection: (state, action: PayloadAction<ReduxSputumCollectionType>) => {
      state.sample3.collection = action.payload;
    },
    setSample1SmearResults: (state, action: PayloadAction<ReduxSputumSmearResultType>) => {
      state.sample1.smearResults = action.payload;
    },
    setSample2SmearResults: (state, action: PayloadAction<ReduxSputumSmearResultType>) => {
      state.sample2.smearResults = action.payload;
    },
    setSample3SmearResults: (state, action: PayloadAction<ReduxSputumSmearResultType>) => {
      state.sample3.smearResults = action.payload;
    },
    setSample1CultureResults: (state, action: PayloadAction<ReduxSputumCultureResultType>) => {
      state.sample1.cultureResults = action.payload;
    },
    setSample2CultureResults: (state, action: PayloadAction<ReduxSputumCultureResultType>) => {
      state.sample2.cultureResults = action.payload;
    },
    setSample3CultureResults: (state, action: PayloadAction<ReduxSputumCultureResultType>) => {
      state.sample3.cultureResults = action.payload;
    },
    setSample1LastUpdatedDate: (state, action: PayloadAction<DateType>) => {
      state.sample1.lastUpdatedDate = action.payload;
    },
    setSample2LastUpdatedDate: (state, action: PayloadAction<DateType>) => {
      state.sample2.lastUpdatedDate = action.payload;
    },
    setSample3LastUpdatedDate: (state, action: PayloadAction<DateType>) => {
      state.sample3.lastUpdatedDate = action.payload;
    },
    setSputumDetails: (state, action: PayloadAction<ReduxSputumType>) => {
      const setCollectionDetails = (
        source: ReduxSputumCollectionType | undefined,
        target: ReduxSputumCollectionType,
      ) => {
        target.collectionMethod = source?.collectionMethod ?? "";
        target.dateOfSample = source?.dateOfSample ?? { year: "", month: "", day: "" };
        target.submittedToDatabase = source?.submittedToDatabase ?? false;
      };

      setCollectionDetails(action.payload.sample1?.collection, state.sample1.collection);
      setCollectionDetails(action.payload.sample2?.collection, state.sample2.collection);
      setCollectionDetails(action.payload.sample3?.collection, state.sample3.collection);

      const setSmearResults = (
        smearResult: ReduxSputumSmearResultType | undefined,
        target: ReduxSputumSmearResultType,
      ) => {
        if (smearResult) {
          target.submittedToDatabase = smearResult.submittedToDatabase;
          target.smearResult = smearResult.smearResult;
        } else {
          target.submittedToDatabase = false;
          target.smearResult = PositiveOrNegative.NOT_YET_ENTERED;
        }
      };

      setSmearResults(action.payload.sample1?.smearResults, state.sample1.smearResults);
      setSmearResults(action.payload.sample2?.smearResults, state.sample2.smearResults);
      setSmearResults(action.payload.sample3?.smearResults, state.sample3.smearResults);

      const setCultureResults = (
        cultureResult: ReduxSputumCultureResultType | undefined,
        target: ReduxSputumCultureResultType,
      ) => {
        if (cultureResult) {
          target.submittedToDatabase = cultureResult.submittedToDatabase;
          target.cultureResult = cultureResult.cultureResult;
        } else {
          target.submittedToDatabase = false;
          target.cultureResult = PositiveOrNegative.NOT_YET_ENTERED;
        }
      };

      setCultureResults(action.payload.sample1?.cultureResults, state.sample1.cultureResults);
      setCultureResults(action.payload.sample2?.cultureResults, state.sample2.cultureResults);
      setCultureResults(action.payload.sample3?.cultureResults, state.sample3.cultureResults);

      state.sample1.lastUpdatedDate = action.payload.sample1.lastUpdatedDate ?? {
        year: "",
        month: "",
        day: "",
      };
      state.sample2.lastUpdatedDate = action.payload.sample2.lastUpdatedDate ?? {
        year: "",
        month: "",
        day: "",
      };
      state.sample3.lastUpdatedDate = action.payload.sample3.lastUpdatedDate ?? {
        year: "",
        month: "",
        day: "",
      };
    },
    clearSputumDetails: () => {
      JSON.parse(JSON.stringify(initialState));
    },
    setSputumDetailsFromApiResponse: (state, action: PayloadAction<ReceivedSputumType>) => {
      state.status =
        action.payload.status == BackendApplicationStatus.COMPLETE
          ? ApplicationStatus.COMPLETE
          : ApplicationStatus.IN_PROGRESS;

      const setCollectionDetails = (
        sampleData: PostedSputumSampleType | undefined,
        target: ReduxSputumSampleType,
      ) => {
        if (sampleData) {
          const [year, month, day] = sampleData.dateOfSample.split("-");
          target.collection.dateOfSample = { year, month, day };
          target.collection.collectionMethod = sampleData.collectionMethod;
        } else {
          target.collection.dateOfSample = { year: "", month: "", day: "" };
          target.collection.collectionMethod = "";
        }
      };

      setCollectionDetails(action.payload.sample1, state.sample1);
      setCollectionDetails(action.payload.sample2, state.sample2);
      setCollectionDetails(action.payload.sample3, state.sample3);

      const setSmearResults = (
        smearResult: PositiveOrNegative | undefined,
        target: ReduxSputumSampleType,
      ) => {
        if (smearResult) {
          target.smearResults.smearResult = smearResult;
          target.smearResults.submittedToDatabase = true;
        } else {
          target.smearResults.smearResult = PositiveOrNegative.NOT_YET_ENTERED;
          target.smearResults.submittedToDatabase = false;
        }
      };

      setSmearResults(action.payload.sample1?.smearResult, state.sample1);
      setSmearResults(action.payload.sample2?.smearResult, state.sample2);
      setSmearResults(action.payload.sample3?.smearResult, state.sample3);

      const setCultureResults = (
        cultureResult: PositiveOrNegative | undefined,
        target: ReduxSputumSampleType,
      ) => {
        if (cultureResult) {
          target.cultureResults.cultureResult = cultureResult;
          target.cultureResults.submittedToDatabase = true;
        } else {
          target.cultureResults.cultureResult = PositiveOrNegative.NOT_YET_ENTERED;
          target.cultureResults.submittedToDatabase = false;
        }
      };

      setCultureResults(action.payload.sample1?.cultureResult, state.sample1);
      setCultureResults(action.payload.sample2?.cultureResult, state.sample2);
      setCultureResults(action.payload.sample3?.cultureResult, state.sample3);

      const setLastUpdatedDate = (
        sampleData: { dateUpdated: string } | undefined,
        target: ReduxSputumSampleType,
      ) => {
        if (sampleData) {
          const [year, month, day] = sampleData.dateUpdated.split("-");
          target.lastUpdatedDate = { year, month, day };
        } else {
          target.lastUpdatedDate = { year: "", month: "", day: "" };
        }
      };

      setLastUpdatedDate(action.payload.sample1, state.sample1);
      setLastUpdatedDate(action.payload.sample2, state.sample2);
      setLastUpdatedDate(action.payload.sample3, state.sample3);
    },
  },
});

export const {
  setSputumStatus,
  setSample1Collection,
  setSample2Collection,
  setSample3Collection,
  setSample1SmearResults,
  setSample2SmearResults,
  setSample3SmearResults,
  setSample1CultureResults,
  setSample2CultureResults,
  setSample3CultureResults,
  setSample1LastUpdatedDate,
  setSample2LastUpdatedDate,
  setSample3LastUpdatedDate,
  setSputumDetails,
  clearSputumDetails,
  setSputumDetailsFromApiResponse,
} = sputumSlice.actions;

export const sputumReducer = sputumSlice.reducer;

export const selectSputum = (state: RootState) => state.sputum;
