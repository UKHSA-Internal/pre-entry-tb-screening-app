import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { postTravelDetails } from "@/api/api";
import Button from "@/components/button/button";
import Summary from "@/components/summary/summary";
import { selectApplication } from "@/redux/applicationSlice";
import { useAppSelector } from "@/redux/hooks";
import { selectTravel, setTravelDetailsStatus } from "@/redux/travelSlice";
import { ApplicationStatus, ButtonType } from "@/utils/enums";
import { attributeToComponentId } from "@/utils/records";

const TravelReview = () => {
  const applicationData = useAppSelector(selectApplication);
  const travelData = useAppSelector(selectTravel);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await postTravelDetails(applicationData.applicationId, {
        visaCategory: travelData.visaType,
        ukAddressLine1: travelData.applicantUkAddress1,
        ukAddressLine2: travelData.applicantUkAddress2,
        ukAddressTownOrCity: travelData.townOrCity,
        ukAddressPostcode: travelData.postcode,
        ukMobileNumber: travelData.ukMobileNumber,
        ukEmailAddress: travelData.ukEmail,
      });

      dispatch(setTravelDetailsStatus(ApplicationStatus.COMPLETE));
      navigate("/travel-confirmation");
    } catch (error) {
      console.error(error);
      navigate("/error");
    }
  };

  const summaryData = [
    {
      key: "Visa type",
      value: travelData.visaType,
      link: `/travel-details#${attributeToComponentId.visaType}`,
      hiddenLabel: "visa type",
    },
    {
      key: "UK address line 1",
      value: travelData.applicantUkAddress1,
      link: `/travel-details#${attributeToComponentId.applicantUkAddress1}`,
      hiddenLabel: "UK address line 1",
    },
    {
      key: "UK address line 2",
      value: travelData.applicantUkAddress2,
      link: `/travel-details#${attributeToComponentId.applicantUkAddress2}`,
      hiddenLabel: "UK address line 2",
    },
    {
      key: "UK town or city",
      value: travelData.townOrCity,
      link: `/travel-details#${attributeToComponentId.townOrCity}`,
      hiddenLabel: "town or city",
    },
    {
      key: "UK postcode",
      value: travelData.postcode,
      link: `/travel-details#${attributeToComponentId.postcode}`,
      hiddenLabel: "postcode",
    },
    {
      key: "UK mobile number",
      value: travelData.ukMobileNumber,
      link: `/travel-details#${attributeToComponentId.ukMobileNumber}`,
      hiddenLabel: "UK mobile number",
    },
    {
      key: "UK email address",
      value: travelData.ukEmail,
      link: `/travel-details#${attributeToComponentId.ukEmail}`,
      hiddenLabel: "UK email address",
    },
  ];

  return (
    <div>
      <Summary status={travelData.status} summaryElements={summaryData} />

      {travelData.status == ApplicationStatus.INCOMPLETE && (
        <Button
          id="confirm"
          type={ButtonType.DEFAULT}
          text="Save and continue"
          href="/travel-confirmation"
          handleClick={handleSubmit}
        />
      )}
      {travelData.status == ApplicationStatus.COMPLETE && (
        <Button
          id="back-to-tracker"
          type={ButtonType.DEFAULT}
          text="Return to tracker"
          href="/tracker"
          handleClick={() => navigate("/tracker")}
        />
      )}
    </div>
  );
};

export default TravelReview;
