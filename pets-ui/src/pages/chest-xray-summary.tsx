import "./chest-xray-summary.scss";

import { IBreadcrumbItem } from "@/components/breadcrumb/breadcrumb";
import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";
import { selectChestXray } from "@/redux/chestXraySlice";
import { useAppSelector } from "@/redux/hooks";
import ChestXrayNotTakenSummary from "@/sections/chest-xray-not-taken-summary";
import ChestXraySummary from "@/sections/chest-xray-summary";
import { YesOrNo } from "@/utils/enums";

export default function ChestXraySummaryPage() {
  const breadcrumbItems: IBreadcrumbItem[] = [
    {
      text: "Application progress tracker",
      href: "/tracker",
    },
  ];

  const chestXrayData = useAppSelector(selectChestXray);

  return (
    <Container title="Check chest X-ray information" breadcrumbItems={breadcrumbItems}>
      <Heading level={1} size="l" title="Check chest X-ray information" />
      {chestXrayData.chestXrayTaken == YesOrNo.YES && <ChestXraySummary />}
      {chestXrayData.chestXrayTaken == YesOrNo.NO && <ChestXrayNotTakenSummary />}
    </Container>
  );
}
