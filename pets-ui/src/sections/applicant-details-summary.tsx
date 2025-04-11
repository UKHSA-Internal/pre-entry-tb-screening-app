import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { createNewApplication, postApplicantDetails } from "@/api/api";
import Button from "@/components/button/button";
import Summary from "@/components/summary/summary";
import { selectApplicant, setApplicantDetailsStatus } from "@/redux/applicantSlice";
import { setApplicationDetails } from "@/redux/applicationSlice";
import { useAppSelector } from "@/redux/hooks";
import { ApplicationStatus, ButtonType } from "@/utils/enums";
import { standardiseDayOrMonth } from "@/utils/helpers";
import { attributeToComponentId } from "@/utils/records";

import Spinner from "../components/spinner/spinner";

const ApplicantReview = () => {
  const applicantData = useAppSelector(selectApplicant);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

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

      dispatch(setApplicantDetailsStatus(ApplicationStatus.COMPLETE));
      navigate("/applicant-confirmation");
    } catch (error) {
      console.error(error);
      navigate("/error");
    }
  };

  const summaryData = [
    {
      key: "Name",
      value: applicantData.fullName,
      link: `/contact#${attributeToComponentId.fullName}`,
      hiddenLabel: "name",
    },
    {
      key: "Sex",
      value: applicantData.sex,
      link: `/contact#${attributeToComponentId.sex}`,
      hiddenLabel: "sex",
    },
    {
      key: "Country of nationality",
      value: applicantData.countryOfNationality,
      link: `/contact#${attributeToComponentId.countryOfNationality}`,
      hiddenLabel: "country of nationality",
    },
    {
      key: "Date of birth",
      value: `${applicantData.dateOfBirth.day}/${applicantData.dateOfBirth.month}/${applicantData.dateOfBirth.year}`,
      link: `/contact#${attributeToComponentId.dateOfBirth}`,
      hiddenLabel: "date of birth",
    },
    {
      key: "Passport number",
      value: applicantData.passportNumber,
      link: `/contact#${attributeToComponentId.passportNumber}`,
      hiddenLabel: "passport number",
    },
    {
      key: "Country of issue",
      value: applicantData.countryOfIssue,
      link: `/contact#${attributeToComponentId.countryOfIssue}`,
      hiddenLabel: "country of issue",
    },
    {
      key: "Passport issue date",
      value: `${applicantData.passportIssueDate.day}/${applicantData.passportIssueDate.month}/${applicantData.passportIssueDate.year}`,
      link: `/contact#${attributeToComponentId.passportIssueDate}`,
      hiddenLabel: "passport issue date",
    },
    {
      key: "Passport expiry date",
      value: `${applicantData.passportExpiryDate.day}/${applicantData.passportExpiryDate.month}/${applicantData.passportExpiryDate.year}`,
      link: `/contact#${attributeToComponentId.passportExpiryDate}`,
      hiddenLabel: "passport expiry date",
    },
    {
      key: "Home address line 1",
      value: applicantData.applicantHomeAddress1,
      link: `/contact#${attributeToComponentId.applicantHomeAddress1}`,
      hiddenLabel: "home address line 1",
    },
    {
      key: "Home address line 2",
      value: applicantData.applicantHomeAddress2,
      link: `/contact#${attributeToComponentId.applicantHomeAddress2}`,
      hiddenLabel: "home address line 2",
    },
    {
      key: "Home address line 3",
      value: applicantData.applicantHomeAddress3,
      link: `/contact#${attributeToComponentId.applicantHomeAddress3}`,
      hiddenLabel: "home address line 3",
    },
    {
      key: "Town or city",
      value: applicantData.townOrCity,
      link: `/contact#${attributeToComponentId.townOrCity}`,
      hiddenLabel: "home town or city",
    },
    {
      key: "Province or state",
      value: applicantData.provinceOrState,
      link: `/contact#${attributeToComponentId.provinceOrState}`,
      hiddenLabel: "home province or state",
    },
    {
      key: "Country",
      value: applicantData.country,
      link: `/contact#${attributeToComponentId.country}`,
      hiddenLabel: "country",
    },
    {
      key: "Postcode",
      value: applicantData.postcode,
      link: `/contact#${attributeToComponentId.postcode}`,
      hiddenLabel: "postcode",
    },
  ];

  return (
    <div>
      {isLoading && <Spinner />}
      <Summary status={applicantData.status} summaryElements={summaryData} />

      {applicantData.status == ApplicationStatus.INCOMPLETE && (
        <Button
          id="confirm"
          type={ButtonType.DEFAULT}
          text="Save and continue"
          handleClick={handleSubmit}
        />
      )}
      {applicantData.status == ApplicationStatus.COMPLETE && (
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
