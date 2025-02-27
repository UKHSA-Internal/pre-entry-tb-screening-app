import "./chest-xray-findings.scss";

import { Helmet } from "react-helmet-async";

import Breadcrumb, { IBreadcrumbItem } from "@/components/breadcrumb/breadcrumb";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
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
    <>
      <Helmet>
        <title>Chest X-Ray Findings</title>
      </Helmet>
      <Header />
      <div className="govuk-width-container">
        <Breadcrumb items={breadcrumbItems} />
        <main className="govuk-main-wrapper">
          <NotificationBanner
            bannerTitle="Important"
            bannerText="If a visa applicant's chest X-rays indicate that they have pulmonary TB, give them a referral letter and copies of the:"
            list={["chest X-ray", "radiology report", "medical record form"]}
          />
          <h1 className="govuk-heading-l">Enter X-ray results and findings</h1>
          <ChestXrayFindingsForm />
        </main>
      </div>
      <Footer />
    </>
  );
}
