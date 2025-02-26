import "./chest-xray-summary.scss";

import { Helmet } from "react-helmet-async";

import Breadcrumb, { IBreadcrumbItem } from "@/components/breadcrumb/breadcrumb";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import ChestXraySummary from "@/sections/chest-xray-summary";

export default function ChestXraySummaryPage() {
  const breadcrumbItems: IBreadcrumbItem[] = [
    {
      text: "Application progress tracker",
      href: "/tracker",
    },
  ];
  return (
    <body className="govuk-template__body">
      <Helmet>
        <title>Chest X-ray Summary</title>
      </Helmet>
      <Header />
      <div className="govuk-width-container">
        <Breadcrumb items={breadcrumbItems} />
        <main className="govuk-main-wrapper">
          <h1 className="govuk-heading-l">Check chest X-ray information</h1>
          <ChestXraySummary />
        </main>
      </div>
      <Footer />
    </body>
  );
}
