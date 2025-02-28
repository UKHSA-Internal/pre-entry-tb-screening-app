import { Link, useNavigate } from "react-router-dom";

import { ChestXrayDetailsType } from "@/applicant";
import ApplicantDataHeader from "@/components/applicantDataHeader/applicantDataHeader";
import Button from "@/components/button/button";
import { selectApplicant } from "@/redux/applicantSlice";
import { selectChestXray } from "@/redux/chestXraySlice";
import { useAppSelector } from "@/redux/hooks";
import { ButtonType } from "@/utils/enums";

const ChestXraySummary = () => {
  const applicantData = useAppSelector(selectApplicant);
  const chestXrayData = useAppSelector(selectChestXray);
  const navigate = useNavigate();

  return (
    <div>
      <ApplicantDataHeader applicantData={applicantData} />
      <ChestXrayTakenSummaryDetails chestXrayData={chestXrayData} />
      <Button
        id="save-and-continue"
        type={ButtonType.DEFAULT}
        text="Save and continue"
        href="/chest-xray-confirmation"
        handleClick={() => navigate("/chest-xray-confirmation")}
      />
    </div>
  );
};

const ChestXrayTakenSummaryDetails = ({
  chestXrayData,
}: {
  chestXrayData: ChestXrayDetailsType;
}) => {
  return (
    <dl className="govuk-summary-list">
      <div className="govuk-summary-list__row">
        <dt className="govuk-summary-list__key">Select X-ray Status</dt>
        <dd className="govuk-summary-list__value">{chestXrayData.chestXrayTaken}</dd>
        <dd className="govuk-summary-list__actions">
          <Link
            className="govuk-link"
            style={{ color: "#1d70b8" }}
            to="/chest-xray-question#chestXrayTaken"
          >
            Change<span className="govuk-visually-hidden">Chest X-ray Status</span>
          </Link>
        </dd>
      </div>
      {chestXrayData.chestXrayTaken ? (
        <>
          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">Upload chest X-ray images</dt>
            <dd className="govuk-summary-list__value">{chestXrayData.posteroAnteriorXrayFile}</dd>
            <dd className="govuk-summary-list__actions">
              <Link className="govuk-link" style={{ color: "#1d70b8" }} to="/chest-xray-upload">
                Change<span className="govuk-visually-hidden">Upload Chest X-ray Images</span>
              </Link>
            </dd>
          </div>
          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">Enter X-ray Results and Findings</dt>
            <dd className="govuk-summary-list__value">{chestXrayData.xrayResult}</dd>
            <dd className="govuk-summary-list__actions">
              <Link className="govuk-link" style={{ color: "#1d70b8" }} to="/chest-xray-findings">
                Change
                <span className="govuk-visually-hidden">X-ray Results and Findings</span>
              </Link>
            </dd>
          </div>
        </>
      ) : (
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Enter reason X-ray not taken</dt>
          <dd className="govuk-summary-list__value">{chestXrayData.reasonXrayWasNotTaken}</dd>
          <dd className="govuk-summary-list__actions">
            <Link
              className="govuk-link"
              style={{ color: "#1d70b8" }}
              to="/chest-xray-not-taken#reasonXrayWasNotTaken"
            >
              Change<span className="govuk-visually-hidden">Reason X-ray not taken</span>
            </Link>
          </dd>
        </div>
      )}
    </dl>
  );
};

export default ChestXraySummary;
