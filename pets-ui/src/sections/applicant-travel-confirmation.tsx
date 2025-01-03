import { useAppSelector } from '@/redux/hooks'
import { selectTravel } from '@/redux/travelSlice';

const TravelReview = () => {
  const travel = useAppSelector(selectTravel);
  return(
    <>
      <p>Visa type: {travel.visaType}</p>
      <p>Address line 1: {travel.applicantUkAddress1}</p>
      <p>Phone number: {travel.ukMobileNumber}</p>
      <p>Email address: {travel.ukEmail}</p>
    </>
  )
}

export default TravelReview;
