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

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await postTravelDetails(applicationData.applicationId, {
        visaCategory: travelData.visaCategory,
        ukAddressLine1: travelData.applicantUkAddress1,
        ukAddressLine2: travelData.applicantUkAddress2,
        ukAddressTownOrCity: travelData.townOrCity,
        ukAddressPostcode: travelData.postcode,
        ukMobileNumber: travelData.ukMobileNumber,
        ukEmailAddress: travelData.ukEmail,
      });

      dispatch(setTravelDetailsStatus(ApplicationStatus.COMPLETE));
      navigate("/travel-information-confirmed");
    } catch (error) {
      console.error(error);
      navigate("/error");
    }
  };

  const summaryData = [
    {
      key: "Visa category",
      value: travelData.visaCategory,
      link: `/travel-information#${attributeToComponentId.visaCategory}`,
      hiddenLabel: "visa category",
    },
    {
      key: "UK address line 1",
      value: travelData.applicantUkAddress1,
      link: `/travel-information#${attributeToComponentId.applicantUkAddress1}`,
      hiddenLabel: "UK address line 1",
    },
    {
      key: "UK address line 2",
      value: travelData.applicantUkAddress2,
      link: `/travel-information#${attributeToComponentId.applicantUkAddress2}`,
      hiddenLabel: "UK address line 2",
    },
    {
      key: "UK town or city",
      value: travelData.townOrCity,
      link: `/travel-information#${attributeToComponentId.townOrCity}`,
      hiddenLabel: "town or city",
    },
    {
      key: "UK postcode",
      value: travelData.postcode,
      link: `/travel-information#${attributeToComponentId.postcode}`,
      hiddenLabel: "postcode",
    },
    {
      key: "UK mobile number",
      value: travelData.ukMobileNumber,
      link: `/travel-information#${attributeToComponentId.ukMobileNumber}`,
      hiddenLabel: "UK mobile number",
    },
    {
      key: "UK email address",
      value: travelData.ukEmail,
      link: `/travel-information#${attributeToComponentId.ukEmail}`,
      hiddenLabel: "UK email address",
    },
  ];

  return (
    <div>
      {isLoading && <Spinner />}
      <Summary status={travelData.status} summaryElements={summaryData} />

      {(travelData.status == ApplicationStatus.NOT_YET_STARTED ||
        travelData.status == ApplicationStatus.IN_PROGRESS) && (
        <Button
          id="confirm"
          type={ButtonType.DEFAULT}
          text="Save and continue"
          handleClick={handleSubmit}
        />
      )}
      {(travelData.status == ApplicationStatus.COMPLETE ||
        travelData.status == ApplicationStatus.NOT_REQUIRED) && (
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

export default TravelReview;
