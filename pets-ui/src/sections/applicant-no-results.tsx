import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

import Heading from "@/components/heading/heading";
import StartButton from "@/components/startButton/startButton";
import { selectApplicant } from "@/redux/applicantSlice";
import { useAppSelector } from "@/redux/hooks";

const ApplicantEmptyResult = () => {
  const applicantSearchData = useAppSelector(selectApplicant);
  const navigate = useNavigate();

  return (
    <>
      <Heading level={1} size="l" title="No matching record found" />
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
      <Link className="govuk-link" style={{ color: "#1d70b8" }} to="/applicant-search">
        Search again
      </Link>
    </>
  );
};

export default ApplicantEmptyResult;
