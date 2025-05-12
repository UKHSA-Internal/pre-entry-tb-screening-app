import "./globals.scss";

import { Route, Routes } from "react-router-dom";

import { AuthenticatedRoute, UnauthenticatedRoute } from "./auth/authRoutes";
import ApiDocs from "./pages/api-docs";
import ApplicantConfirmation from "./pages/applicant-confirmation";
import ApplicantPhotoPage from "./pages/applicant-photo";
import ApplicantResultsPage from "./pages/applicant-results";
import ApplicantSearchPage from "./pages/applicant-search";
import ApplicantSummaryPage from "./pages/applicant-summary";
import ChestXrayConfirmation from "./pages/chest-xray-confirmation";
import ChestXrayFindingsPage from "./pages/chest-xray-findings";
import ChestXrayNotTaken from "./pages/chest-xray-not-taken";
import ChestXrayQuestionPage from "./pages/chest-xray-question";
import ChestXraySummaryPage from "./pages/chest-xray-summary";
import ChestXrayUploadPage from "./pages/chest-xray-upload";
import ContactDetailsPage from "./pages/contact-details";
import ErrorPage from "./pages/error-page";
import HomePage from "./pages/home-page";
import MedicalScreeningPage from "./pages/medical-screening";
import MedicalConfirmation from "./pages/medical-screening-confirmation";
import MedicalSummaryPage from "./pages/medical-screening-summary";
import ProgressTrackerPage from "./pages/progress-tracker";
import TbCertificateDeclarationPage from "./pages/tb-certificate-declaration";
import TbConfirmationPage from "./pages/tb-confirmation";
import TbSummaryPage from "./pages/tb-summary";
import TravelConfirmation from "./pages/travel-confirmation";
import TravelDetailsPage from "./pages/travel-details";
import TravelSummaryPage from "./pages/travel-summary";
// import { RedirectedRouteIfReduxEmpty } from "./utils/redirect";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <UnauthenticatedRoute>
            <HomePage />
          </UnauthenticatedRoute>
        }
      />
      <Route
        path="/applicant-search"
        element={
          <AuthenticatedRoute>
            <ApplicantSearchPage />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/tracker"
        element={
          <AuthenticatedRoute>
            {/* <RedirectedRouteIfReduxEmpty> */}
            <ProgressTrackerPage />
            {/* </RedirectedRouteIfReduxEmpty> */}
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/applicant-results"
        element={
          <AuthenticatedRoute>
            {/* <RedirectedRouteIfReduxEmpty> */}
            <ApplicantResultsPage />
            {/* </RedirectedRouteIfReduxEmpty> */}
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/contact"
        element={
          <AuthenticatedRoute>
            {/* <RedirectedRouteIfReduxEmpty> */}
            <ContactDetailsPage />
            {/* </RedirectedRouteIfReduxEmpty> */}
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/applicant-photo"
        element={
          <AuthenticatedRoute>
            {/* <RedirectedRouteIfReduxEmpty> */}
            <ApplicantPhotoPage />
            {/* </RedirectedRouteIfReduxEmpty> */}
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/applicant-summary"
        element={
          <AuthenticatedRoute>
            {/* <RedirectedRouteIfReduxEmpty> */}
            <ApplicantSummaryPage />
            {/* </RedirectedRouteIfReduxEmpty> */}
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/applicant-confirmation"
        element={
          <AuthenticatedRoute>
            {/* <RedirectedRouteIfReduxEmpty> */}
            <ApplicantConfirmation />
            {/* </RedirectedRouteIfReduxEmpty> */}
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/medical-screening"
        element={
          <AuthenticatedRoute>
            {/* <RedirectedRouteIfReduxEmpty> */}
            <MedicalScreeningPage />
            {/* </RedirectedRouteIfReduxEmpty> */}
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/medical-summary"
        element={
          <AuthenticatedRoute>
            {/* <RedirectedRouteIfReduxEmpty> */}
            <MedicalSummaryPage />
            {/* </RedirectedRouteIfReduxEmpty> */}
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/medical-confirmation"
        element={
          <AuthenticatedRoute>
            {/* <RedirectedRouteIfReduxEmpty> */}
            <MedicalConfirmation />
            {/* </RedirectedRouteIfReduxEmpty> */}
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/travel-details"
        element={
          <AuthenticatedRoute>
            {/* <RedirectedRouteIfReduxEmpty> */}
            <TravelDetailsPage />
            {/* </RedirectedRouteIfReduxEmpty> */}
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/travel-summary"
        element={
          <AuthenticatedRoute>
            {/* <RedirectedRouteIfReduxEmpty> */}
            <TravelSummaryPage />
            {/* </RedirectedRouteIfReduxEmpty> */}
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/travel-confirmation"
        element={
          <AuthenticatedRoute>
            {/* <RedirectedRouteIfReduxEmpty> */}
            <TravelConfirmation />
            {/* </RedirectedRouteIfReduxEmpty> */}
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/chest-xray-findings"
        element={
          <AuthenticatedRoute>
            {/* <RedirectedRouteIfReduxEmpty> */}
            <ChestXrayFindingsPage />
            {/* </RedirectedRouteIfReduxEmpty> */}
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/chest-xray-question"
        element={
          <AuthenticatedRoute>
            {/* <RedirectedRouteIfReduxEmpty> */}
            <ChestXrayQuestionPage />
            {/* </RedirectedRouteIfReduxEmpty> */}
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/chest-xray-not-taken"
        element={
          <AuthenticatedRoute>
            {/* <RedirectedRouteIfReduxEmpty> */}
            <ChestXrayNotTaken />
            {/* </RedirectedRouteIfReduxEmpty> */}
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/chest-xray-summary"
        element={
          <AuthenticatedRoute>
            {/* <RedirectedRouteIfReduxEmpty> */}
            <ChestXraySummaryPage />
            {/* </RedirectedRouteIfReduxEmpty> */}
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/chest-xray-upload"
        element={
          <AuthenticatedRoute>
            {/* <RedirectedRouteIfReduxEmpty> */}
            <ChestXrayUploadPage />
            {/* </RedirectedRouteIfReduxEmpty> */}
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/chest-xray-confirmation"
        element={
          <AuthenticatedRoute>
            {/* <RedirectedRouteIfReduxEmpty> */}
            <ChestXrayConfirmation />
            {/* </RedirectedRouteIfReduxEmpty> */}
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/tb-certificate-declaration"
        element={
          <AuthenticatedRoute>
            {/* <RedirectedRouteIfReduxEmpty> */}
            <TbCertificateDeclarationPage />
            {/* </RedirectedRouteIfReduxEmpty> */}
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/tb-certificate-summary"
        element={
          <AuthenticatedRoute>
            {/* <RedirectedRouteIfReduxEmpty> */}
            <TbSummaryPage />
            {/* </RedirectedRouteIfReduxEmpty> */}
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/tb-certificate-confirmation"
        element={
          <AuthenticatedRoute>
            {/* <RedirectedRouteIfReduxEmpty> */}
            <TbConfirmationPage />
            {/* </RedirectedRouteIfReduxEmpty> */}
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/api-docs"
        element={
          <AuthenticatedRoute>
            <ApiDocs />
          </AuthenticatedRoute>
        }
      />
      <Route path="/error" element={<ErrorPage />} />
    </Routes>
  );
}

export default App;
