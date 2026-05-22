import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";
import NotificationBanner from "@/components/notificationBanner/notificationBanner";
import { useAppSelector } from "@/redux/hooks";
import { selectUserDetails } from "@/redux/store";
import Dashboard from "@/sections/dashboard";

export default function DashboardPage() {
  const userData = useAppSelector(selectUserDetails);

  return (
    <Container
      title="Screenings in progress - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo="/what-do-you-need-to-do"
      shouldClearHistory={true}
      useTwoThirdsColumn={false}
    >
      {userData.isSuperUser && (
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-two-thirds">
            <NotificationBanner
              bannerTitle="Important"
              bannerHeading="You are signed in as a super user"
              bannerText="You have access to additional administrative features. Changes might affect all users."
            />
          </div>
        </div>
      )}
      <Heading level={1} size="l" title="Screenings in progress" />
      <Dashboard />
    </Container>
  );
}
