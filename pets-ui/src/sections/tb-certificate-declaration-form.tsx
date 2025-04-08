import { useEffect, useRef } from "react";
import { Controller, FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";

import { DateType, ReduxTbCertificateType } from "@/applicant";
import ApplicantDataHeader from "@/components/applicantDataHeader/applicantDataHeader";
import Button from "@/components/button/button";
import DateTextInput from "@/components/dateTextInput/dateTextInput";
import ErrorDisplay from "@/components/errorSummary/errorSummary";
import FreeText from "@/components/freeText/freeText";
import Heading from "@/components/heading/heading";
import Radio from "@/components/radio/radio";
import TextArea from "@/components/textArea/textArea";
import { selectApplicant } from "@/redux/applicantSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  selectTbCertificate,
  setCertficateDate,
  setCertificateNumber,
  setComments,
  setIsIssued,
} from "@/redux/tbCertificateSlice";
import { ButtonType, RadioIsInline } from "@/utils/enums";
import { validateDate } from "@/utils/helpers";
import { formRegex } from "@/utils/records";

const TbCertificateDeclarationForm = () => {
  const applicantData = useAppSelector(selectApplicant);
  const tbCertificateData = useAppSelector(selectTbCertificate);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const methods = useForm<ReduxTbCertificateType>({ reValidateMode: "onSubmit" });
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = methods;

  const isTbClearanceIssued = watch("isIssued") as unknown as string;

  const onSubmit: SubmitHandler<ReduxTbCertificateType> = (tbCertificateData) => {
    dispatch(setIsIssued(tbCertificateData.isIssued));
    dispatch(setComments(tbCertificateData.comments));
    dispatch(setCertficateDate(tbCertificateData.certificateDate));
    dispatch(setCertificateNumber(tbCertificateData.certificateNumber));
    navigate("/tb-certificate-summary");
  };

  const errorsToShow = Object.keys(errors);

  // Required to scroll to the correct element when a change link on the summary page is clicked
  const location = useLocation();
  const tbClearanceIssued = useRef<HTMLDivElement | null>(null);
  const tbPhysicanComments = useRef<HTMLDivElement | null>(null);
  const tbCertificateDate = useRef<HTMLDivElement | null>(null);
  const tbCertificateNumber = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (location.hash) {
      const target = location.hash.substring(1);
      const refMap: { [key: string]: HTMLElement | null } = {
        "tb-clearance-issued": tbClearanceIssued.current,
        "physician-comments": tbPhysicanComments.current,
        "tb-certificate-date": tbCertificateDate.current,
        "tb-certificate-number": tbCertificateNumber.current,
      };

      const targetRef = refMap[target];
      if (targetRef) {
        targetRef.scrollIntoView();
      }
    }
  }, [location]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {!!errorsToShow?.length && <ErrorDisplay errorsToShow={errorsToShow} errors={errors} />}

        <ApplicantDataHeader applicantData={applicantData} />

        <div ref={tbClearanceIssued}>
          <Heading
            level={2}
            size="m"
            style={{ marginBottom: 20, marginTop: 40 }}
            title="Has a TB clearance certificate been issued?"
          />
          <Radio
            id="tb-clearance-issued"
            isInline={RadioIsInline.FALSE}
            answerOptions={["Yes", "No"]}
            sortAnswersAlphabetically={false}
            errorMessage={errors?.isIssued?.message ?? ""}
            formValue="isIssued"
            required="Select yes if a TB clearance certificate has been issued or no if it has not"
            defaultValue={tbCertificateData.isIssued}
          />
        </div>

        <div ref={tbPhysicanComments}>
          <TextArea
            id="physician-comments"
            required={false}
            errorMessage={errors?.comments?.message ?? ""}
            formValue="comments"
            rows={10}
            defaultValue={tbCertificateData.comments}
            heading="Physician comments"
          />
        </div>

        <Heading
          level={2}
          size="m"
          style={{ marginBottom: 20, marginTop: 60 }}
          title="If a clearance certificate has been issued, give:"
        />

        <div ref={tbCertificateDate}>
          <Heading
            level={2}
            size="m"
            style={{ marginBottom: 20, marginTop: 20 }}
            title="Date of TB clearance certificate"
          />
          <Controller
            name="certificateDate"
            control={control}
            defaultValue={{
              day: tbCertificateData.certificateDate.day,
              month: tbCertificateData.certificateDate.month,
              year: tbCertificateData.certificateDate.year,
            }}
            rules={{
              validate: (value: DateType) => {
                if (isTbClearanceIssued === "Yes") {
                  return validateDate(value, "certificateDate");
                }
                return true;
              },
            }}
            render={({ field: { value, onChange } }) => (
              <DateTextInput
                value={value}
                setDateValue={onChange}
                id={"tb-certificate-date"}
                autocomplete={false}
                hint="For example, 30 3 2024"
                errorMessage={errors?.certificateDate?.message ?? ""}
              />
            )}
          />
        </div>

        <div ref={tbCertificateNumber}>
          <FreeText
            id="tb-certificate-number"
            errorMessage={errors?.certificateNumber?.message ?? ""}
            heading="TB clearance certificate number"
            formValue="certificateNumber"
            patternValue={formRegex.lettersAndNumbers}
            patternError="TB clearance certificate number must contain only letters and numbers"
            defaultValue={tbCertificateData.certificateNumber}
            required={
              isTbClearanceIssued === "Yes" ? "Enter the TB clearance certificate number" : false
            }
          />
        </div>

        <Button
          id="continue"
          type={ButtonType.DEFAULT}
          text="Continue"
          href="/tb-certificate-summary"
          handleClick={() => {}}
        />
      </form>
    </FormProvider>
  );
};

export default TbCertificateDeclarationForm;
