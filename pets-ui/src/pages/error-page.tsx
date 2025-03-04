import "./error-page.scss";

import { Helmet } from "react-helmet-async";

import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";

export default function ErrorPage() {
  return (
    <body className="govuk-template__body">
      <Helmet>
        <title> Error</title>
      </Helmet>
      <Header />
      <div className="govuk-width-container">
        <h1 className="govuk-heading-m">An error occurred</h1>
      </div>
      <Footer />
    </body>
  );
}
