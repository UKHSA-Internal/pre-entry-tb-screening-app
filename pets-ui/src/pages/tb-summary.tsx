import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";
import { useAppSelector } from "@/redux/hooks";
import { selectTbCertificate } from "@/redux/tbCertificateSlice";
import TbSummary from "@/sections/tb-summary";
import { ApplicationStatus, YesOrNo } from "@/utils/enums";

export default function TbSummaryPage() {
  const tbCertificateData = useAppSelector(selectTbCertificate);

  const getBackLinkTo = () => {
    if (tbCertificateData.status === ApplicationStatus.COMPLETE) {
      return "/tracker";
    }

    if (tbCertificateData.isIssued === YesOrNo.NO) {
      return "/tb-certificate-not-issued";
    }

    return "/tb-certificate-declaration";
  };

  const pageTitle =
    tbCertificateData.isIssued === YesOrNo.NO
      ? "Check TB clearance outcome"
      : "Check certificate information";

  return (
    <Container title="TB Summary" backLinkTo={getBackLinkTo()}>
      <Heading level={1} size="l" title={pageTitle} />
      <TbSummary />
    </Container>
  );
}
