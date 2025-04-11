import { useNavigate } from "react-router";

import Heading from "@/components/heading/heading";
import LinkLabel from "@/components/linkLabel/LinkLabel";
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
        handleClick={() => navigate("/contact")}
      />
      <br />
      <LinkLabel to="/applicant-search" title="Search again" externalLink={false} />
    </>
  );
};

export default ApplicantEmptyResult;
