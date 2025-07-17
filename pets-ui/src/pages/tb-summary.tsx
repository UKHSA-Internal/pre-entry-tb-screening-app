import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";
import { useAppSelector } from "@/redux/hooks";
import { selectTravel } from "@/redux/travelSlice";
import TbSummary from "@/sections/tb-summary";
import { ApplicationStatus } from "@/utils/enums";

export default function TbSummaryPage() {
  const tbCertificateData = useAppSelector(selectTravel);

  return (
    <Container
      title="TB Summary"
      backLinkTo={
        tbCertificateData.status == ApplicationStatus.COMPLETE
          ? "/tracker"
          : "/tb-certificate-declaration"
      }
    >
      <Heading level={1} size="l" title="Check TB clearance certificate declaration" />
      <TbSummary />
    </Container>
  );
}
