import { Link } from "react-router-dom";

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

  return (
    <div>
      <ApplicantDataHeader applicantData={applicantData} />
      <ChestXrayTakenSummary chestXrayData={chestXrayData} />
      <ChestXrayNotTakenSummary chestXrayData={chestXrayData} />
      <Button
        id="save-and-continue"
        type={ButtonType.DEFAULT}
        text="Save and continue"
        href="/?"
        handleClick={() => {}}
      />
    </div>
  );
};

const ChestXrayTakenSummary = ({ chestXrayData }: { chestXrayData: ChestXrayDetailsType }) => {
  const chestXrayFiles = [
    chestXrayData.posteroAnteriorFile,
    chestXrayData.apicalLordoticFile,
    chestXrayData.lateralDecubitusFile,
  ];
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
      <div className="govuk-summary-list__row">
        <dt className="govuk-summary-list__key">Upload chest X-ray images</dt>
        {chestXrayFiles.map((file, i) => {
          return (
            <dd className="govuk-summary-list__value" key={i}>
              {file}
            </dd>
          );
        })}
        <dd className="govuk-summary-list__actions">
          <Link className="govuk-link" style={{ color: "#1d70b8" }} to="/chest-xray-upload">
            Change<span className="govuk-visually-hidden">Upload Chest X-ray Status</span>
          </Link>
        </dd>
      </div>
      <div className="govuk-summary-list__row">
        <dt className="govuk-summary-list__key">Enter X-ray Results and Findings</dt>
        <dd className="govuk-summary-list__value"></dd>
        <dd className="govuk-summary-list__actions">
          <Link className="govuk-link" style={{ color: "#1d70b8" }} to="/chest-xray-upload">
            Change<span className="govuk-visually-hidden">???</span>
          </Link>
        </dd>
      </div>
    </dl>
  );
};

const ChestXrayNotTakenSummary = ({ chestXrayData }: { chestXrayData: ChestXrayDetailsType }) => {
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
      <div className="govuk-summary-list__row">
        <dt className="govuk-summary-list__key">Enter reason X-ray not taken</dt>
        <dd className="govuk-summary-list__value"></dd>
        <dd className="govuk-summary-list__actions">
          <Link className="govuk-link" style={{ color: "#1d70b8" }} to="/chest-xray-question#note">
            Change<span className="govuk-visually-hidden">???</span>
          </Link>
        </dd>
      </div>
    </dl>
  );
};

export default ChestXraySummary;
