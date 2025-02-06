import "./progress-tracker.scss";

import { Helmet } from "react-helmet-async";

import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import ProgressTracker from "@/sections/progress-tracker";

export default function ProgressTrackerPage() {
  return (
    <body className="govuk-template__body">
      <Helmet>
        <title> Application Progress Tracker</title>
      </Helmet>
      <Header />
      <div className="govuk-width-container">
        <main className="govuk-main-wrapper">
          <h1 className="govuk-heading-l">Application Progress Tracker</h1>
          <ProgressTracker />
        </main>
      </div>
      <Footer />
    </body>
  );
}
