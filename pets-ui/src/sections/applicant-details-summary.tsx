import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { createNewApplication, postApplicantDetails } from "@/api/api";
import Button from "@/components/button/button";
import Summary from "@/components/summary/summary";
import { useApplicantPhoto } from "@/context/applicantPhotoContext";
import { setApplicantDetailsStatus } from "@/redux/applicantSlice";
import { setApplicationDetails } from "@/redux/applicationSlice";
import { useAppSelector } from "@/redux/hooks";
import { selectApplicant } from "@/redux/store";
import { ApplicationStatus, ButtonType, ImageType } from "@/utils/enums";
import { formatDateForDisplay, getCountryName, standardiseDayOrMonth } from "@/utils/helpers";
import { attributeToComponentId } from "@/utils/records";
import uploadFile from "@/utils/uploadFile";

import Spinner from "../components/spinner/spinner";

const ApplicantReview = () => {
  const applicantData = useAppSelector(selectApplicant);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const { applicantPhotoFile } = useApplicantPhoto();

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const applicationRes = await createNewApplication();
      dispatch(setApplicationDetails(applicationRes.data));

      const dateOfBirthStr = `${applicantData.dateOfBirth.year}-${standardiseDayOrMonth(applicantData.dateOfBirth.month)}-${standardiseDayOrMonth(applicantData.dateOfBirth.day)}`;
      const issueDateStr = `${applicantData.passportIssueDate.year}-${standardiseDayOrMonth(applicantData.passportIssueDate.month)}-${standardiseDayOrMonth(applicantData.passportIssueDate.day)}`;
      const expiryDateStr = `${applicantData.passportExpiryDate.year}-${standardiseDayOrMonth(applicantData.passportExpiryDate.month)}-${standardiseDayOrMonth(applicantData.passportExpiryDate.day)}`;
      await postApplicantDetails(applicationRes.data.applicationId, {
        fullName: applicantData.fullName,
        sex: applicantData.sex,
        dateOfBirth: dateOfBirthStr,
        countryOfNationality: applicantData.countryOfNationality,
        passportNumber: applicantData.passportNumber,
        countryOfIssue: applicantData.countryOfIssue,
        issueDate: issueDateStr,
        expiryDate: expiryDateStr,
        applicantHomeAddress1: applicantData.applicantHomeAddress1,
        applicantHomeAddress2: applicantData.applicantHomeAddress2,
        applicantHomeAddress3: applicantData.applicantHomeAddress3,
        townOrCity: applicantData.townOrCity,
        provinceOrState: applicantData.provinceOrState,
        country: applicantData.country,
        postcode: applicantData.postcode,
      });

      // Upload applicant photo if it exists
      if (applicantData.applicantPhotoFileName && applicantPhotoFile) {
        const fileType = applicantPhotoFile.name.split(".").pop();
        await uploadFile(
          applicantPhotoFile,
          `applicant-photo.${fileType}`,
          applicationRes.data.applicationId,
          ImageType.Photo,
        );
      }

      dispatch(setApplicantDetailsStatus(ApplicationStatus.COMPLETE));
      navigate("/visa-applicant-details-confirmed");
    } catch (error) {
      console.error(error);
      navigate("/error");
    }
  };

  const summaryData = [
    {
      key: "Name",
      value: applicantData.fullName,
      link: `/enter-applicant-information#${attributeToComponentId.fullName}`,
      hiddenLabel: "name",
    },
    {
      key: "Sex",
      value: applicantData.sex,
      link: `/enter-applicant-information#${attributeToComponentId.sex}`,
      hiddenLabel: "sex",
    },
    {
      key: "Country of nationality",
      value: getCountryName(applicantData.countryOfNationality),
      link: `/enter-applicant-information#${attributeToComponentId.countryOfNationality}`,
      hiddenLabel: "country of nationality",
    },
    {
      key: "Date of birth",
      value: formatDateForDisplay(applicantData.dateOfBirth),
      link: `/enter-applicant-information#${attributeToComponentId.dateOfBirth}`,
      hiddenLabel: "date of birth",
    },
    {
      key: "Passport number",
      value: applicantData.passportNumber,
      link: `/enter-applicant-information#${attributeToComponentId.passportNumber}`,
      hiddenLabel: "passport number",
    },
    {
      key: "Country of issue",
      value: getCountryName(applicantData.countryOfIssue),
      link: `/enter-applicant-information#${attributeToComponentId.countryOfIssue}`,
      hiddenLabel: "country of issue",
    },
    {
      key: "Passport issue date",
      value: `${applicantData.passportIssueDate.day}/${applicantData.passportIssueDate.month}/${applicantData.passportIssueDate.year}`,
      link: `/enter-applicant-information#${attributeToComponentId.passportIssueDate}`,
      value: formatDateForDisplay(applicantData.passportIssueDate),
      link: `/enter-applicant-information#${attributeToComponentId.passportIssueDate}`,
      hiddenLabel: "passport issue date",
    },
    {
      key: "Passport expiry date",
      value: `${applicantData.passportExpiryDate.day}/${applicantData.passportExpiryDate.month}/${applicantData.passportExpiryDate.year}`,
      link: `/enter-applicant-information#${attributeToComponentId.passportExpiryDate}`,
      value: formatDateForDisplay(applicantData.passportExpiryDate),
      link: `/enter-applicant-information#${attributeToComponentId.passportExpiryDate}`,
      hiddenLabel: "passport expiry date",
    },
    {
      key: "Home address line 1",
      value: applicantData.applicantHomeAddress1,
      link: `/enter-applicant-information#${attributeToComponentId.applicantHomeAddress1}`,
      hiddenLabel: "home address line 1",
    },
    {
      key: "Home address line 2",
      value: applicantData.applicantHomeAddress2,
      link: `/enter-applicant-information#${attributeToComponentId.applicantHomeAddress2}`,
      hiddenLabel: "home address line 2",
      emptyValueText: "Enter home address line 2 (optional)",
    },
    {
      key: "Home address line 3",
      value: applicantData.applicantHomeAddress3,
      link: `/enter-applicant-information#${attributeToComponentId.applicantHomeAddress3}`,
      hiddenLabel: "home address line 3",
      emptyValueText: "Enter home address line 3 (optional)",
    },
    {
      key: "Town or city",
      value: applicantData.townOrCity,
      link: `/enter-applicant-information#${attributeToComponentId.townOrCity}`,
      hiddenLabel: "home town or city",
    },
    {
      key: "Province or state",
      value: applicantData.provinceOrState,
      link: `/enter-applicant-information#${attributeToComponentId.provinceOrState}`,
      hiddenLabel: "home province or state",
    },
    {
      key: "Country",
      value: getCountryName(applicantData.country),
      link: `/enter-applicant-information#${attributeToComponentId.country}`,
      hiddenLabel: "country",
    },
    {
      key: "Postcode",
      value: applicantData.postcode,
      link: `/enter-applicant-information#${attributeToComponentId.postcode}`,
      hiddenLabel: "postcode",
      emptyValueText: "Enter postcode (optional)",
    },
    {
      key: "Applicant Photo",
      value: applicantData.applicantPhotoFileName,
      link: "/upload-visa-applicant-photo",
      hiddenLabel: "applicant photo",
      emptyValueText: "Upload visa applicant photo (optional)",
    },
  ];

  return (
    <div>
      {isLoading && <Spinner />}
      <Summary status={applicantData.status} summaryElements={summaryData} />

      {(applicantData.status == ApplicationStatus.NOT_YET_STARTED ||
        applicantData.status == ApplicationStatus.IN_PROGRESS) && (
        <Button
          id="confirm"
          type={ButtonType.DEFAULT}
          text="Save and continue"
          handleClick={handleSubmit}
        />
      )}
      {(applicantData.status == ApplicationStatus.COMPLETE ||
        applicantData.status == ApplicationStatus.NOT_REQUIRED) && (
        <Button
          id="back-to-tracker"
          type={ButtonType.DEFAULT}
          text="Return to tracker"
          handleClick={() => navigate("/tracker")}
        />
      )}
    </div>
  );
};

export default ApplicantReview;
