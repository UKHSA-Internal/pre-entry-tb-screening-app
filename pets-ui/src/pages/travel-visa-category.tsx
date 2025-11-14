import { useSearchParams } from "react-router-dom";

import Container from "@/components/container/container";
import { useAppSelector } from "@/redux/hooks";
import { selectTravel } from "@/redux/store";
import ApplicantTravelVisaCategory from "@/sections/applicant-travel-visa-category";
import { ApplicationStatus } from "@/utils/enums";

export default function TravelVisaCategoryPage() {
  const travel = useAppSelector(selectTravel);
  const [searchParams] = useSearchParams();
  const fromParam = searchParams.get("from");
  let backLinkTo: string;
  if (fromParam === "/check-travel-information") {
    backLinkTo = "/check-travel-information";
  } else if (travel.status === ApplicationStatus.COMPLETE) {
    backLinkTo = "/tb-certificate-summary";
  } else {
    backLinkTo = "/tracker";
  }

  return (
    <Container
      title="Proposed visa category - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo={backLinkTo}
    >
      <ApplicantTravelVisaCategory />
    </Container>
  );
}
