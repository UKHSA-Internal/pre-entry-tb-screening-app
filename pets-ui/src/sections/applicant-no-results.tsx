import { useNavigate } from "react-router";
import StartButton from "@/components/startButton/startButton";

const ApplicantEmptyResult = () => {
  const navigate = useNavigate()
  
  return(
    <main className="govuk-main-wrapper">
      <h1 className="govuk-heading-l">No matching record found</h1>
      <p className="govuk-body">No matches for the passport number XXXXXX</p>
      <br/>
      <StartButton 
        id="create-new-applicant" 
        text="Create new applicant" 
        href="" 
        handleClick={() => navigate("/contact")}
      />
      <br/>
      <a className="govuk-link" style={{color: "#1d70b8"}} onClick={() => navigate("/applicant-search")}>
        Search again
      </a>
    </main>
  )
}

export default ApplicantEmptyResult;
