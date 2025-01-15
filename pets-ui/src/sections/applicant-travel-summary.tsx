import Button from '@/components/button/button';
import { ButtonType } from '@/utils/enums';
import { useAppSelector } from '@/redux/hooks'
import { selectTravel } from '@/redux/travelSlice';
import { useNavigate } from 'react-router-dom';

const TravelReview = () => {
  const travelData = useAppSelector(selectTravel);
  const navigate = useNavigate()

  const handleSubmit = () => {
    // TO DO: post travelData
    navigate("/travel-confirmation")
  }

  return(
      <div>
        <dl className="govuk-summary-list">
          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">
              Visa type
            </dt>
            <dd className="govuk-summary-list__value">
              {travelData.visaType}
            </dd>
            <dd className="govuk-summary-list__actions">
              <a className="govuk-link" style={{color: "#1d70b8"}} onClick={() => navigate("/travel-details#visa-type")}>
                Change<span className="govuk-visually-hidden"> visa type</span>
              </a>
            </dd>
          </div>
          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">
              UK Address Line 1
            </dt>
            <dd className="govuk-summary-list__value">
              {travelData.applicantUkAddress1}
            </dd>
            <dd className="govuk-summary-list__actions">
              <a className="govuk-link" style={{color: "#1d70b8"}} onClick={() => navigate("/travel-details#address-1")}>
                Change<span className="govuk-visually-hidden"> UK address line 1</span>
              </a>
            </dd>
          </div>
          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">
              UK Address Line 2
            </dt>
            <dd className="govuk-summary-list__value">
              {travelData.applicantUkAddress2}
            </dd>
            <dd className="govuk-summary-list__actions">
            <a className="govuk-link" style={{color: "#1d70b8"}} onClick={() => navigate("/travel-details#address-2")}>
                Change<span className="govuk-visually-hidden"> UK address line 2</span>
              </a>
            </dd>
          </div>
          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">
              UK Town or City
            </dt>
            <dd className="govuk-summary-list__value">
              {travelData.townOrCity}
            </dd>
            <dd className="govuk-summary-list__actions">
              <a className="govuk-link" style={{color: "#1d70b8"}} onClick={() => navigate("/travel-details#town-or-city")}>
                Change<span className="govuk-visually-hidden"> town or city</span>
              </a>
            </dd>
          </div>
          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">
              UK Postcode
            </dt>
            <dd className="govuk-summary-list__value">
              {travelData.postcode}
            </dd>
            <dd className="govuk-summary-list__actions">
              <a className="govuk-link" style={{color: "#1d70b8"}} onClick={() => navigate("/travel-details#postcode")}>
                Change<span className="govuk-visually-hidden"> postcode</span>
              </a>
            </dd>
          </div>
          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">
              UK Mobile Number
            </dt>
            <dd className="govuk-summary-list__value">
              {travelData.ukMobileNumber}
            </dd>
            <dd className="govuk-summary-list__actions">
              <a className="govuk-link" style={{color: "#1d70b8"}} onClick={() => navigate("/travel-details#mobile-number")}>
                Change<span className="govuk-visually-hidden"> UK mobile number</span>
              </a>
            </dd>
          </div>
          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">
              UK Email Address
            </dt>
            <dd className="govuk-summary-list__value">
              {travelData.ukEmail}
            </dd>
            <dd className="govuk-summary-list__actions">
              <a className="govuk-link" style={{color: "#1d70b8"}} onClick={() => navigate("/travel-details#email")}>
                Change<span className="govuk-visually-hidden"> UK email address</span>
              </a>
            </dd>
          </div>
        </dl>
        <Button
          id="confirm"
          type={ButtonType.DEFAULT}
          text="Confirm"
          href="/travel-confirmation"
          handleClick={handleSubmit}/>
      </div>
  )
}

export default TravelReview;
