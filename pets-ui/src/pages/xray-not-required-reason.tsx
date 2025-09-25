import Container from "@/components/container/container";
import XrayNotRequiredReasonForm from "@/sections/xray-not-required-reason-form";

export default function XrayNotRequiredReasonPage() {
  return (
    <Container
      title="Reason X-ray is not required - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo="/xray-question"
    >
      <XrayNotRequiredReasonForm />
    </Container>
  );
}
