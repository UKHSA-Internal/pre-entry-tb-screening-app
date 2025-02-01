import { useAppSelector } from "@/redux/hooks";
import { selectMedicalScreening } from "@/redux/medicalScreeningSlice";

const MedicalScreeningReview = () => {
  const medicalScreening = useAppSelector(selectMedicalScreening);
  return (
    <>
      <p>Age: {medicalScreening.age}</p>
      <p>Previous TB: {medicalScreening.previousTb}</p>
      <p>Exam Notes: {medicalScreening.physicalExamNotes}</p>
    </>
  );
};

export default MedicalScreeningReview;
