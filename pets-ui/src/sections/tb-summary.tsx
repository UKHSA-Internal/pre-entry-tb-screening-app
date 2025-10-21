import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { postTbCerificateDetails } from "@/api/api";
import Button from "@/components/button/button";
import Spinner from "@/components/spinner/spinner";
import Summary from "@/components/summary/summary";
import { useApplicantPhoto } from "@/context/applicantPhotoContext";
import { useAppSelector } from "@/redux/hooks";
import {
  selectApplicant,
  selectApplication,
  selectChestXray,
  selectClinic,
  selectMedicalScreening,
  selectRadiologicalOutcome,
  selectSputum,
  selectSputumDecision,
  selectTbCertificate,
  selectTravel,
} from "@/redux/store";
import { setTbCertificateStatus } from "@/redux/tbCertificateSlice";
import { ApplicationStatus, ButtonType, YesOrNo } from "@/utils/enums";
import {
  calculateCertificateExpiryDate,
  calculateCertificateIssueDate,
  calculateSputumOutcome,
  formatDateForDisplay,
  getCountryName,
  isChildUnder11,
  standardiseDayOrMonth,
} from "@/utils/helpers";
import { attributeToComponentId } from "@/utils/records";

const TbSummary = () => {
  const applicationData = useAppSelector(selectApplication);
  const applicantData = useAppSelector(selectApplicant);
  const travelData = useAppSelector(selectTravel);
  const clinic = useAppSelector(selectClinic);
  const chestXrayData = useAppSelector(selectChestXray);
  const radiologicalOutcomeData = useAppSelector(selectRadiologicalOutcome);
  const sputumRequirementData = useAppSelector(selectSputumDecision);
  const medicalScreeningData = useAppSelector(selectMedicalScreening);
  const sputumData = useAppSelector(selectSputum);
  const tbCertificateData = useAppSelector(selectTbCertificate);
  const applicantPhotoContext = useApplicantPhoto();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (tbCertificateData.isIssued == YesOrNo.YES) {
        const certificateIssueDateStr = `${tbCertificateData.certificateDate.year}-${standardiseDayOrMonth(tbCertificateData.certificateDate.month)}-${standardiseDayOrMonth(tbCertificateData.certificateDate.day)}`;
        const issueDate = calculateCertificateIssueDate(
          chestXrayData.dateXrayTaken,
          medicalScreeningData.chestXrayTaken,
          medicalScreeningData.completionDate,
        );
        const expiryDate = calculateCertificateExpiryDate(
          issueDate,
          medicalScreeningData.closeContactWithTb === "Yes",
        );
        const certificateExpiryDateStr = `${expiryDate.year}-${standardiseDayOrMonth(expiryDate.month)}-${standardiseDayOrMonth(expiryDate.day)}`;

        await postTbCerificateDetails(applicationData.applicationId, {
          isIssued: tbCertificateData.isIssued,
          comments: tbCertificateData.comments,
          issueDate: certificateIssueDateStr,
          expiryDate: certificateExpiryDateStr,
          certificateNumber: tbCertificateData.certificateNumber,
          clinicName: clinic.name,
          physicianName: tbCertificateData.declaringPhysicianName,
          referenceNumber: applicationData.applicationId,
        });
      } else if (tbCertificateData.isIssued == YesOrNo.NO) {
        if (!tbCertificateData.reasonNotIssued || !tbCertificateData.declaringPhysicianName) {
          throw new Error("Missing required fields for certificate not issued");
        }

        await postTbCerificateDetails(applicationData.applicationId, {
          isIssued: tbCertificateData.isIssued,
          comments: tbCertificateData.comments,
          notIssuedReason: tbCertificateData.reasonNotIssued,
          clinicName: clinic.name,
          physicianName: tbCertificateData.declaringPhysicianName,
          referenceNumber: applicationData.applicationId,
        });
      } else {
        throw new Error("certificateIssued field missing");
      }

      dispatch(setTbCertificateStatus(ApplicationStatus.COMPLETE));
      navigate("/tb-screening-complete");
    } catch (error) {
      console.error(error);
      navigate("/sorry-there-is-problem-with-service");
    }
  };

  const summaryData =
    tbCertificateData.isIssued === YesOrNo.YES
      ? [
          {
            key: "Name",
            value: applicantData.fullName,
            hiddenLabel: "Name",
          },
          {
            key: "Nationality",
            value: getCountryName(applicantData.countryOfNationality),
            hiddenLabel: "Nationality",
          },
          {
            key: "Date of birth",
            value: formatDateForDisplay(applicantData.dateOfBirth),
            hiddenLabel: "Date of birth",
          },
          {
            key: "Sex",
            value: applicantData.sex,
            hiddenLabel: "Sex",
          },
          {
            key: "Passport number",
            value: applicantData.passportNumber,
            hiddenLabel: "Passport number",
          },
          {
            key: "Passport issue date",
            value: formatDateForDisplay(applicantData.passportIssueDate),
            hiddenLabel: "Passport issue date",
          },
          {
            key: "Passport expiry date",
            value: formatDateForDisplay(applicantData.passportExpiryDate),
            hiddenLabel: "Passport expiry date",
          },
          {
            key: "UKVI visa category",
            value: travelData.visaCategory,
            hiddenLabel: "UKVI visa category",
          },
        ]
      : [
          {
            key: "Reason for not issuing certificate",
            value: tbCertificateData.reasonNotIssued,
            link: `/why-are-you-not-issuing-certificate#${attributeToComponentId.reasonNotIssued}`,
            hiddenLabel: "Reason for not issuing certificate",
          },
          {
            key: "Declaring Physician's name",
            value: tbCertificateData.declaringPhysicianName,
            link: `/why-are-you-not-issuing-certificate#${attributeToComponentId.declaringPhysicianName}`,
            hiddenLabel: "Declaring Physician's name",
          },
          {
            key: "Physician's comments",
            value: tbCertificateData.comments,
            link: `/why-are-you-not-issuing-certificate#${attributeToComponentId.comments}`,
            hiddenLabel: "Physician's comments",
          },
        ];

  const currentAddressData =
    tbCertificateData.isIssued === YesOrNo.YES
      ? [
          {
            key: "Address line 1",
            value: applicantData.applicantHomeAddress1,
            hiddenLabel: "Current address line 1",
          },
          {
            key: "Address line 2",
            value: applicantData.applicantHomeAddress2,
            hiddenLabel: "Current address line 2",
          },
          {
            key: "Town or city",
            value: applicantData.townOrCity,
            hiddenLabel: "Current town or city",
          },
          {
            key: "Country",
            value: getCountryName(applicantData.country),
            hiddenLabel: "Current country",
          },
          {
            key: "Postcode",
            value: applicantData.postcode,
            hiddenLabel: "Current postcode",
          },
        ]
      : [];

  const ukAddressData =
    tbCertificateData.isIssued === YesOrNo.YES
      ? [
          {
            key: "Address line 1",
            value: travelData.applicantUkAddress1,
            hiddenLabel: "UK address line 1",
          },
          {
            key: "Address line 2",
            value: travelData.applicantUkAddress2,
            hiddenLabel: "UK address line 2",
          },
          {
            key: "Town or city",
            value: travelData.townOrCity,
            hiddenLabel: "UK town or city",
          },
          {
            key: "County",
            value: travelData.applicantUkAddress3,
            hiddenLabel: "UK county",
          },
          {
            key: "Postcode",
            value: travelData.postcode,
            hiddenLabel: "UK postcode",
          },
        ]
      : [];

  const certificateData =
    tbCertificateData.isIssued === YesOrNo.YES
      ? [
          {
            key: "Clinic name",
            value: clinic.name,
            hiddenLabel: "Clinic name",
          },
          {
            key: "Certificate reference number",
            value: tbCertificateData.certificateNumber,
            hiddenLabel: "Certificate reference number",
          },
          {
            key: "Certificate issue date",
            value: formatDateForDisplay(tbCertificateData.certificateDate),
            hiddenLabel: "Certificate issue date",
          },
          {
            key: "Certificate expiry date",
            value: (() => {
              const expiryDate = calculateCertificateExpiryDate(
                tbCertificateData.certificateDate,
                medicalScreeningData.closeContactWithTb === "Yes",
              );
              return formatDateForDisplay(expiryDate);
            })(),
            hiddenLabel: "Certificate expiry date",
          },
          {
            key: "Declaring physician name",
            value: tbCertificateData.declaringPhysicianName,
            link: `/enter-clinic-certificate-information#${attributeToComponentId.declaringPhysicianName}`,
            hiddenLabel: "Declaring physician name",
          },
          {
            key: "Physician's comments",
            value: tbCertificateData.comments,
            link: `/enter-clinic-certificate-information#${attributeToComponentId.comments}`,
            hiddenLabel: "Physician's comments",
          },
        ]
      : [];

  const screeningData =
    tbCertificateData.isIssued === YesOrNo.YES
      ? [
          {
            key: "Chest X-ray done",
            value: medicalScreeningData.chestXrayTaken,
            hiddenLabel: "Chest X-ray done",
          },
          {
            key: "Chest X-ray outcome",
            value: radiologicalOutcomeData.xrayResult,
            hiddenLabel: "Chest X-ray outcome",
          },
          {
            key: "Sputum collected",
            value: sputumRequirementData.isSputumRequired,
            hiddenLabel: "Sputum collected",
          },
          {
            key: "Sputum outcome",
            value: calculateSputumOutcome(sputumRequirementData, sputumData),
            hiddenLabel: "Sputum outcome",
          },
          {
            key: "Pregnant",
            value: medicalScreeningData.pregnant,
            hiddenLabel: "Pregnant",
          },
          {
            key: "Child under 11 years",
            value: isChildUnder11(medicalScreeningData),
            hiddenLabel: "Child under 11 years",
          },
        ]
      : [];

  return (
    <div>
      {isLoading && <Spinner />}

      {tbCertificateData.isIssued === YesOrNo.YES ? (
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-two-thirds">
            <h2 className="govuk-heading-m">Visa applicant information</h2>
            <Summary status={tbCertificateData.status} summaryElements={summaryData} />

            {currentAddressData.length > 0 && (
              <>
                <h2 className="govuk-heading-m">Current residential address</h2>
                <Summary status={tbCertificateData.status} summaryElements={currentAddressData} />
              </>
            )}

            {ukAddressData.length > 0 && (
              <>
                <h2 className="govuk-heading-m">Proposed UK address</h2>
                <Summary status={tbCertificateData.status} summaryElements={ukAddressData} />
              </>
            )}

            {certificateData.length > 0 && (
              <>
                <h2 className="govuk-heading-m">Clinic and certificate information</h2>
                <div className="certificate-reference-nowrap">
                  <Summary status={tbCertificateData.status} summaryElements={certificateData} />
                </div>
              </>
            )}

            {screeningData.length > 0 && (
              <>
                <h2 className="govuk-heading-m">Screening information</h2>
                <Summary status={tbCertificateData.status} summaryElements={screeningData} />
              </>
            )}
            <p className="govuk-body">
              By submitting this certificate information you are confirming that, to the best of
              your knowledge, there is no clinical suspicious of pulmonary TB.
            </p>
          </div>
          {applicantPhotoContext?.applicantPhotoDataUrl && (
            <div className="govuk-grid-column-one-third">
              <img
                src={applicantPhotoContext.applicantPhotoDataUrl}
                alt={"Applicant"}
                title={applicantData.applicantPhotoFileName ?? undefined}
                className="applicant-photo-summary"
              />
            </div>
          )}
        </div>
      ) : (
        <Summary status={tbCertificateData.status} summaryElements={summaryData} />
      )}

      {(tbCertificateData.status == ApplicationStatus.NOT_YET_STARTED ||
        tbCertificateData.status == ApplicationStatus.IN_PROGRESS) && (
        <Button id="confirm" type={ButtonType.DEFAULT} text="Submit" handleClick={handleSubmit} />
      )}
      {(tbCertificateData.status == ApplicationStatus.COMPLETE ||
        tbCertificateData.status == ApplicationStatus.NOT_REQUIRED) && (
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

export default TbSummary;
