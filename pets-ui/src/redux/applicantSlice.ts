import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApplicantDetailsType } from '@/sections/applicant-form';
import { DateType } from '@/components/dateTextInput/dateTextInput';


const initialState: ApplicantDetailsType = {
  fullName: "",
  sex: "",
  dateOfBirth: {
    year: "",
    month: "",
    day: ""
  },
  countryOfNationality: "",
  passportNumber: "",
  countryOfIssue: "",
  passportIssueDate: {
    year: "",
    month: "",
    day: ""
  },
  passportExpiryDate: {
    year: "",
    month: "",
    day: ""
  },
  applicantHomeAddress1: "",
  applicantHomeAddress2: "",
  applicantHomeAddress3: "",
  townOrCity: "",
  provinceOrState: "",
  country: "",
  postcode: ""
};

export const applicantSlice = createSlice({
  name: 'applicantDetails',
  initialState,
  reducers: {
    setFullName: (state, action: PayloadAction<string>) => {
      state.fullName = action.payload;
    },
    setSex: (state, action: PayloadAction<string>) => {
      state.sex = action.payload;
    },
    setDob: (state, action: PayloadAction<DateType>) => {
      state.dateOfBirth = action.payload;
    },
    setCountryOfNationality: (state, action: PayloadAction<string>) => {
      state.countryOfNationality = action.payload;
    },
    setPassportNumber: (state, action: PayloadAction<string>) => {
      state.passportNumber = action.payload;
    },
    setCountryOfIssue: (state, action: PayloadAction<string>) => {
      state.countryOfIssue = action.payload;
    },
    setPassportIssueDate: (state, action: PayloadAction<DateType>) => {
      state.passportIssueDate = action.payload;
    },
    setPassportExpiryDate: (state, action: PayloadAction<DateType>) => {
      state.passportExpiryDate = action.payload;
    },
    setApplicantHomeAddress1: (state, action: PayloadAction<string>) => {
      state.applicantHomeAddress1 = action.payload;
    },
    setApplicantHomeAddress2: (state, action: PayloadAction<string>) => {
      state.applicantHomeAddress2 = action.payload;
    },
    setApplicantHomeAddress3: (state, action: PayloadAction<string>) => {
      state.applicantHomeAddress3 = action.payload;
    },
    setTownOrCity: (state, action: PayloadAction<string>) => {
      state.townOrCity = action.payload;
    },
    setProvinceOrState: (state, action: PayloadAction<string>) => {
      state.provinceOrState = action.payload;
    },
    setCountry: (state, action: PayloadAction<string>) => {
      state.country = action.payload;
    },
    setPostcode: (state, action: PayloadAction<string>) => {
      state.postcode = action.payload;
    },
    clearApplicantDetails: (state) => {
      state.fullName = '';
      state.sex = '';
      state.dateOfBirth = {
        year: "",
        month: "",
        day: ""
      };
      state.countryOfNationality = "";
      state.passportNumber = "";
      state.countryOfIssue = "";
      state.passportIssueDate = {
        year: "",
        month: "",
        day: ""
      };
      state.passportExpiryDate = {
        year: "",
        month: "",
        day: ""
      };
      state.applicantHomeAddress1 = "";
      state.applicantHomeAddress2 = "";
      state.applicantHomeAddress3 = "";
      state.townOrCity = "";
      state.provinceOrState = "";
      state.country = "";
      state.postcode = "";
    },
  },
});


export const {
  setFullName,
  setSex,
  setDob,
  setCountryOfNationality,
  setPassportNumber,
  setCountryOfIssue,
  setPassportIssueDate,
  setPassportExpiryDate,
  setApplicantHomeAddress1,
  setApplicantHomeAddress2,
  setApplicantHomeAddress3,
  setTownOrCity,
  setProvinceOrState,
  setCountry,
  setPostcode,
  clearApplicantDetails,
} = applicantSlice.actions;

export const applicantReducer = applicantSlice.reducer;
