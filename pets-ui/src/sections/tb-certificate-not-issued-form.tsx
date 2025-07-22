import { useEffect, useRef } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import { ReduxTbCertificateType } from "@/applicant";
import ErrorSummary from "@/components/errorSummary/errorSummary";
import FreeText from "@/components/freeText/freeText";
import Heading from "@/components/heading/heading";
import Radio from "@/components/radio/radio";
import SubmitButton from "@/components/submitButton/submitButton";
import TextArea from "@/components/textArea/textArea";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  selectTbCertificate,
  setComments,
  setDeclaringPhysicianName,
  setReasonNotIssued,
  setTbCertificateStatus,
} from "@/redux/tbCertificateSlice";
import { ApplicationStatus, ButtonType, RadioIsInline, TBCertNotIssuedReason } from "@/utils/enums";
import { formRegex } from "@/utils/records";

const TbCertificateNotIssuedForm = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const tbCertificateData = useAppSelector(selectTbCertificate);

  const methods = useForm<ReduxTbCertificateType>({ reValidateMode: "onSubmit" });
  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit: SubmitHandler<ReduxTbCertificateType> = (data) => {
    dispatch(setReasonNotIssued(data.reasonNotIssued || ""));
    dispatch(setDeclaringPhysicianName(data.declaringPhysicianName));
    dispatch(setComments(data.comments));
    dispatch(setTbCertificateStatus(ApplicationStatus.IN_PROGRESS));
    navigate("/tb-certificate-summary");
  };

  const errorsToShow = Object.keys(errors);
  const reasonNotIssuedRef = useRef<HTMLDivElement | null>(null);
  const declaringPhysicianNameRef = useRef<HTMLDivElement | null>(null);
  const commentsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (location.hash) {
      const target = location.hash.substring(1);
      if (target === "reason-not-issued") {
        reasonNotIssuedRef.current?.scrollIntoView();
      } else if (target === "declaring-physician-name") {
        declaringPhysicianNameRef.current?.scrollIntoView();
      } else if (target === "physician-comments") {
        commentsRef.current?.scrollIntoView();
      }
    }
  }, [location]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {!!errorsToShow?.length && <ErrorSummary errorsToShow={errorsToShow} errors={errors} />}

        <Heading level={1} size="l" title="Why are you not issuing a certificate?" />

        <div ref={reasonNotIssuedRef}>
          <Radio
            id="reason-not-issued"
            label=""
            isInline={RadioIsInline.FALSE}
            answerOptions={[
              TBCertNotIssuedReason.CONFIRMED_SUSPECTED_TB,
              TBCertNotIssuedReason.TESTING_POSTPONED,
              TBCertNotIssuedReason.APPLICATION_WITHDRAWN,
            ]}
            sortAnswersAlphabetically={false}
            errorMessage={errors?.reasonNotIssued?.message ?? ""}
            formValue="reasonNotIssued"
            defaultValue={tbCertificateData.reasonNotIssued}
            required="Select why you are not issuing a certificate"
            divStyle={{ marginTop: 40 }}
          />
        </div>

        <div ref={declaringPhysicianNameRef}>
          <FreeText
            id="declaring-physician-name"
            label="Declaring Physician's name"
            errorMessage={errors?.declaringPhysicianName?.message ?? ""}
            formValue="declaringPhysicianName"
            required="Enter the declaring physician's name"
            patternValue={formRegex.lettersSpacesAndPunctuation}
            patternError="Physician name must contain only letters, spaces and punctuation"
            defaultValue={tbCertificateData.declaringPhysicianName}
            divStyle={{ marginTop: 40 }}
          />
        </div>

        <div ref={commentsRef}>
          <TextArea
            id="physician-comments"
            label="Physician's notes (Optional)"
            errorMessage={errors?.comments?.message ?? ""}
            formValue="comments"
            required={false}
            rows={4}
            defaultValue={tbCertificateData.comments}
            divStyle={{ marginTop: 40 }}
          />
        </div>

        <SubmitButton id="Continue" type={ButtonType.DEFAULT} text="Continue" />
      </form>
    </FormProvider>
  );
};

export default TbCertificateNotIssuedForm;
