import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

import { cancelApplication } from "@/api/api";
import Button from "@/components/button/button";
import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";
import { setCancellationFurtherInfo, setCancellationReason } from "@/redux/applicationSlice";
import { useAppSelector } from "@/redux/hooks";
import { selectApplication } from "@/redux/store";
import { ButtonClass } from "@/utils/enums";

export default function CancellationAreYouSurePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const applicationData = useAppSelector(selectApplication);

  const handleCancelApp = async () => {
    try {
      if (applicationData.cancellationReason) {
        await cancelApplication(applicationData.applicationId, {
          cancellationReason: applicationData.cancellationReason,
          cancellationFurtherInfo: applicationData.cancellationFurtherInfo ?? "",
        });
        navigate("/tb-screening-cancelled");
      } else {
        throw new Error("Cancellation reason is missing blank");
      }
    } catch (error) {
      console.error(error);
      navigate("/sorry-there-is-problem-with-service");
    }
  };

  const handleExitCancellationFlow = () => {
    dispatch(setCancellationReason(""));
    dispatch(setCancellationFurtherInfo(""));
    navigate("/tracker");
  };

  return (
    <Container
      title="Are you sure you want to cancel this screening? - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo="/why-are-you-cancelling-this-screening"
    >
      <Heading level={1} size="l" title="Are you sure you want to cancel this screening?"></Heading>
      <p className="govuk-body">If you cancel, you will not be able to complete this screening.</p>
      <p className="govuk-body">
        The screening details will be saved. You will be able to view them in the visa
        applicant&apos;s screening history.
      </p>
      <p className="govuk-body">
        If the visa applicant returns for a new screening, you will need to start again.
      </p>
      <div className="govuk-button-group">
        <Button
          id="cancel-screening"
          class={ButtonClass.WARNING}
          text="Cancel screening"
          handleClick={handleCancelApp}
        />
        <Button
          id="return-to-screening"
          class={ButtonClass.SECONDARY}
          text="Return to screening"
          handleClick={handleExitCancellationFlow}
        />
      </div>
    </Container>
  );
}
