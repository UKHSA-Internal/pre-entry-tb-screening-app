import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

import { postSputumRequirement } from "@/api/api";
import Button from "@/components/button/button";
import Heading from "@/components/heading/heading";
import Spinner from "@/components/spinner/spinner";
import Summary from "@/components/summary/summary";
import { useAppSelector } from "@/redux/hooks";
import {
  setSputumDecisionCompletionDate,
  setSputumDecisionStatus,
} from "@/redux/sputumDecisionSlice";
import { selectApplication, selectSputumDecision } from "@/redux/store";
import { ApplicationStatus, ButtonClass, YesOrNo } from "@/utils/enums";

const SputumDecisionSummary = () => {
  const sputumDecisionData = useAppSelector(selectSputumDecision);
  const applicationData = useAppSelector(selectApplication);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await postSputumRequirement(applicationData.applicationId, {
        sputumRequired: sputumDecisionData.isSputumRequired,
      });

      dispatch(setSputumDecisionStatus(ApplicationStatus.COMPLETE));
      const now = new Date();
      dispatch(
        setSputumDecisionCompletionDate({
          year: now.getFullYear().toString(),
          month: (now.getMonth() + 1).toString().padStart(2, "0"),
          day: now.getDate().toString().padStart(2, "0"),
        }),
      );

      navigate("/sputum-decision-confirmed");
    } catch (error) {
      console.error(error);
      navigate("/sorry-there-is-problem-with-service");
    } finally {
      setIsLoading(false);
    }
  };

  const summaryData = [
    {
      key: "Sputum required",
      value: sputumDecisionData.isSputumRequired === YesOrNo.YES ? "Yes" : "No",
      link: "/is-sputum-collection-required",
      hiddenLabel: "sputum collection required",
    },
  ];

  return (
    <div>
      {isLoading && <Spinner />}
      <Summary status={sputumDecisionData.status} summaryElements={summaryData} />

      {(sputumDecisionData.status == ApplicationStatus.NOT_YET_STARTED ||
        sputumDecisionData.status == ApplicationStatus.IN_PROGRESS) && (
        <div>
          <Heading title="Now send the sputum decision" level={2} size="m" />
          <p className="govuk-body">
            You will not be able to change the collection details and results after you submit this
            information. However, you will be able to return and complete any information that you
            have not provided.
          </p>
          <Button
            id="submit"
            class={ButtonClass.DEFAULT}
            text="Submit and continue"
            handleClick={handleSubmit}
          />
        </div>
      )}

      {sputumDecisionData.status == ApplicationStatus.COMPLETE && (
        <Button
          id="back-to-tracker"
          class={ButtonClass.DEFAULT}
          text="Return to tracker"
          handleClick={() => navigate("/tracker")}
        />
      )}
    </div>
  );
};

export default SputumDecisionSummary;
