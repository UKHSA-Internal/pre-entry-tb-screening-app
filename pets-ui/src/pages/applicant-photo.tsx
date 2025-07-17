import Container from "@/components/container/container";
import ApplicantPhotoForm from "@/sections/applicant-photo-form";

export default function ApplicantPhotoPage() {
  return (
    <Container title="Upload visa applicant photo" backLinkTo="/contact">
      <ApplicantPhotoForm />
    </Container>
  );
}
