import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { postTbCerificateDetails } from "@/api/api";
import Button from "@/components/button/button";
import Spinner from "@/components/spinner/spinner";
import Summary from "@/components/summary/summary";
import { useApplicantPhoto } from "@/context/applicantPhotoContext";
import { selectApplicant } from "@/redux/applicantSlice";
import { selectApplication } from "@/redux/applicationSlice";
import { selectChestXray } from "@/redux/chestXraySlice";
import { useAppSelector } from "@/redux/hooks";
import { selectMedicalScreening } from "@/redux/medicalScreeningSlice";
import { selectSputum } from "@/redux/sputumSlice";
import { selectTbCertificate, setTbCertificateStatus } from "@/redux/tbCertificateSlice";
import { selectTravel } from "@/redux/travelSlice";
import { ApplicationStatus, ButtonType, PositiveOrNegative, YesOrNo } from "@/utils/enums";
import {
  calculateCertificateExpiryDate,
  calculateCertificateIssueDate,
  formatDateForDisplay,
  getCountryName,
  standardiseDayOrMonth,
} from "@/utils/helpers";
import { attributeToComponentId } from "@/utils/records";

const TbSummary = () => {
  const applicationData = useAppSelector(selectApplication);
  const applicantData = useAppSelector(selectApplicant);
  const travelData = useAppSelector(selectTravel);
  const chestXrayData = useAppSelector(selectChestXray);
  const medicalScreeningData = useAppSelector(selectMedicalScreening);
  const sputumData = useAppSelector(selectSputum);
  const tbCertificateData = useAppSelector(selectTbCertificate);
  const applicantPhotoContext = useApplicantPhoto();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const calculateSputumOutcome = () => {
    if (chestXrayData.isSputumRequired === YesOrNo.NO) {
      return "Not provided";
    }

    const samples = [sputumData.sample1, sputumData.sample2, sputumData.sample3];
    let hasAnyResults = false;

    for (const sample of samples) {
      const smearResult = sample.smearResults.smearResult;
      const cultureResult = sample.cultureResults.cultureResult;

      if (
        smearResult === PositiveOrNegative.POSITIVE ||
        cultureResult === PositiveOrNegative.POSITIVE
      ) {
        return PositiveOrNegative.POSITIVE;
      } else if (
        smearResult !== PositiveOrNegative.NOT_YET_ENTERED ||
        cultureResult !== PositiveOrNegative.NOT_YET_ENTERED
      ) {
        hasAnyResults = true;
      }
    }

    if (hasAnyResults) {
      return PositiveOrNegative.NEGATIVE;
    } else {
      return "Not provided";
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (tbCertificateData.isIssued == YesOrNo.YES) {
        const certificateIssueDateStr = `${tbCertificateData.certificateDate.year}-${standardiseDayOrMonth(tbCertificateData.certificateDate.month)}-${standardiseDayOrMonth(tbCertificateData.certificateDate.day)}`;
        const issueDate = calculateCertificateIssueDate(
          chestXrayData.completionDate,
          chestXrayData.chestXrayTaken,
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
          clinicName: "Lakeside Medical & TB Screening Centre",
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
          clinicName: "Lakeside Medical & TB Screening Centre",
          physicianName: tbCertificateData.declaringPhysicianName,
          referenceNumber: applicationData.applicationId,
        });
      } else {
        throw new Error("certificateIssued field missing");
      }

      dispatch(setTbCertificateStatus(ApplicationStatus.COMPLETE));
      navigate("/tb-certificate-confirmation");
    } catch (error) {
      console.error(error);
      navigate("/error");
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
            value: (() => {
              const dobDate = new Date(
                parseInt(applicantData.dateOfBirth.year),
                parseInt(applicantData.dateOfBirth.month) - 1,
                parseInt(applicantData.dateOfBirth.day),
              );
              return `${dobDate.getDate()} ${dobDate.toLocaleDateString("en-GB", { month: "long" })} ${dobDate.getFullYear()}`;
            })(),
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
            value: (() => {
              const passportIssueDate = new Date(
                parseInt(applicantData.passportIssueDate.year),
                parseInt(applicantData.passportIssueDate.month) - 1,
                parseInt(applicantData.passportIssueDate.day),
              );
              return `${passportIssueDate.getDate()} ${passportIssueDate.toLocaleDateString("en-GB", { month: "long" })} ${passportIssueDate.getFullYear()}`;
            })(),
            hiddenLabel: "Passport issue date",
          },
          {
            key: "Passport expiry date",
            value: (() => {
              const passportExpiryDate = new Date(
                parseInt(applicantData.passportExpiryDate.year),
                parseInt(applicantData.passportExpiryDate.month) - 1,
                parseInt(applicantData.passportExpiryDate.day),
              );
              return `${passportExpiryDate.getDate()} ${passportExpiryDate.toLocaleDateString("en-GB", { month: "long" })} ${passportExpiryDate.getFullYear()}`;
            })(),
            hiddenLabel: "Passport expiry date",
          },
          {
            key: "UKVI visa category",
            value: travelData.visaType,
            hiddenLabel: "UKVI visa category",
          },
        ]
      : [
          {
            key: "Reason for not issuing certificate",
            value: tbCertificateData.reasonNotIssued,
            link: `/tb-certificate-not-issued#${attributeToComponentId.reasonNotIssued}`,
            hiddenLabel: "Reason for not issuing certificate",
            emptyValueText: "Enter reason for not issuing certificate",
          },
          {
            key: "Declaring Physician's name",
            value: tbCertificateData.declaringPhysicianName,
            link: `/tb-certificate-not-issued#${attributeToComponentId.declaringPhysicianName}`,
            hiddenLabel: "Declaring Physician's name",
            emptyValueText: "Enter declaring physician name",
          },
          {
            key: "Physician's comments",
            value: tbCertificateData.comments,
            link: `/tb-certificate-not-issued#${attributeToComponentId.comments}`,
            hiddenLabel: "Physician's comments",
            emptyValueText: "Enter physician's comments",
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
            value: "Lakeside Medical & TB Screening Centre",
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
            link: `/tb-certificate-declaration#${attributeToComponentId.declaringPhysicianName}`,
            hiddenLabel: "Declaring physician name",
            emptyValueText: "Enter declaring physician name",
          },
          {
            key: "Physician's comments",
            value: tbCertificateData.comments,
            link: `/tb-certificate-declaration#${attributeToComponentId.comments}`,
            hiddenLabel: "Physician's comments",
            emptyValueText: "Enter physician's comments",
          },
        ]
      : [];

  const screeningData =
    tbCertificateData.isIssued === YesOrNo.YES
      ? [
          {
            key: "Chest X-ray done",
            value: chestXrayData.chestXrayTaken,
            hiddenLabel: "Chest X-ray done",
          },
          {
            key: "Chest X-ray outcome",
            value: chestXrayData.xrayResult,
            hiddenLabel: "Chest X-ray outcome",
          },
          {
            key: "Sputum collected",
            value: chestXrayData.isSputumRequired,
            hiddenLabel: "Sputum collected",
          },
          {
            key: "Sputum outcome",
            value: calculateSputumOutcome(),
            hiddenLabel: "Sputum outcome",
          },
          {
            key: "Pregnant",
            value: medicalScreeningData.pregnant,
            hiddenLabel: "Pregnant",
          },
          {
            key: "Child under 11 years",
            value: (() => {
              const age =
                typeof medicalScreeningData.age === "string"
                  ? parseInt(medicalScreeningData.age)
                  : medicalScreeningData.age;
              return age < 11 ? "Yes" : "No";
            })(),
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
