import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router";

import { postTbCerificateDetails } from "@/api/api";
import Button from "@/components/button/button";
import Heading from "@/components/heading/heading";
import Spinner from "@/components/spinner/spinner";
import Summary from "@/components/summary/summary";
import { useApplicantPhoto } from "@/context/applicantPhotoContext";
import { setExpiryDate } from "@/redux/applicationSlice";
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
import { ReduxApplicantDetailsType, ReduxTravelDetailsType } from "@/types";
import { ButtonClass, TaskStatus, YesOrNo } from "@/utils/enums";
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

const notIssuedLink = (isLocked: boolean, anchor: string): string | undefined =>
  isLocked ? undefined : `/why-are-you-not-issuing-certificate#${anchor}`;

const clinicInfoLink = (isLocked: boolean, anchor: string): string | undefined =>
  isLocked ? undefined : `/clinic-certificate-information#${anchor}`;

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
  const [searchParams] = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);

  const isFromConfirmation = searchParams.get("from") === "/tb-screening-complete";
  const isCertificateIssued = tbCertificateData.status === TaskStatus.COMPLETE;
  const summaryStatus =
    isFromConfirmation || isCertificateIssued ? TaskStatus.IN_PROGRESS : tbCertificateData.status;

  const isIssued = tbCertificateData.isIssued === YesOrNo.YES;

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
        dispatch(setExpiryDate(expiryDate));
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

      dispatch(setTbCertificateStatus(TaskStatus.COMPLETE));
      navigate("/tb-screening-complete");
    } catch (error) {
      console.error(error);
      navigate("/sorry-there-is-problem-with-service");
    }
  };

  const CURRENT_ADDRESS_FIELDS: {
    key: string;
    field: keyof ReduxApplicantDetailsType;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formatter?: (value: any) => string;
  }[] = [
    { key: "Address line 1", field: "applicantHomeAddress1" },
    { key: "Address line 2 (optional)", field: "applicantHomeAddress2" },
    { key: "Address line 3 (optional)", field: "applicantHomeAddress3" },
    { key: "Town or city", field: "townOrCity" },
    { key: "Province or state", field: "provinceOrState" },
    { key: "Postal code", field: "postcode" },
    { key: "Country", field: "country", formatter: getCountryName },
  ];

  const UK_ADDRESS_FIELDS: {
    key: string;
    field: keyof ReduxTravelDetailsType;
  }[] = [
    { key: "Address line 1 (optional)", field: "applicantUkAddress1" },
    { key: "Address line 2 (optional)", field: "applicantUkAddress2" },
    { key: "Address line 3 (optional)", field: "applicantUkAddress3" },
    { key: "Town or city (optional)", field: "townOrCity" },
    { key: "Postcode (optional)", field: "postcode" },
  ];

  const CURRENT_ADDRESS_BASE_URL =
    "/visa-applicant-contact-information?from=tb-certificate-summary";

  const UK_ADDRESS_BASE_URL = "/visa-applicant-proposed-uk-address";

  const currentAddressData = isIssued
    ? CURRENT_ADDRESS_FIELDS.map(({ key, field, formatter }) => {
        const rawValue = applicantData[field] as string | undefined;
        const value = formatter ? formatter(rawValue) : rawValue;

        return {
          key,
          value,
          link: `${CURRENT_ADDRESS_BASE_URL}#${attributeToComponentId[field]}`,
          hiddenLabel: `Current ${key.toLowerCase()}`,
        };
      })
    : [];

  const ukAddressData = isIssued
    ? UK_ADDRESS_FIELDS.map(({ key, field }) => {
        return {
          key,
          value: travelData[field],
          link: `${UK_ADDRESS_BASE_URL}#${attributeToComponentId[field]}`,
          hiddenLabel: `UK ${key.toLowerCase()}`,
        };
      })
    : [];

  const summaryData = isIssued
    ? [
        {
          key: "Full name",
          value: applicantData.fullName,
          link: `/visa-applicant-personal-information?from=tb-certificate-summary#${attributeToComponentId.fullName}`,
          hiddenLabel: "Full name",
        },
        {
          key: "Nationality",
          value: getCountryName(applicantData.countryOfNationality),
          link: `/visa-applicant-personal-information?from=tb-certificate-summary#${attributeToComponentId.countryOfNationality}`,
          hiddenLabel: "Nationality",
        },
        {
          key: "Date of birth",
          value: formatDateForDisplay(applicantData.dateOfBirth),
          link: `/visa-applicant-personal-information?from=tb-certificate-summary#${attributeToComponentId.dateOfBirth}`,
          hiddenLabel: "Date of birth",
        },
        {
          key: "Sex",
          value: applicantData.sex,
          link: `/visa-applicant-personal-information?from=tb-certificate-summary#${attributeToComponentId.sex}`,
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
          link: `/visa-applicant-passport-information?from=tb-certificate-summary#${attributeToComponentId.passportIssueDate}`,
          hiddenLabel: "Passport issue date",
        },
        {
          key: "Passport expiry date",
          value: formatDateForDisplay(applicantData.passportExpiryDate),
          link: `/visa-applicant-passport-information?from=tb-certificate-summary#${attributeToComponentId.passportExpiryDate}`,
          hiddenLabel: "Passport expiry date",
        },
        {
          key: "UKVI visa category",
          value: travelData.visaCategory,
          link: `/proposed-visa-category#${attributeToComponentId.visaCategory}`,
          hiddenLabel: "UKVI visa category",
        },
        {
          key: "Photo",
          value: applicantData.applicantPhotoFileName || "Not provided",
          link: `/upload-visa-applicant-photo?from=tb-certificate-summary`,
          hiddenLabel: "Photo",
        },
      ]
    : [
        {
          key: "Reason for not issuing certificate",
          value: tbCertificateData.reasonNotIssued,
          link: notIssuedLink(isCertificateIssued, attributeToComponentId.reasonNotIssued),
          hiddenLabel: "Reason for not issuing certificate",
        },
        {
          key: "Declaring Physician's name",
          value: tbCertificateData.declaringPhysicianName,
          link: notIssuedLink(isCertificateIssued, attributeToComponentId.declaringPhysicianName),
          hiddenLabel: "Declaring Physician's name",
        },
        {
          key: "Physician's comments",
          value: tbCertificateData.comments,
          link: notIssuedLink(isCertificateIssued, attributeToComponentId.comments),
          hiddenLabel: "Physician's comments",
        },
      ];

  const certificateData = isIssued
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
          link: clinicInfoLink(isCertificateIssued, attributeToComponentId.declaringPhysicianName),
          hiddenLabel: "Declaring physician name",
        },
        {
          key: "Physician's notes",
          value: tbCertificateData.comments,
          link: clinicInfoLink(isCertificateIssued, attributeToComponentId.comments),
          hiddenLabel: "Physician's notes",
        },
      ]
    : [];

  const screeningData = isIssued
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
          value: isChildUnder11(applicantData),
          hiddenLabel: "Child under 11 years",
        },
      ]
    : [];

  return (
    <div>
      {isLoading && <Spinner />}

      {isIssued ? (
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-two-thirds">
            <h2 className="govuk-heading-m">Visa applicant information</h2>
            <Summary
              taskStatus={summaryStatus}
              applicationStatus={applicationData.applicationStatus}
              summaryElements={summaryData}
            />

            {currentAddressData.length > 0 && (
              <>
                <h2 className="govuk-heading-m">Current home address</h2>
                <Summary
                  taskStatus={summaryStatus}
                  applicationStatus={applicationData.applicationStatus}
                  summaryElements={currentAddressData}
                />
              </>
            )}

            {ukAddressData.length > 0 && (
              <>
                <h2 className="govuk-heading-m">Proposed UK address</h2>
                <Summary
                  taskStatus={summaryStatus}
                  applicationStatus={applicationData.applicationStatus}
                  summaryElements={ukAddressData}
                />
              </>
            )}

            {certificateData.length > 0 && (
              <>
                <h2 className="govuk-heading-m">Clinic and certificate information</h2>
                <div className="certificate-reference-nowrap">
                  <Summary
                    taskStatus={summaryStatus}
                    applicationStatus={applicationData.applicationStatus}
                    summaryElements={certificateData}
                  />
                </div>
              </>
            )}

            {screeningData.length > 0 && (
              <>
                <h2 className="govuk-heading-m">Screening information</h2>
                <Summary
                  taskStatus={summaryStatus}
                  applicationStatus={applicationData.applicationStatus}
                  summaryElements={screeningData}
                />
              </>
            )}

            <Heading title="Now submit your certificate information" level={2} size="m" />
            <p className="govuk-body">
              By submitting this information you are confirming that, to the best of your knowledge,
              there is no clinical suspicion of pulmonary TB.
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
        <Summary
          taskStatus={summaryStatus}
          applicationStatus={applicationData.applicationStatus}
          summaryElements={summaryData}
        />
      )}

      {!isIssued && (
        <div>
          <Heading title="Now send the TB clearance outcome" level={2} size="m" />
          <p className="govuk-body">
            You will not be able to change the TB clearance outcome after you submit this
            information.
          </p>
        </div>
      )}

      {(tbCertificateData.status == TaskStatus.NOT_YET_STARTED ||
        tbCertificateData.status == TaskStatus.IN_PROGRESS) && (
        <Button
          id="submit"
          class={ButtonClass.DEFAULT}
          text={tbCertificateData.isIssued === YesOrNo.YES ? "Submit" : "Submit and continue"}
          handleClick={handleSubmit}
        />
      )}
      {(tbCertificateData.status == TaskStatus.COMPLETE ||
        tbCertificateData.status == TaskStatus.NOT_REQUIRED) && (
        <Button
          id="back-to-tracker"
          class={ButtonClass.DEFAULT}
          text="Return to tracker"
          handleClick={() => navigate("/tracker")}
        />
      )}
    </div>
  );
};

export default TbSummary;
