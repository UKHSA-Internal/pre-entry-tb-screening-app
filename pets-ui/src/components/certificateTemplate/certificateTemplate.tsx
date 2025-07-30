import { Document, Font, Image, Page, Text, View } from "@react-pdf/renderer";

import {
  ApplicationIdAndDateCreatedType,
  ReduxApplicantDetailsType,
  ReduxChestXrayDetailsType,
  ReduxMedicalScreeningType,
  ReduxSputumType,
  ReduxTbCertificateType,
  ReduxTravelDetailsType,
} from "@/applicant";
import { YesOrNo } from "@/utils/enums";
import {
  calculateSputumOutcome,
  formatDateForDisplay,
  getCountryName,
  isChildUnder11,
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
}

const hyphenationCallback = (word: string) => {
  return [word];
};

Font.registerHyphenationCallback(hyphenationCallback);

export const CertificateTemplate = ({
  applicantData,
  tbCertificateData,
  travelData,
  chestXrayData,
  medicalScreeningData,
  sputumData,
  applicantPhotoUrl,
}: CertificateTemplateProps) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image style={styles.ukVisasLogo} src="/assets/images/UKVisas.png" />
          </View>
          <View style={styles.headerCenter}>
            <Text style={styles.mainTitle}>UKVI tuberculosis (TB) clearance certificate</Text>
          </View>
          {/* <View style={styles.headerRight}>
            <Image style={styles.headerImage} src="/assets/images/cat-placeholder-1.png" />
          </View> */}
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.topContentRow}>
            <View style={styles.photoColumn}>
              <Text style={styles.sectionHeader}>Applicant photo</Text>
              {applicantPhotoUrl && <Image style={styles.applicantPhoto} src={applicantPhotoUrl} />}
              {/* <Image style={styles.photoPlaceholder} src="/assets/images/cat-placeholder-2.png" /> */}
            </View>
            <View style={styles.contentColumn}>
              <Text style={styles.sectionHeader}>Customer information (as shown in passport)</Text>
              <View style={styles.summarySection}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryKey}>Given name</Text>
                  <Text style={styles.summaryValue}>
                    {applicantData.fullName?.split(" ")[0] ?? "Not provided"}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryKey}>Middle name</Text>
                  <Text style={styles.summaryValue}>
                    {applicantData.fullName?.split(" ").slice(1, -1).join(" ") ?? "Not provided"}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryKey}>Family name</Text>
                  <Text style={styles.summaryValue}>
                    {applicantData.fullName?.split(" ").pop() ?? "Not provided"}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryKey}>Nationality</Text>
                  <Text style={styles.summaryValue}>
                    {getCountryName(applicantData.countryOfNationality) ?? "Not provided"}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryKey}>Date of Birth</Text>
                  <Text style={styles.summaryValue}>
                    {applicantData.dateOfBirth.day &&
                    applicantData.dateOfBirth.month &&
                    applicantData.dateOfBirth.year
                      ? `${applicantData.dateOfBirth.day}/${applicantData.dateOfBirth.month}/${applicantData.dateOfBirth.year}`
                      : "Not provided"}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryKey}>Sex</Text>
                  <Text style={styles.summaryValue}>{applicantData.sex ?? "Not provided"}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryKey}>Passport Number</Text>
                  <Text style={styles.summaryValue}>
                    {applicantData.passportNumber ?? "Not provided"}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryKey}>Passport Issue Date</Text>
                  <Text style={styles.summaryValue}>
                    {applicantData.passportIssueDate.day &&
                    applicantData.passportIssueDate.month &&
                    applicantData.passportIssueDate.year
                      ? `${applicantData.passportIssueDate.day}/${applicantData.passportIssueDate.month}/${applicantData.passportIssueDate.year}`
                      : "Not provided"}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryKey}>Passport Expiry Date</Text>
                  <Text style={styles.summaryValue}>
                    {applicantData.passportExpiryDate.day &&
                    applicantData.passportExpiryDate.month &&
                    applicantData.passportExpiryDate.year
                      ? `${applicantData.passportExpiryDate.day}/${applicantData.passportExpiryDate.month}/${applicantData.passportExpiryDate.year}`
                      : "Not provided"}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryKey}>UKVI Visa Category</Text>
                  <Text style={styles.summaryValue}>
                    {travelData.visaCategory ?? "Not provided"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.contentColumn, styles.lastContentColumn]}>
              <Text style={styles.sectionHeader}>Current Residential Address</Text>
              <View style={styles.summarySection}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryKey}>Address Line 1</Text>
                  <Text style={styles.summaryValue}>
                    {applicantData.applicantHomeAddress1 ?? "Not provided"}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryKey}>Address Line 2 (optional)</Text>
                  <Text style={styles.summaryValue}>
                    {applicantData.applicantHomeAddress2 || ""}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryKey}>Town or City</Text>
                  <Text style={styles.summaryValue}>
                    {applicantData.townOrCity ?? "Not provided"}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryKey}>Country</Text>
                  <Text style={styles.summaryValue}>
                    {getCountryName(applicantData.country) ?? "Not provided"}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryKey}>Postcode</Text>
                  <Text style={styles.summaryValue}>
                    {applicantData.postcode ?? "Not provided"}
                  </Text>
                </View>
              </View>
              <Text style={styles.sectionHeader}>Proposed UK Address</Text>
              <View style={styles.summarySection}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryKey}>Address Line 1</Text>
                  <Text style={styles.summaryValue}>
                    {travelData.applicantUkAddress1 || "Not provided"}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryKey}>Address Line 2 (optional)</Text>
                  <Text style={styles.summaryValue}>
                    {travelData.applicantUkAddress2 || "Not provided"}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryKey}>Town or City</Text>
                  <Text style={styles.summaryValue}>{travelData.townOrCity || "Not provided"}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryKey}>County</Text>
                  <Text style={styles.summaryValue}>
                    {travelData.applicantUkAddress3 || "Not provided"}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryKey}>Postcode</Text>
                  <Text style={styles.summaryValue}>{travelData.postcode || "Not provided"}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.bottomContentRow}>
            <View style={styles.bottomContentColumn}>
              <Text style={styles.sectionHeader}>Clinic and certificate information</Text>
              <View style={styles.summarySection}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryKey}>Clinic name</Text>
                  <Text style={styles.summaryValue}>Lakeside Medical & TB Screening Centre</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryKey}>Address line 1</Text>
                  <Text style={styles.summaryValue}>{""}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryKey}>Town or city</Text>
                  <Text style={styles.summaryValue}>{""}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryKey}>Country</Text>
                  <Text style={styles.summaryValue}>{""}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryKey}>Postcode</Text>
                  <Text style={styles.summaryValue}>{""}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryKey}>Certificate unique reference number</Text>
                  <Text style={styles.summaryValue}>
                    {tbCertificateData.certificateNumber ?? "Not provided"}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryKey}>Name of physician</Text>
                  <Text style={styles.summaryValue}>
                    {tbCertificateData.declaringPhysicianName ?? "Not provided"}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryKey}>Certificate issue date</Text>
                  <Text style={styles.summaryValue}>
                    {tbCertificateData.certificateDate.day &&
                    tbCertificateData.certificateDate.month &&
                    tbCertificateData.certificateDate.year
                      ? formatDateForDisplay(tbCertificateData.certificateDate)
                      : "Not provided"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.bottomContentColumn, styles.lastContentColumn]}>
              <Text style={styles.sectionHeader}>Screening information</Text>
              <View style={styles.summarySection}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryKey}>Chest x-ray done</Text>
                  <Text style={styles.summaryValue}>
                    {chestXrayData.chestXrayTaken ?? "Not provided"}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryKey}>Chest x-ray outcome</Text>
                  <Text style={styles.summaryValue}>
                    {chestXrayData.chestXrayTaken === YesOrNo.NO
                      ? "N/A"
                      : (chestXrayData.xrayResult ?? "Not provided")}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryKey}>Sputum collected</Text>
                  <Text style={styles.summaryValue}>
                    {chestXrayData.isSputumRequired ?? "Not provided"}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryKey}>Sputum outcome</Text>
                  <Text style={styles.summaryValue}>
                    {chestXrayData.isSputumRequired === YesOrNo.NO
                      ? "N/A"
                      : calculateSputumOutcome(chestXrayData, sputumData)}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryKey}>Pregnant?</Text>
                  <Text style={styles.summaryValue}>
                    {medicalScreeningData.pregnant ?? "Not provided"}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryKey}>Child under 11 years</Text>
                  <Text style={styles.summaryValue}>
                    {isChildUnder11(medicalScreeningData) ?? "Not provided"}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryKey}>
                    Certificate URN(s) of accompanying children under 11 years of age
                  </Text>
                  <Text style={styles.summaryValue}>{"Not provided"}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryKey}>Clinical suspicion of active pulmonary TB</Text>
                  <Text style={styles.summaryValue}>
                    {tbCertificateData.isIssued === YesOrNo.YES ? "No" : "Yes"}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.commentsSection}>
            <Text style={styles.commentsTitle}>Comments:</Text>
            <Text style={styles.commentsContent}>
              {tbCertificateData.comments || "Not provided"}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
