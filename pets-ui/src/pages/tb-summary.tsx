import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";
import { useAppSelector } from "@/redux/hooks";
import { selectTbCertificate } from "@/redux/store";
import TbSummary from "@/sections/tb-summary";
import { ApplicationStatus, YesOrNo } from "@/utils/enums";

export default function TbSummaryPage() {
  const tbCertificateData = useAppSelector(selectTbCertificate);

  let backLinkUrl = "/tb-certificate-declaration";
  if (tbCertificateData.status === ApplicationStatus.COMPLETE) {
    backLinkUrl = "/tracker";
  } else if (tbCertificateData.isIssued === YesOrNo.NO) {
    backLinkUrl = "/tb-certificate-not-issued";
  }

  const pageTitle =
    tbCertificateData.isIssued === YesOrNo.NO
      ? "Check TB clearance outcome"
      : "Check certificate information";

  return (
    <Container title="TB Summary" backLinkTo={backLinkUrl}>
      <Heading level={1} size="l" title={pageTitle} />
      <TbSummary />
    </Container>
  );
}
