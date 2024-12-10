import { useAppSelector } from '@/redux/hooks'
import { selectApplicant } from '@redux/applicantSlice'

const ApplicantReview = () => {
  const applicant = useAppSelector(selectApplicant);
  return(
    <>
      <p>Name: {applicant.fullName}</p>
      <p>Country: {applicant.country}</p>
      <p>DOB: {`${applicant.dateOfBirth.day}-${applicant.dateOfBirth.month}-${applicant.dateOfBirth.year}`}</p>
    </>
  )
}

export default ApplicantReview;
