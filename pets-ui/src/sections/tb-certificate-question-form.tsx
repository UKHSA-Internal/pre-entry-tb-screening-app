import { selectTbCertificate } from "@redux/store";
import { useEffect, useRef } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import { ReduxTbCertificateType } from "@/applicant";
import ErrorSummary from "@/components/errorSummary/errorSummary";
import Heading from "@/components/heading/heading";
import Radio from "@/components/radio/radio";
import SubmitButton from "@/components/submitButton/submitButton";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setIsIssued } from "@/redux/tbCertificateSlice";
import { ButtonType, RadioIsInline, YesOrNo } from "@/utils/enums";

const TbCertificateQuestionForm = () => {
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
    dispatch(setIsIssued(data.isIssued));

    if (data.isIssued === YesOrNo.YES) {
      navigate("/tb-certificate-declaration");
    } else {
      navigate("/tb-certificate-not-issued");
    }
  };

  const errorsToShow = Object.keys(errors);
  const isIssuedRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (location.hash) {
      const target = location.hash.substring(1);
      if (target === "tb-clearance-issued") {
        isIssuedRef.current?.scrollIntoView();
      }
    }
  }, [location]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {!!errors?.isIssued && <ErrorSummary errorsToShow={errorsToShow} errors={errors} />}
        <Heading level={1} size="l" title="Will you issue a TB clearance certificate?" />
        <div ref={isIssuedRef}>
          <Radio
            id="tb-clearance-issued"
            isInline={RadioIsInline.TRUE}
            answerOptions={["Yes", "No"]}
            sortAnswersAlphabetically={false}
            errorMessage={errors?.isIssued?.message ?? ""}
            formValue="isIssued"
            defaultValue={tbCertificateData.isIssued}
            required="Select yes if you will issue a TB clearance certificate"
            divStyle={{ marginTop: 40 }}
          />
        </div>
        <SubmitButton id="Continue" type={ButtonType.DEFAULT} text="Continue" />
      </form>
    </FormProvider>
  );
};

export default TbCertificateQuestionForm;
