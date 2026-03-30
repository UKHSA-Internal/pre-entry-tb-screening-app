import { useEffect } from "react";

import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";
import LinkLabel from "@/components/linkLabel/LinkLabel";
import { setUserClinicId } from "@/redux/clinicSlice";
import { useAppDispatch } from "@/redux/hooks";
import { setGoogleAnalyticsParams } from "@/utils/google-analytics-utils";
import { getUserProperties } from "@/utils/userProperties";

export default function TaskChoicePage() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const setUserProperties = async () => {
      const userProperties = await getUserProperties();
      setGoogleAnalyticsParams("user_properties", {
        user_role: userProperties.jobTitle,
        clinic_id: userProperties.clinicId,
      });
      dispatch(setUserClinicId(userProperties.clinicId ?? ""));
    };
    void setUserProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container
      title="No visa applicant found - Complete UK pre-entry health screening - GOV.UK"
      useTwoThirdsColumn={false}
    >
      <Heading level={1} size="l" title="What do you need to do?" />
      <div className="dfe-grid-container">
        <div className="dfe-card">
          <div className="dfe-card-container">
            <LinkLabel
              title="Search for or start a new screening"
              to="/search-for-visa-applicant"
              externalLink={false}
              className="govuk-heading-l govuk-link govuk-link--no-visited-state task-choice-link"
            />
          </div>
        </div>
        <div className="dfe-card">
          <div className="dfe-card-container">
            <LinkLabel
              title="View all screenings in progress"
              to="/screenings-in-progress"
              externalLink={false}
              className="govuk-heading-l govuk-link govuk-link--no-visited-state task-choice-link"
            />
          </div>
        </div>
      </div>
    </Container>
  );
}
