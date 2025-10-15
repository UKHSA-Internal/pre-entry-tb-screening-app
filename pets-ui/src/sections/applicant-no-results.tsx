import { useNavigate } from "react-router";

import Heading from "@/components/heading/heading";
import LinkLabel from "@/components/linkLabel/LinkLabel";
import StartButton from "@/components/startButton/startButton";
import { useAppSelector } from "@/redux/hooks";
import { selectApplicant } from "@/redux/store";

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
        handleClick={() => navigate("/enter-applicant-information")}
      />
      <br />
      <LinkLabel to="/search-for-visa-applicant" title="Search again" externalLink={false} />
    </>
  );
};

export default ApplicantEmptyResult;
