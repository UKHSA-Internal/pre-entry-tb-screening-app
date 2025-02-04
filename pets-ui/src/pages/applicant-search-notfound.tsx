import { Helmet } from 'react-helmet-async';
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import "./applicant-search.scss"
import StartButton from '@/components/startButton/startButton';
import { useLocation, useNavigate } from 'react-router';

export default function ApplicantSearchNotFound() {
  const navigate = useNavigate();
  const location = useLocation();

  const {passportNumber} = location.state;

  return (
    <body className="govuk-template__body">
      <Helmet>
        <title>Applicant Search</title>
      </Helmet>
      <Header/>
      <div className="govuk-width-container">
        <main className="govuk-main-wrapper">
          <h1 className="govuk-heading-l">No matching applicant found</h1>
          <p className="govuk-heading-s">No matches for the passport number "{passportNumber}"</p>

          <StartButton
            id="search"
            text="Create new applicant"
            href='/applicant-search'
            handleClick={() => {
              navigate('/'); // navigate to creeate new applicant
            }}
          />

          <p className="govuk-body">
            <a href="/applicant-search" className="govuk-link" rel="noreferrer noopener">Search again</a>
          </p>
        </main>
      </div>
      <Footer/>
    </body>
  );
}
