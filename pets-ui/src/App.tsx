import "./globals.scss";

import { Route, Routes } from "react-router-dom";

import { AuthenticatedRoute, UnauthenticatedRoute } from "./auth/authRoutes";
import AccessibilityStatementPage from "./pages/accessibility-statement";
import ApiDocs from "./pages/api-docs";
import ApplicantConfirmation from "./pages/applicant-confirmation";
import ApplicantPhotoPage from "./pages/applicant-photo";
import ApplicantResultsPage from "./pages/applicant-results";
import ApplicantSearchPage from "./pages/applicant-search";
import ApplicantSummaryPage from "./pages/applicant-summary";
import CheckSputumSampleInformationPage from "./pages/check-sputum-sample-information";
import ChestXrayConfirmation from "./pages/chest-xray-confirmation";
import ChestXrayFindingsPage from "./pages/chest-xray-findings";
import ChestXrayNotTakenForm from "./pages/chest-xray-not-taken";
import ChestXrayOutcomePage from "./pages/chest-xray-outcome";
import ChestXrayQuestionPage from "./pages/chest-xray-question";
import ChestXraySummaryPage from "./pages/chest-xray-summary";
import ChestXrayUploadPage from "./pages/chest-xray-upload";
import ContactDetailsPage from "./pages/contact-details";
import EnterSputumSampleResultsPage from "./pages/enter-sputum-sample-results";
import ErrorPage from "./pages/error-page";
import HomePage from "./pages/home-page";
import MedicalScreeningPage from "./pages/medical-screening";
import MedicalConfirmation from "./pages/medical-screening-confirmation";
import MedicalSummaryPage from "./pages/medical-screening-summary";
import PrivacyNoticePage from "./pages/privacy-notice";
import ProgressTrackerPage from "./pages/progress-tracker";
import RadiologicalOutcomeConfirmation from "./pages/radiological-outcome-confirmation";
import RadiologicalOutcomeSummaryPage from "./pages/radiological-outcome-summary";
import SignOutPage from "./pages/sign-out";
import SignedOutPage from "./pages/signed-out";
import SputumCollectionPage from "./pages/sputum-collection";
import SputumConfirmation from "./pages/sputum-confirmation";
import SputumDecisionConfirmation from "./pages/sputum-decision-confirmation";
import SputumDecisionSummaryPage from "./pages/sputum-decision-summary";
import SputumQuestionPage from "./pages/sputum-question";
import TbCertificateDeclarationPage from "./pages/tb-certificate-declaration";
import TbCertificateNotIssuedPage from "./pages/tb-certificate-not-issued";
import TbCertificatePrintPage from "./pages/tb-certificate-print";
import TbCertificateQuestionPage from "./pages/tb-certificate-question";
import TbConfirmationPage from "./pages/tb-confirmation";
import TbSummaryPage from "./pages/tb-summary";
import TravelConfirmation from "./pages/travel-confirmation";
import TravelDetailsPage from "./pages/travel-details";
import TravelSummaryPage from "./pages/travel-summary";
import { RedirectedRouteIfReduxEmpty } from "./utils/redirect";

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
        path="/search-for-visa-applicant"
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
            <RedirectedRouteIfReduxEmpty>
              <ProgressTrackerPage />
            </RedirectedRouteIfReduxEmpty>
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/no-matching-record-found"
        element={
          <AuthenticatedRoute>
            <RedirectedRouteIfReduxEmpty>
              <ApplicantResultsPage />
            </RedirectedRouteIfReduxEmpty>
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/enter-applicant-information"
        element={
          <AuthenticatedRoute>
            <RedirectedRouteIfReduxEmpty>
              <ContactDetailsPage />
            </RedirectedRouteIfReduxEmpty>
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/upload-visa-applicant-photo"
        element={
          <AuthenticatedRoute>
            <RedirectedRouteIfReduxEmpty>
              <ApplicantPhotoPage />
            </RedirectedRouteIfReduxEmpty>
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/check-applicant-details"
        element={
          <AuthenticatedRoute>
            <RedirectedRouteIfReduxEmpty>
              <ApplicantSummaryPage />
            </RedirectedRouteIfReduxEmpty>
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/visa-applicant-details-confirmed"
        element={
          <AuthenticatedRoute>
            <RedirectedRouteIfReduxEmpty>
              <ApplicantConfirmation />
            </RedirectedRouteIfReduxEmpty>
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/record-medical-history-tb-symptoms"
        element={
          <AuthenticatedRoute>
            <RedirectedRouteIfReduxEmpty>
              <MedicalScreeningPage />
            </RedirectedRouteIfReduxEmpty>
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/check-medical-screening"
        element={
          <AuthenticatedRoute>
            <RedirectedRouteIfReduxEmpty>
              <MedicalSummaryPage />
            </RedirectedRouteIfReduxEmpty>
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/medical-history-tb-symptoms-confirmed"
        element={
          <AuthenticatedRoute>
            <RedirectedRouteIfReduxEmpty>
              <MedicalConfirmation />
            </RedirectedRouteIfReduxEmpty>
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/is-an-x-ray-required"
        element={
          <AuthenticatedRoute>
            <RedirectedRouteIfReduxEmpty>
              <ChestXrayQuestionPage />
            </RedirectedRouteIfReduxEmpty>
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/reason-x-ray-not-required"
        element={
          <AuthenticatedRoute>
            <RedirectedRouteIfReduxEmpty>
              <ChestXrayNotTakenForm />
            </RedirectedRouteIfReduxEmpty>
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/travel-information"
        element={
          <AuthenticatedRoute>
            <RedirectedRouteIfReduxEmpty>
              <TravelDetailsPage />
            </RedirectedRouteIfReduxEmpty>
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/check-travel-information"
        element={
          <AuthenticatedRoute>
            <RedirectedRouteIfReduxEmpty>
              <TravelSummaryPage />
            </RedirectedRouteIfReduxEmpty>
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/travel-information-confirmed"
        element={
          <AuthenticatedRoute>
            <RedirectedRouteIfReduxEmpty>
              <TravelConfirmation />
            </RedirectedRouteIfReduxEmpty>
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/upload-chest-x-ray-images"
        element={
          <AuthenticatedRoute>
            <RedirectedRouteIfReduxEmpty>
              <ChestXrayUploadPage />
            </RedirectedRouteIfReduxEmpty>
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/check-chest-x-ray-images"
        element={
          <AuthenticatedRoute>
            <RedirectedRouteIfReduxEmpty>
              <ChestXraySummaryPage />
            </RedirectedRouteIfReduxEmpty>
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/chest-x-ray-images-confirmed"
        element={
          <AuthenticatedRoute>
            <RedirectedRouteIfReduxEmpty>
              <ChestXrayConfirmation />
            </RedirectedRouteIfReduxEmpty>
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/chest-x-ray-results"
        element={
          <AuthenticatedRoute>
            <RedirectedRouteIfReduxEmpty>
              <ChestXrayOutcomePage />
            </RedirectedRouteIfReduxEmpty>
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/enter-x-ray-findings"
        element={
          <AuthenticatedRoute>
            <RedirectedRouteIfReduxEmpty>
              <ChestXrayFindingsPage />
            </RedirectedRouteIfReduxEmpty>
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/check-chest-x-ray-results-findings"
        element={
          <AuthenticatedRoute>
            <RedirectedRouteIfReduxEmpty>
              <RadiologicalOutcomeSummaryPage />
            </RedirectedRouteIfReduxEmpty>
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/radiological-outcome-confirmed"
        element={
          <AuthenticatedRoute>
            <RedirectedRouteIfReduxEmpty>
              <RadiologicalOutcomeConfirmation />
            </RedirectedRouteIfReduxEmpty>
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/is-sputum-collection-required"
        element={
          <AuthenticatedRoute>
            <RedirectedRouteIfReduxEmpty>
              <SputumQuestionPage />
            </RedirectedRouteIfReduxEmpty>
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/check-sputum-decision-information"
        element={
          <AuthenticatedRoute>
            <RedirectedRouteIfReduxEmpty>
              <SputumDecisionSummaryPage />
            </RedirectedRouteIfReduxEmpty>
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/sputum-decision-confirmed"
        element={
          <AuthenticatedRoute>
            <RedirectedRouteIfReduxEmpty>
              <SputumDecisionConfirmation />
            </RedirectedRouteIfReduxEmpty>
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/sputum-sample-information-confirmed"
        element={
          <AuthenticatedRoute>
            <RedirectedRouteIfReduxEmpty>
              <SputumConfirmation />
            </RedirectedRouteIfReduxEmpty>
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/enter-sputum-sample-collection-information"
        element={
          <AuthenticatedRoute>
            <RedirectedRouteIfReduxEmpty>
              <SputumCollectionPage />
            </RedirectedRouteIfReduxEmpty>
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/check-sputum-sample-information-results"
        element={
          <AuthenticatedRoute>
            <RedirectedRouteIfReduxEmpty>
              <CheckSputumSampleInformationPage />
            </RedirectedRouteIfReduxEmpty>
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/enter-sputum-sample-results"
        element={
          <AuthenticatedRoute>
            <RedirectedRouteIfReduxEmpty>
              <EnterSputumSampleResultsPage />
            </RedirectedRouteIfReduxEmpty>
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/will-you-issue-tb-clearance-certificate"
        element={
          <AuthenticatedRoute>
            <RedirectedRouteIfReduxEmpty>
              <TbCertificateQuestionPage />
            </RedirectedRouteIfReduxEmpty>
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/enter-clinic-certificate-information"
        element={
          <AuthenticatedRoute>
            <RedirectedRouteIfReduxEmpty>
              <TbCertificateDeclarationPage />
            </RedirectedRouteIfReduxEmpty>
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/why-are-you-not-issuing-certificate"
        element={
          <AuthenticatedRoute>
            <RedirectedRouteIfReduxEmpty>
              <TbCertificateNotIssuedPage />
            </RedirectedRouteIfReduxEmpty>
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/tb-certificate-summary"
        element={
          <AuthenticatedRoute>
            <RedirectedRouteIfReduxEmpty>
              <TbSummaryPage />
            </RedirectedRouteIfReduxEmpty>
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/tb-clearance-certificate"
        element={
          <AuthenticatedRoute>
            <RedirectedRouteIfReduxEmpty>
              <TbCertificatePrintPage />
            </RedirectedRouteIfReduxEmpty>
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/tb-screening-complete"
        element={
          <AuthenticatedRoute>
            <RedirectedRouteIfReduxEmpty>
              <TbConfirmationPage />
            </RedirectedRouteIfReduxEmpty>
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
      <Route
        path="/are-you-sure-you-want-to-sign-out"
        element={
          <AuthenticatedRoute>
            <SignOutPage />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/you-have-signed-out"
        element={
          <UnauthenticatedRoute>
            <SignedOutPage />
          </UnauthenticatedRoute>
        }
      />
      <Route path="/accessibility-statement" element={<AccessibilityStatementPage />} />
      <Route path="/privacy-notice" element={<PrivacyNoticePage />} />
      <Route path="/error" element={<ErrorPage />} />
    </Routes>
  );
}

export default App;
