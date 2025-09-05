import Container from "@/components/container/container";
import { useAppSelector } from "@/redux/hooks";
import { selectRadiologicalOutcome } from "@/redux/store";
import SputumQuestionForm from "@/sections/sputum-question-form";
import { YesOrNo } from "@/utils/enums";

export default function SputumQuestionPage() {
  const radiologicalOutcomeData = useAppSelector(selectRadiologicalOutcome);

  return (
    <Container
      title="Is sputum collection required?"
      backLinkTo={
        radiologicalOutcomeData.chestXrayTaken == YesOrNo.YES
          ? "/chest-xray-findings"
          : "/chest-xray-not-taken"
      }
    >
      <SputumQuestionForm />
    </Container>
  );
}
