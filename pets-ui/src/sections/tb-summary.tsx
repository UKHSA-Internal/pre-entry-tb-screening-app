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
import { countryList } from "@/utils/countryList";
import { ApplicationStatus, ButtonType, PositiveOrNegative, YesOrNo } from "@/utils/enums";
import { standardiseDayOrMonth } from "@/utils/helpers";
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

  const getCountryName = (countryCode: string) => {
    const country = countryList.find((c) => c.value === countryCode);
    return country ? country.label : countryCode;
  };

  const calculateSputumOutcome = () => {
    if (chestXrayData.isSputumRequired === YesOrNo.NO) {
      return "Not provided";
    }

    const samples = [sputumData.sample1, sputumData.sample2, sputumData.sample3];
    let hasPositiveResult = false;
    let hasAnyResults = false;

    for (const sample of samples) {
      if (sample.smearResults.smearResult === PositiveOrNegative.POSITIVE) {
        hasPositiveResult = true;
      }
      if (sample.smearResults.smearResult !== PositiveOrNegative.NOT_YET_ENTERED) {
        hasAnyResults = true;
      }

      if (sample.cultureResults.cultureResult === PositiveOrNegative.POSITIVE) {
        hasPositiveResult = true;
      }
      if (sample.cultureResults.cultureResult !== PositiveOrNegative.NOT_YET_ENTERED) {
        hasAnyResults = true;
      }
    }

    if (hasPositiveResult) {
      return "Positive";
    }

    if (hasAnyResults) {
      return "Negative";
    }

    return "Not provided";
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (tbCertificateData.isIssued == YesOrNo.YES) {
        const certificateIssueDateStr = `${tbCertificateData.certificateDate.year}-${standardiseDayOrMonth(tbCertificateData.certificateDate.month)}-${standardiseDayOrMonth(tbCertificateData.certificateDate.day)}`;
        await postTbCerificateDetails(applicationData.applicationId, {
          isIssued: tbCertificateData.isIssued,
          comments: tbCertificateData.comments,
          issueDate: certificateIssueDateStr,
          certificateNumber: tbCertificateData.certificateNumber,
        });
      } else if (tbCertificateData.isIssued == YesOrNo.NO) {
        await postTbCerificateDetails(applicationData.applicationId, {
          isIssued: tbCertificateData.isIssued,
          comments: tbCertificateData.comments,
          reasonNotIssued: tbCertificateData.reasonNotIssued,
          declaringPhysicianName: tbCertificateData.declaringPhysicianName,
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
            value: applicantData.fullName || "Not provided",
            hiddenLabel: "Name",
          },
          {
            key: "Nationality",
            value: applicantData.countryOfNationality
              ? getCountryName(applicantData.countryOfNationality)
              : "Not provided",
            hiddenLabel: "Nationality",
          },
          {
            key: "Date of birth",
            value: (() => {
              if (
                applicantData.dateOfBirth?.day &&
                applicantData.dateOfBirth?.month &&
                applicantData.dateOfBirth?.year
              ) {
                const dobDate = new Date(
                  parseInt(applicantData.dateOfBirth.year),
                  parseInt(applicantData.dateOfBirth.month) - 1,
                  parseInt(applicantData.dateOfBirth.day),
                );
                return `${dobDate.getDate()} ${dobDate.toLocaleDateString("en-GB", { month: "long" })} ${dobDate.getFullYear()}`;
              }
              return "Not provided";
            })(),
            hiddenLabel: "Date of birth",
          },
          {
            key: "Sex",
            value: applicantData.sex || "Not provided",
            hiddenLabel: "Sex",
          },
          {
            key: "Passport number",
            value: applicantData.passportNumber || "Not provided",
            hiddenLabel: "Passport number",
          },
          {
            key: "Passport issue date",
            value: (() => {
              if (
                applicantData.passportIssueDate?.day &&
                applicantData.passportIssueDate?.month &&
                applicantData.passportIssueDate?.year
              ) {
                const passportIssueDate = new Date(
                  parseInt(applicantData.passportIssueDate.year),
                  parseInt(applicantData.passportIssueDate.month) - 1,
                  parseInt(applicantData.passportIssueDate.day),
                );
                return `${passportIssueDate.getDate()} ${passportIssueDate.toLocaleDateString("en-GB", { month: "long" })} ${passportIssueDate.getFullYear()}`;
              }
              return "Not provided";
            })(),
            hiddenLabel: "Passport issue date",
          },
          {
            key: "Passport expiry date",
            value: (() => {
              if (
                applicantData.passportExpiryDate?.day &&
                applicantData.passportExpiryDate?.month &&
                applicantData.passportExpiryDate?.year
              ) {
                const passportExpiryDate = new Date(
                  parseInt(applicantData.passportExpiryDate.year),
                  parseInt(applicantData.passportExpiryDate.month) - 1,
                  parseInt(applicantData.passportExpiryDate.day),
                );
                return `${passportExpiryDate.getDate()} ${passportExpiryDate.toLocaleDateString("en-GB", { month: "long" })} ${passportExpiryDate.getFullYear()}`;
              }
              return "Not provided";
            })(),
            hiddenLabel: "Passport expiry date",
          },
          {
            key: "UKVI visa category",
            value: travelData.visaType || "Not provided",
            hiddenLabel: "UKVI visa category",
          },
        ]
      : [
          {
            key: "Reason for not issuing certificate",
            value: tbCertificateData.reasonNotIssued || "Not provided",
            link: `/tb-certificate-declaration#${attributeToComponentId.reasonNotIssued}`,
            hiddenLabel: "Reason for not issuing certificate",
            emptyValueText: "Enter reason for not issuing certificate",
          },
          {
            key: "Declaring Physician's name",
            value: tbCertificateData.declaringPhysicianName || "Not provided",
            link: `/tb-certificate-declaration#${attributeToComponentId.declaringPhysicianName}`,
            hiddenLabel: "Declaring Physician's name",
            emptyValueText: "Enter declaring physician name",
          },
          {
            key: "Physician's comments",
            value: tbCertificateData.comments || "Not provided",
            link: `/tb-certificate-declaration#${attributeToComponentId.comments}`,
            hiddenLabel: "Physician's comments",
            emptyValueText: "Enter physician's comments",
          },
        ];

  const currentAddressData =
    tbCertificateData.isIssued === YesOrNo.YES
      ? [
          {
            key: "Address line 1",
            value: applicantData.applicantHomeAddress1 || "Not provided",
            hiddenLabel: "Current address line 1",
          },
          {
            key: "Address line 2",
            value: applicantData.applicantHomeAddress2 || "Not provided",
            hiddenLabel: "Current address line 2",
          },
          {
            key: "Town or city",
            value: applicantData.townOrCity || "Not provided",
            hiddenLabel: "Current town or city",
          },
          {
            key: "Country",
            value: applicantData.country ? getCountryName(applicantData.country) : "Not provided",
            hiddenLabel: "Current country",
          },
          {
            key: "Postcode",
            value: applicantData.postcode || "Not provided",
            hiddenLabel: "Current postcode",
          },
        ]
      : [];

  const ukAddressData =
    tbCertificateData.isIssued === YesOrNo.YES
      ? [
          {
            key: "Address line 1",
            value: travelData.applicantUkAddress1 || "Not provided",
            hiddenLabel: "UK address line 1",
          },
          {
            key: "Address line 2",
            value: travelData.applicantUkAddress2 || "Not provided",
            hiddenLabel: "UK address line 2",
          },
          {
            key: "Town or city",
            value: travelData.townOrCity || "Not provided",
            hiddenLabel: "UK town or city",
          },
          {
            key: "County",
            value: travelData.applicantUkAddress3 || "Not provided",
            hiddenLabel: "UK county",
          },
          {
            key: "Postcode",
            value: travelData.postcode || "Not provided",
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
            value: tbCertificateData.certificateNumber || "Not provided",
            hiddenLabel: "Certificate reference number",
          },
          {
            key: "Certificate issue date",
            value: (() => {
              if (
                tbCertificateData.certificateDate?.day &&
                tbCertificateData.certificateDate?.month &&
                tbCertificateData.certificateDate?.year
              ) {
                const issueDate = new Date(
                  parseInt(tbCertificateData.certificateDate.year),
                  parseInt(tbCertificateData.certificateDate.month) - 1,
                  parseInt(tbCertificateData.certificateDate.day),
                );
                return `${issueDate.getDate()} ${issueDate.toLocaleDateString("en-GB", { month: "long" })} ${issueDate.getFullYear()}`;
              }
              return "Not provided";
            })(),
            hiddenLabel: "Certificate issue date",
          },
          {
            key: "Certificate expiry date",
            value: (() => {
              if (
                tbCertificateData.certificateDate?.day &&
                tbCertificateData.certificateDate?.month &&
                tbCertificateData.certificateDate?.year
              ) {
                const issueDate = new Date(
                  parseInt(tbCertificateData.certificateDate.year),
                  parseInt(tbCertificateData.certificateDate.month) - 1,
                  parseInt(tbCertificateData.certificateDate.day),
                );
                const expiryDate = new Date(issueDate);

                const expiryMonths = medicalScreeningData.closeContactWithTb === "Yes" ? 3 : 6;
                expiryDate.setMonth(expiryDate.getMonth() + expiryMonths);

                return `${expiryDate.getDate()} ${expiryDate.toLocaleDateString("en-GB", { month: "long" })} ${expiryDate.getFullYear()}`;
              }
              return "Not provided";
            })(),
            hiddenLabel: "Certificate expiry date",
          },
          {
            key: "Declaring physician name",
            value: tbCertificateData.declaringPhysicianName || "Not provided",
            link: `/tb-certificate-declaration#${attributeToComponentId.declaringPhysicianName}`,
            hiddenLabel: "Declaring physician name",
            emptyValueText: "Enter declaring physician name",
          },
          {
            key: "Physician's comments",
            value: tbCertificateData.comments || "Not provided",
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
            value: chestXrayData.chestXrayTaken || "Not provided",
            hiddenLabel: "Chest X-ray done",
          },
          {
            key: "Chest X-ray outcome",
            value: chestXrayData.xrayResult || "Not provided",
            hiddenLabel: "Chest X-ray outcome",
          },
          {
            key: "Sputum collected",
            value: chestXrayData.isSputumRequired || "Not provided",
            hiddenLabel: "Sputum collected",
          },
          {
            key: "Sputum outcome",
            value: calculateSputumOutcome(),
            hiddenLabel: "Sputum outcome",
          },
          {
            key: "Pregnant",
            value: medicalScreeningData.pregnant || "Not provided",
            hiddenLabel: "Pregnant",
          },
          {
            key: "Child under 11 years",
            value: (() => {
              if (medicalScreeningData.age !== undefined && medicalScreeningData.age !== null) {
                const age =
                  typeof medicalScreeningData.age === "string"
                    ? parseInt(medicalScreeningData.age)
                    : medicalScreeningData.age;
                return age < 11 ? "Yes" : "No";
              }
              return "Not provided";
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
            <p>
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
