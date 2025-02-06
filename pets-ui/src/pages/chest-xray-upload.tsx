import "./chest-xray-upload.scss";

import { Helmet } from "react-helmet-async";

import Breadcrumb, { IBreadcrumbItem } from "@/components/breadcrumb/breadcrumb";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import ChestXrayForm from "@/sections/chest-xray-form";

export default function ChestXrayUploadPage() {
  const breadcrumbItems: IBreadcrumbItem[] = [
    {
      text: "Home",
      href: "/",
    },
    {
      text: "Application Search",
      href: "/applicant-search",
    },
    {
      text: "Medical Screening",
      href: "#",
    },
  ];

  return (
    <body className="govuk-template__body">
      <Helmet>
        <title> Chest X-rays upload</title>
      </Helmet>
      <Header />
      <div className="govuk-width-container">
        <Breadcrumb items={breadcrumbItems} />
        <main className="govuk-main-wrapper">
          <h1 className="govuk-heading-l">Applicant progress tracker</h1>
          <ChestXrayForm />
        </main>
      </div>
      <Footer />
    </body>
  );
}
