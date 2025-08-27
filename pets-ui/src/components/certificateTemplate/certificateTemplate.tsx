import { Document, Font, Image, Page, Text, View } from "@react-pdf/renderer";

import {
  ApplicationIdAndDateCreatedType,
  ClinicType,
  ReduxApplicantDetailsType,
  ReduxChestXrayDetailsType,
  ReduxMedicalScreeningType,
  ReduxSputumType,
  ReduxTbCertificateType,
  ReduxTravelDetailsType,
} from "@/applicant";
import {
  calculateCertificateExpiryDate,
  formatDateForDisplay,
  getCountryName,
} from "@/utils/helpers";

import { styles } from "./certificateTemplate.style";

interface CertificateTemplateProps {
  applicantData: ReduxApplicantDetailsType;
  applicationData: ApplicationIdAndDateCreatedType;
  tbCertificateData: ReduxTbCertificateType;
  travelData: ReduxTravelDetailsType;
  chestXrayData: ReduxChestXrayDetailsType;
  medicalScreeningData: ReduxMedicalScreeningType;
  sputumData: ReduxSputumType;
  applicantPhotoUrl?: string | null;
  clinic: ClinicType;
}

const hyphenationCallback = (word: string) => {
  return [word];
};

Font.registerHyphenationCallback(hyphenationCallback);

interface FieldProps {
  label: string;
  value: string | number | undefined;
}

const Field = ({ label, value }: FieldProps) => {
  const display = value === undefined || value === null ? "" : value;
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.valueBox}>{display}</Text>
    </View>
  );
};

export const CertificateTemplate = ({
  applicantData,
  applicationData,
  tbCertificateData,
  travelData,
  medicalScreeningData,
  applicantPhotoUrl,
  clinic,
}: CertificateTemplateProps) => {
  const fullName = applicantData.fullName;
  const dob = formatDateForDisplay(applicantData.dateOfBirth);
  const certificateIssueDate = formatDateForDisplay(tbCertificateData.certificateDate);
  const expiryDateObj = calculateCertificateExpiryDate(
    tbCertificateData.certificateDate,
    (medicalScreeningData as { closeContactWithTb: string }).closeContactWithTb === "Yes",
  );
  const certificateExpiryDate = formatDateForDisplay(expiryDateObj);

  const proposedUkAddress1 = travelData.applicantUkAddress1 || "Not provided";
  const proposedUkAddress2 = travelData.applicantUkAddress2 || "Not provided";
  const proposedUkTown = travelData.townOrCity || "Not provided";
  const proposedUkPostcode = travelData.postcode || "Not provided";

  const resAddr1 = applicantData.applicantHomeAddress1;
  const resAddr2 = applicantData.applicantHomeAddress2 || "Not provided";
  const resTown = applicantData.townOrCity;
  const resCountry = getCountryName(applicantData.country);
  const nationality = getCountryName(applicantData.countryOfNationality);

  return (
    <Document
      title={`${applicationData.applicationId}.pdf`}
      subject={`TB clearance certificate ${applicationData.applicationId}`}
      creator="pets-ui"
      producer="pets-ui"
    >
      <Page size="A4" orientation="landscape" style={styles.page}>
        <Text style={styles.headerText}>UKVI tuberculosis (TB) clearance certificate</Text>
        <View style={styles.layoutColumns}>
          <View style={styles.col}>
            <View style={styles.inlineRow}>
              <View style={styles.headerLogoBlock}>
                <Image style={styles.ukVisasLogo} src="/assets/images/UKVisas.png" />
              </View>
              <View style={styles.photoBox}>
                {applicantPhotoUrl ? (
                  <Image style={styles.photo} src={applicantPhotoUrl} />
                ) : (
                  <Text style={styles.photoPlaceholderText}>PHOTO</Text>
                )}
              </View>
            </View>
            <View style={styles.box}>
              <Text style={styles.boxTitle}>Certificate information</Text>
              <Field label="Clinic name" value={clinic.name} />
              <Field label="Town or city" value={clinic.city} />
              <Field label="Clinic ID" value={clinic.clinicId} />
              <Field
                label="Certificate unique reference number"
                value={tbCertificateData.certificateNumber}
              />
              <View style={styles.inlineRow}>
                <View style={styles.half}>
                  <Field label="Certificate issue date" value={certificateIssueDate} />
                </View>
                <View style={styles.half}>
                  <Field label="Certificate expiry date" value={certificateExpiryDate} />
                </View>
              </View>
            </View>
          </View>
          <View style={styles.col}>
            <View style={styles.box}>
              <Text style={styles.boxTitle}>Applicant details</Text>
              <Text style={styles.boxSubtitle}>As shown in passport</Text>
              <Field label="Full name" value={fullName} />
              <Field label="Nationality" value={nationality} />
              <Field label="Date of birth" value={dob} />
              <Field label="Sex" value={applicantData.sex} />
              <Field label="Passport number" value={applicantData.passportNumber} />
            </View>
            <View style={styles.box}>
              <Text style={styles.boxTitle}>Screening information</Text>
              <Text style={styles.boxSubtitle}>No clinical suspicion of active pulmonary TB</Text>
              <Field label="Name of physician" value={tbCertificateData.declaringPhysicianName} />
              <Field label="Signature of physician" value="" />
            </View>
          </View>
          <View style={styles.col}>
            <View style={styles.box}>
              <Text style={styles.boxTitle}>Contact information</Text>
              <Field label="Residential address line 1" value={resAddr1} />
              <Field label="Residential address line 2" value={resAddr2} />
              <Field label="Town or city" value={resTown} />
              <Field label="Country" value={resCountry} />
              <Field label="Proposed UK address line 1" value={proposedUkAddress1} />
              <Field label="Proposed UK address line 2" value={proposedUkAddress2} />
              <Field label="Town or city" value={proposedUkTown} />
              <Field label="Postcode" value={proposedUkPostcode} />
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
