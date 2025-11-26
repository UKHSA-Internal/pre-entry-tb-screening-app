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
      <Heading level={1} size="l" title="No visa applicant found" />
      <p className="govuk-body">
        You can now create a new record for the visa applicant with passport number{" "}
        {applicantSearchData.passportNumber}
      </p>
      <br />
      <StartButton
        id="continue"
        text="Continue"
        handleClick={() => navigate("/do-you-have-visa-applicant-written-consent-for-tb-screening")}
      />
      <br />
      <p className="govuk-body">
        <LinkLabel to="/search-for-visa-applicant" title="Search again" externalLink={false} />
      </p>
    </>
  );
};

export default ApplicantEmptyResult;
