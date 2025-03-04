import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { postTravelDetails } from "@/api/api";
import Button from "@/components/button/button";
import { selectApplication } from "@/redux/applicationSlice";
import { useAppSelector } from "@/redux/hooks";
import { selectTravel, setTravelDetailsStatus } from "@/redux/travelSlice";
import { ApplicationStatus, BackendApplicationStatus, ButtonType } from "@/utils/enums";

const TravelReview = () => {
  const applicationData = useAppSelector(selectApplication);
  const travelData = useAppSelector(selectTravel);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await postTravelDetails(applicationData.applicationId, {
        applicationId: applicationData.applicationId,
        dateCreated: applicationData.dateCreated,
        status: BackendApplicationStatus.COMPLETE,
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
    } catch {
      navigate("/error");
    }
  };

  return (
    <div>
      <dl className="govuk-summary-list">
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Visa type</dt>
          <dd className="govuk-summary-list__value">{travelData.visaType}</dd>
          <dd className="govuk-summary-list__actions">
            <Link
              className="govuk-link"
              style={{ color: "#1d70b8" }}
              to="/travel-details#visa-type"
            >
              Change<span className="govuk-visually-hidden"> visa type</span>
            </Link>
          </dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">UK Address Line 1</dt>
          <dd className="govuk-summary-list__value">{travelData.applicantUkAddress1}</dd>
          <dd className="govuk-summary-list__actions">
            <Link
              className="govuk-link"
              style={{ color: "#1d70b8" }}
              to="/travel-details#address-1"
            >
              Change<span className="govuk-visually-hidden"> UK address line 1</span>
            </Link>
          </dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">UK Address Line 2</dt>
          <dd className="govuk-summary-list__value">{travelData.applicantUkAddress2}</dd>
          <dd className="govuk-summary-list__actions">
            <Link
              className="govuk-link"
              style={{ color: "#1d70b8" }}
              to="/travel-details#address-2"
            >
              Change<span className="govuk-visually-hidden"> UK address line 2</span>
            </Link>
          </dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">UK Town or City</dt>
          <dd className="govuk-summary-list__value">{travelData.townOrCity}</dd>
          <dd className="govuk-summary-list__actions">
            <Link
              className="govuk-link"
              style={{ color: "#1d70b8" }}
              to="/travel-details#town-or-city"
            >
              Change<span className="govuk-visually-hidden"> town or city</span>
            </Link>
          </dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">UK Postcode</dt>
          <dd className="govuk-summary-list__value">{travelData.postcode}</dd>
          <dd className="govuk-summary-list__actions">
            <Link className="govuk-link" style={{ color: "#1d70b8" }} to="/travel-details#postcode">
              Change<span className="govuk-visually-hidden"> postcode</span>
            </Link>
          </dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">UK Mobile Number</dt>
          <dd className="govuk-summary-list__value">{travelData.ukMobileNumber}</dd>
          <dd className="govuk-summary-list__actions">
            <Link
              className="govuk-link"
              style={{ color: "#1d70b8" }}
              to="/travel-details#mobile-number"
            >
              Change<span className="govuk-visually-hidden"> UK mobile number</span>
            </Link>
          </dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">UK Email Address</dt>
          <dd className="govuk-summary-list__value">{travelData.ukEmail}</dd>
          <dd className="govuk-summary-list__actions">
            <Link className="govuk-link" style={{ color: "#1d70b8" }} to="/travel-details#email">
              Change<span className="govuk-visually-hidden"> UK email address</span>
            </Link>
          </dd>
        </div>
      </dl>
      <Button
        id="confirm"
        type={ButtonType.DEFAULT}
        text="Confirm"
        href="/travel-confirmation"
        handleClick={handleSubmit}
      />
    </div>
  );
};

export default TravelReview;
