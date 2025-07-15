import { IBreadcrumbItem } from "@/components/breadcrumb/breadcrumb";
import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";
import { useAppSelector } from "@/redux/hooks";
import { selectTbCertificate } from "@/redux/tbCertificateSlice";
import TbSummary from "@/sections/tb-summary";
import { YesOrNo } from "@/utils/enums";

export default function TbSummaryPage() {
  const tbCertificateData = useAppSelector(selectTbCertificate);

  const breadcrumbItems: IBreadcrumbItem[] = [
    {
      text: "Application progress tracker",
      href: "/tracker",
    },
  ];

  const pageTitle =
    tbCertificateData.isIssued === YesOrNo.NO
      ? "Check TB clearance outcome"
      : "Check certificate information";

  return (
    <Container title="TB Summary" breadcrumbItems={breadcrumbItems}>
      <Heading level={1} size="l" title={pageTitle} />
      <TbSummary />
    </Container>
  );
}
