import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { postSputumRequirement } from "@/api/api";
import Button from "@/components/button/button";
import Spinner from "@/components/spinner/spinner";
import Summary from "@/components/summary/summary";
import { useAppSelector } from "@/redux/hooks";
import {
  setSputumDecisionCompletionDate,
  setSputumDecisionStatus,
} from "@/redux/sputumDecisionSlice";
import { selectApplication, selectSputumDecision } from "@/redux/store";
import { ApplicationStatus, ButtonType, YesOrNo } from "@/utils/enums";

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
        isSputumRequired: sputumDecisionData.isSputumRequired,
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

      navigate("/sputum-decision-confirmation");
    } catch (error) {
      console.error(error);
      navigate("/error");
    } finally {
      setIsLoading(false);
    }
  };

  const summaryData = [
    {
      key: "Sputum required",
      value: sputumDecisionData.isSputumRequired === YesOrNo.YES ? "Yes" : "No",
      link: "/sputum-question",
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
          <Button
            id="confirm-sputum-decision"
            type={ButtonType.DEFAULT}
            text="Save and continue"
            handleClick={handleSubmit}
          />
        </div>
      )}

      {sputumDecisionData.status == ApplicationStatus.COMPLETE && (
        <Button
          id="back-to-tracker"
          type={ButtonType.DEFAULT}
          text="Return to tracker"
          handleClick={() => navigate("/tracker")}
        />
      )}
    </div>
  );
};

export default SputumDecisionSummary;
