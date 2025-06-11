import { IBreadcrumbItem } from "@/components/breadcrumb/breadcrumb";
import Confirmation from "@/components/confirmation/confirmation";
import Container from "@/components/container/container";
import LinkLabel from "@/components/linkLabel/LinkLabel";
import { selectChestXray } from "@/redux/chestXraySlice";
import { useAppSelector } from "@/redux/hooks";
import { YesOrNo } from "@/utils/enums";

export default function ChestXrayConfirmation() {
  const chestXrayData = useAppSelector(selectChestXray);

  const breadcrumbItems: IBreadcrumbItem[] = [
    {
      text: "Application progress tracker",
      href: "/tracker",
    },
  ];

  const isSputumRequired = chestXrayData.isSputumRequired === YesOrNo.YES;

  const nextStep = isSputumRequired ? "/sputum-collection" : "/tb-certificate-declaration";

  const furtherInfo = isSputumRequired
    ? [
        "You cannot currently log sputum test information in this service.",
        <>
          <strong>Continue to sputum collection</strong> or go to{" "}
          <LinkLabel to="/tracker" title="TB screening progress tracker" externalLink={false} />.
        </>,
      ]
    : [
        "You cannot currently log sputum test information in this service.",
        <>
          Continue to <strong>TB certificate declaration</strong> or go to{" "}
          <LinkLabel to="/tracker" title="TB screening progress tracker" externalLink={false} />.
        </>,
      ];

  return (
    <Container title="Radiological outcome confirmed" breadcrumbItems={breadcrumbItems}>
      <Confirmation
        confirmationText={"Radiological outcome confirmed"}
        furtherInfo={furtherInfo}
        buttonText={"Continue"}
        buttonLink={nextStep}
        whatHappensNext
      />
    </Container>
  );
}
