import { useNavigate } from "react-router-dom";

import ApplicantDataHeader from "@/components/applicantDataHeader/applicantDataHeader";
import Button from "@/components/button/button";
import LinkLabel from "@/components/linkLabel/LinkLabel";
import { useApplicantPhoto } from "@/context/applicantPhotoContext";
import { selectApplicant } from "@/redux/applicantSlice";
import { selectChestXray } from "@/redux/chestXraySlice";
import { useAppSelector } from "@/redux/hooks";
import { selectMedicalScreening } from "@/redux/medicalScreeningSlice";
import { selectTbCertificate } from "@/redux/tbCertificateSlice";
import { selectTravel } from "@/redux/travelSlice";
import { ApplicationStatus, ButtonType } from "@/utils/enums";

interface TaskProps {
  description: string;
  status: ApplicationStatus;
  linkWhenIncomplete: string;
  linkWhenComplete: string;
}

const Task = (props: Readonly<TaskProps>) => {
  return (
    <li className="govuk-task-list__item govuk-task-list__item--with-link">
      <div className="govuk-task-list__name-and-hint">
        {props.status == ApplicationStatus.INCOMPLETE && (
          <LinkLabel
            className="govuk-link govuk-task-list__link"
            to={props.linkWhenIncomplete}
            title={props.description}
            externalLink={false}
          />
        )}
        {props.status == ApplicationStatus.COMPLETE && (
          <LinkLabel
            className="govuk-link govuk-task-list__link"
            to={props.linkWhenComplete}
            title={props.description}
            externalLink={false}
          />
        )}
      </div>
      {props.status == ApplicationStatus.INCOMPLETE && (
        <div className="govuk-task-list__status">
          <strong className="govuk-tag govuk-tag--blue">Incomplete</strong>
        </div>
      )}
      {props.status == ApplicationStatus.COMPLETE && (
        <div className="govuk-task-list__status">Completed</div>
      )}
    </li>
  );
};

const ProgressTracker = () => {
  const navigate = useNavigate();

  const applicantData = useAppSelector(selectApplicant);
  const travelData = useAppSelector(selectTravel);
  const medicalScreeningData = useAppSelector(selectMedicalScreening);
  const chestXrayData = useAppSelector(selectChestXray);
  const tbCertificateData = useAppSelector(selectTbCertificate);
  const { applicantPhotoFile } = useApplicantPhoto();

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-start", marginBottom: "20px" }}>
        <div style={{ flexGrow: 1 }}>
          <ApplicantDataHeader applicantData={applicantData} />
        </div>
        {applicantPhotoFile && (
          <div
            style={{
              marginLeft: "20px",
              border: "1px solid #b1b4b6",
              display: "flex",
              alignItems: "stretch",
            }}
          >
            <img
              src={URL.createObjectURL(applicantPhotoFile)}
              alt="Applicant photo"
              title={applicantData.applicantPhotoFileName || undefined}
              style={{
                display: "block",
                height: "100%",
                maxHeight: "150px",
                width: "auto",
                objectFit: "cover",
              }}
            />
          </div>
        )}
      </div>

      <p className="govuk-body">Complete all sections.</p>

      <ul className="govuk-task-list">
        <Task
          description="Visa applicant details"
          status={applicantData.status}
          linkWhenIncomplete="/contact"
          linkWhenComplete="/applicant-summary"
        />
        <Task
          description="Travel information"
          status={travelData.status}
          linkWhenIncomplete="/travel-details"
          linkWhenComplete="/travel-summary"
        />
        <Task
          description="Medical history and TB symptoms"
          status={medicalScreeningData.status}
          linkWhenIncomplete="/medical-screening"
          linkWhenComplete="/medical-summary"
        />
        <Task
          description="Radiological outcome"
          status={chestXrayData.status}
          linkWhenIncomplete="/chest-xray-question"
          linkWhenComplete="/chest-xray-summary"
        />
        <Task
          description="TB certificate declaration"
          status={tbCertificateData.status}
          linkWhenIncomplete="/tb-certificate-declaration"
          linkWhenComplete="/tb-certificate-summary"
        />
      </ul>

      <p className="govuk-body">You cannot currently log sputum test information in this system.</p>

      <Button
        id="search-again"
        type={ButtonType.DEFAULT}
        text="Search again"
        handleClick={() => {
          navigate("/applicant-search");
        }}
      />
    </div>
  );
};

export default ProgressTracker;
