import Container from "@/components/container/container";
import { selectChestXray } from "@/redux/chestXraySlice";
import { useAppSelector } from "@/redux/hooks";
import SputumQuestionForm from "@/sections/sputum-question-form";
import { YesOrNo } from "@/utils/enums";

export default function SputumQuestionPage() {
  const chestXrayData = useAppSelector(selectChestXray);

  return (
    <Container
      title="Is sputum collection required?"
      backLinkTo={
        chestXrayData.chestXrayTaken == YesOrNo.YES
          ? "/chest-xray-findings"
          : "/chest-xray-not-taken"
      }
    >
      <SputumQuestionForm />
    </Container>
  );
}
