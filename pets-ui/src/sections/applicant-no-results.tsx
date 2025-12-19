import { useNavigate } from "react-router";

import Button from "@/components/button/button";
import Heading from "@/components/heading/heading";
import LinkLabel from "@/components/linkLabel/LinkLabel";
import { useAppSelector } from "@/redux/hooks";
import { selectApplicant } from "@/redux/store";
import { ButtonClass } from "@/utils/enums";

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
      <Button
        id="continue"
        text="Continue"
        handleClick={() => navigate("/do-you-have-visa-applicant-written-consent-for-tb-screening")}
        class={ButtonClass.DEFAULT}
      />
      <br />
      <p className="govuk-body">
        <LinkLabel to="/search-for-visa-applicant" title="Search again" externalLink={false} />
      </p>
    </>
  );
};

export default ApplicantEmptyResult;
