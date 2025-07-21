import Container from "@/components/container/container";
import { useAppSelector } from "@/redux/hooks";
import { selectSputum } from "@/redux/sputumSlice";
import SputumResultsForm from "@/sections/sputum-results-form";

export default function EnterSputumSampleResultsPage() {
  const sputumData = useAppSelector(selectSputum);

  const allSputumSamplesSubmitted =
    sputumData.sample1.collection.submittedToDatabase &&
    sputumData.sample2.collection.submittedToDatabase &&
    sputumData.sample3.collection.submittedToDatabase;

  return (
    <Container
      title="Enter sputum sample results"
      backLinkTo={allSputumSamplesSubmitted ? "/tracker" : "/sputum-collection"}
    >
      <SputumResultsForm />
    </Container>
  );
}
