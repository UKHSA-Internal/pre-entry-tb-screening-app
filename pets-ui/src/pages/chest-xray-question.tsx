import "./chest-xray-question.scss";

import { Helmet } from "react-helmet-async";

import Breadcrumb, { IBreadcrumbItem } from "@/components/breadcrumb/breadcrumb";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import CxrQuestionForm from "@/sections/chest-xray-question-form";

export default function ChestXrayQuestionPage() {
  const breadcrumbItems: IBreadcrumbItem[] = [
    { text: "Application progress tracker", href: "/tracker" },
  ];

  return (
    <body className="govuk-template__body">
      <Helmet>
        <title> Select X-ray status</title>
      </Helmet>
      <Header />
      <div className="govuk-width-container">
        <Breadcrumb items={breadcrumbItems} />
        <main className="govuk-main-wrapper">
          <h1 className="govuk-heading-l">Select X-ray status</h1>
          <CxrQuestionForm />
        </main>
      </div>
      <Footer />
    </body>
  );
}
