import { useNavigate } from "react-router";

import StartButton from "@/components/startButton/startButton";
import { selectApplicant } from "@/redux/applicantSlice";
import { useAppSelector } from "@/redux/hooks";

const ApplicantEmptyResult = () => {
  const applicantSearchData = useAppSelector(selectApplicant);
  const navigate = useNavigate();

  return (
    <main className="govuk-main-wrapper">
      <h1 className="govuk-heading-l">No matching record found</h1>
      <p className="govuk-body">
        No matches for passport number {applicantSearchData.passportNumber}
      </p>
      <br />
      <StartButton
        id="create-new-applicant"
        text="Create new applicant"
        href=""
        handleClick={() => navigate("/contact")}
      />
      <br />
      <a
        className="govuk-link"
        style={{ color: "#1d70b8" }}
        onClick={() => navigate("/applicant-search")}
        href="javascript:void(0);"
      >
        Search again
      </a>
    </main>
  );
};

export default ApplicantEmptyResult;
