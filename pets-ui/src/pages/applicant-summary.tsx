import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";
import { selectApplicant } from "@/redux/applicantSlice";
import { useAppSelector } from "@/redux/hooks";
import ApplicantReview from "@/sections/applicant-details-summary";
import { ApplicationStatus } from "@/utils/enums";

export default function ApplicantSummaryPage() {
  const applicantData = useAppSelector(selectApplicant);

  return (
    <Container
      title="Applicant details summary"
      backLinkTo={
        applicantData.status == ApplicationStatus.COMPLETE ? "/tracker" : "/applicant-photo"
      }
    >
      <Heading level={1} size="l" title="Check applicant details" />
      <ApplicantReview />
    </Container>
  );
}
