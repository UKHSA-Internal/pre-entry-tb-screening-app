import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { postTravelDetails } from "@/api/api";
import Button from "@/components/button/button";
import Spinner from "@/components/spinner/spinner";
import Summary from "@/components/summary/summary";
import { useAppSelector } from "@/redux/hooks";
import { selectApplication, selectTravel } from "@/redux/store";
import { setTravelDetailsStatus } from "@/redux/travelSlice";
import { ApplicationStatus, ButtonType } from "@/utils/enums";
import { attributeToComponentId } from "@/utils/records";

const TravelReview = () => {
  const applicationData = useAppSelector(selectApplication);
  const travelData = useAppSelector(selectTravel);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const summaryStatus =
    travelData.status === ApplicationStatus.COMPLETE
      ? ApplicationStatus.IN_PROGRESS
      : travelData.status;

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await postTravelDetails(applicationData.applicationId, {
        visaCategory: travelData.visaCategory,
        ukAddressLine1: travelData.applicantUkAddress1,
        ukAddressLine2: travelData.applicantUkAddress2,
        ukAddressLine3: travelData.applicantUkAddress3,
        ukAddressTownOrCity: travelData.townOrCity,
        ukAddressPostcode: travelData.postcode,
        ukMobileNumber: travelData.ukMobileNumber,
        ukEmailAddress: travelData.ukEmail,
      });

      dispatch(setTravelDetailsStatus(ApplicationStatus.COMPLETE));
      navigate("/travel-information-confirmed");
    } catch (error) {
      console.error(error);
      navigate("/sorry-there-is-problem-with-service");
    }
  };

  const summaryData = [
    {
      key: "Visa category",
      value: travelData.visaCategory,
      link: `/proposed-visa-category?from=/check-travel-information#${attributeToComponentId.visaCategory}`,
      hiddenLabel: "visa category (optional)",
    },
    {
      key: "Address line 1 (optional)",
      value: travelData.applicantUkAddress1,
      link: `/visa-applicant-proposed-uk-address?from=/check-travel-information#${attributeToComponentId.applicantUkAddress1}`,
      hiddenLabel: "address line 1 (optional)",
    },
    {
      key: "Address line 2 (optional)",
      value: travelData.applicantUkAddress2,
      link: `/visa-applicant-proposed-uk-address?from=/check-travel-information#${attributeToComponentId.applicantUkAddress2}`,
      hiddenLabel: "address line 2 (optional)",
    },
    {
      key: "Address line 3 (optional)",
      value: travelData.applicantUkAddress3,
      link: `/visa-applicant-proposed-uk-address?from=/check-travel-information#${attributeToComponentId.applicantUkAddress3}`,
      hiddenLabel: "address line 3 (optional)",
    },
    {
      key: "Town or city (optional)",
      value: travelData.townOrCity,
      link: `/visa-applicant-proposed-uk-address?from=/check-travel-information#${attributeToComponentId.townOrCity}`,
      hiddenLabel: "town or city (optional)",
    },
    {
      key: "Postcode (optional)",
      value: travelData.postcode,
      link: `/visa-applicant-proposed-uk-address?from=/check-travel-information#${attributeToComponentId.postcode}`,
      hiddenLabel: "postcode (optional)",
    },
    {
      key: "UK phone number (optional)",
      value: travelData.ukMobileNumber,
      link: `/visa-applicant-proposed-uk-address?from=/check-travel-information#${attributeToComponentId.ukMobileNumber}`,
      hiddenLabel: "UK phone number (optional)",
    },
    {
      key: "UK email address (optional)",
      value: travelData.ukEmail,
      link: `/visa-applicant-proposed-uk-address?from=/check-travel-information#${attributeToComponentId.ukEmail}`,
      hiddenLabel: "UK email address (optional)",
    },
  ];

  return (
    <div>
      {isLoading && <Spinner />}
      <Summary status={summaryStatus} summaryElements={summaryData} />

      {(travelData.status == ApplicationStatus.NOT_YET_STARTED ||
        travelData.status == ApplicationStatus.IN_PROGRESS) && (
        <Button
          id="submit"
          type={ButtonType.DEFAULT}
          text="Submit and continue"
          handleClick={handleSubmit}
        />
      )}
      {(travelData.status == ApplicationStatus.COMPLETE ||
        travelData.status == ApplicationStatus.NOT_REQUIRED) && (
        <Button
          id="submit"
          type={ButtonType.DEFAULT}
          text="Submit and continue"
          handleClick={() => navigate("/tracker")}
        />
      )}
    </div>
  );
};

export default TravelReview;
