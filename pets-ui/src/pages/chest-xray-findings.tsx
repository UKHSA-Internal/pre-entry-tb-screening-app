import { IBreadcrumbItem } from "@/components/breadcrumb/breadcrumb";
import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";
import NotificationBanner from "@/components/notificationBanner/notificationBanner";
import ChestXrayFindingsForm from "@/sections/chest-xray-findings-form";

export default function ChestXrayFindingsPage() {
  const breadcrumbItems: IBreadcrumbItem[] = [
    {
      text: "Application progress tracker",
      href: "/tracker",
    },
  ];

  return (
    <Container breadcrumbItems={breadcrumbItems} title="Enter chest X-ray findings">
      <NotificationBanner
        bannerTitle="Important"
        bannerText="If a visa applicant's chest X-rays indicate that they have pulmonary TB, give them a referral letter and copies of the:"
        list={["chest X-ray", "radiology report", "medical record form"]}
      />
      <Heading level={1} size="l" title="Enter radiological outcome and findings" />
      <ChestXrayFindingsForm />
    </Container>
  );
}
