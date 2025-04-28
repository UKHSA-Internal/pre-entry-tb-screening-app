import { useEffect, useRef } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";

import { ReduxChestXrayDetailsType } from "@/applicant";
import ApplicantDataHeader from "@/components/applicantDataHeader/applicantDataHeader";
import Checkbox from "@/components/checkbox/checkbox";
import ErrorSummary from "@/components/errorSummary/errorSummary";
import Heading from "@/components/heading/heading";
import Radio from "@/components/radio/radio";
import SubmitButton from "@/components/submitButton/submitButton";
import TextArea from "@/components/textArea/textArea";
import { selectApplicant } from "@/redux/applicantSlice";
import {
  selectChestXray,
  setXrayActiveTbFindings,
  setXrayAssociatedMinorFindings,
  setXrayMinorFindings,
  setXrayResult,
  setXrayResultDetail,
} from "@/redux/chestXraySlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { ButtonType, RadioIsInline } from "@/utils/enums";
import { toArray } from "@/utils/helpers";

const ChestXrayFindingsForm = () => {
  const applicantData = useAppSelector(selectApplicant);
  const chestXrayData = useAppSelector(selectChestXray);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const methods = useForm<ReduxChestXrayDetailsType>({ reValidateMode: "onSubmit" });
  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit: SubmitHandler<ReduxChestXrayDetailsType> = (formChestXrayData) => {
    dispatch(setXrayResult(formChestXrayData.xrayResult));
    dispatch(setXrayResultDetail(formChestXrayData.xrayResultDetail));
    dispatch(setXrayMinorFindings(toArray(formChestXrayData.xrayMinorFindings)));
    dispatch(
      setXrayAssociatedMinorFindings(toArray(formChestXrayData.xrayAssociatedMinorFindings)),
    );
    dispatch(setXrayActiveTbFindings(toArray(formChestXrayData.xrayActiveTbFindings)));
    navigate("/chest-xray-summary");
  };

  const errorsToShow = Object.keys(errors);

  // Required to scroll to the correct element when a change link on the summary page is clicked
  const location = useLocation();
  const xrayResult = useRef<HTMLDivElement | null>(null);
  const xrayResultDetail = useRef<HTMLDivElement | null>(null);
  const xrayMinorFindings = useRef<HTMLDivElement | null>(null);
  const xrayAssociatedMinorFindings = useRef<HTMLDivElement | null>(null);
  const xrayActiveTbFindings = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (location.hash) {
      const target = location.hash.substring(1);
      const refMap: { [key: string]: HTMLElement | null } = {
        "xray-result": xrayResult.current,
        "xray-result-detail": xrayResultDetail.current,
        "xray-minor-findings": xrayMinorFindings.current,
        "xray-associated-minor-findings": xrayAssociatedMinorFindings.current,
        "xray-active-tb-findings": xrayActiveTbFindings.current,
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
        {!!errorsToShow?.length && <ErrorSummary errorsToShow={errorsToShow} errors={errors} />}

        <ApplicantDataHeader applicantData={applicantData} />

        <div ref={xrayResult}>
          <Radio
            id="xray-result"
            heading="Radiological outcome"
            isInline={RadioIsInline.FALSE}
            answerOptions={["Chest X-ray normal", "Non-TB abnormality", "Old or active TB"]}
            sortAnswersAlphabetically={false}
            errorMessage={errors?.xrayResult?.message ?? ""}
            formValue="xrayResult"
            required="Select radiological outcome"
            defaultValue={chestXrayData.xrayResult}
          />

          <div ref={xrayResultDetail}>
            <TextArea
              id="xray-result-detail"
              hint="Give further details (optional)"
              headingLevel={3}
              headingSize="s"
              heading="Details"
              required={false}
              errorMessage={errors?.xrayResultDetail?.message ?? ""}
              formValue="xrayResultDetail"
              rows={4}
              defaultValue={chestXrayData.xrayResultDetail}
            />
          </div>
        </div>

        <div id="radiographic-findings" className="govuk-form-group">
          <Heading
            level={2}
            size="m"
            style={{ marginBottom: -10, marginTop: 40 }}
            title="Radiographic findings"
          />

          <div ref={xrayMinorFindings}>
            <Checkbox
              id="xray-minor-findings"
              answerOptions={[
                "1.1 Single fibrous streak or band or scar",
                "1.2 Bony islets",
                "2.1 Pleural capping with a smooth inferior border (less than 1cm thick at all points)",
                "2.2 Unilateral or bilateral costophrenic angle blunding (below the horizontal)",
                "2.3 Calcified nodule(s) in the hilum or mediastinum with no pulmonary granulomas",
              ]}
              heading="Minor findings"
              headingLevel={3}
              headingSize="s"
              required={false}
              sortAnswersAlphabetically={false}
              errorMessage={errors?.xrayMinorFindings?.message ?? ""}
              formValue="xrayMinorFindings"
              defaultValue={
                chestXrayData.xrayMinorFindings.length ? chestXrayData.xrayMinorFindings : []
              }
            />
          </div>

          <div ref={xrayAssociatedMinorFindings}>
            <Checkbox
              id="xray-associated-minor-findings"
              answerOptions={[
                "3.1 Solitary granuloma (less than 1cm and of any lobe) with an unremarkable hilum",
                "3.2 Solitary granuloma (less than 1cm and of any lobe) with calcified or enlarged hilar lymph nodes",
                "3.3 Single or multiple calcified pulmonary nodules or micronodulese with distinct borders",
                "3.4 Calcified pleural lesion",
                "3.5 Costophrenic angle blunting (either side above the horizontal)",
              ]}
              heading="Minor findings (occasionally associated with TB infection)"
              headingLevel={3}
              headingSize="s"
              required={false}
              sortAnswersAlphabetically={false}
              errorMessage={errors?.xrayAssociatedMinorFindings?.message ?? ""}
              formValue="xrayAssociatedMinorFindings"
              defaultValue={
                chestXrayData.xrayAssociatedMinorFindings.length
                  ? chestXrayData.xrayAssociatedMinorFindings
                  : []
              }
            />
          </div>

          <div ref={xrayActiveTbFindings}>
            <Checkbox
              id="xray-active-tb-findings"
              answerOptions={[
                "4.0 Notable apical pleural capping (rough or ragged inferior border an/or equal or greater than 1cm thick at any point)",
                "4.1 Apical fibronodular or fibrocalcific lesions or apical microcalcifications",
                "4.2 Single or multiple pulmonary nodules or micronodules (noncalcified or poorly defined)",
                "4.3 Isolated hilar or mediastinal mass or lymphadenopathy (noncalcified)",
                "4.4 Single or multiple pulmonary nodules / masses equal or greater than 1cm",
                "4.5 Non calcified pleural fibrosis or effusion",
                "4.6 Interstitial fibrosis or parenchymal lung disease and or acute pulmonary disease",
                "4.7 Any cavitating lesion or 'fluffy' or 'soft' lesions felt likely to represent active TB",
              ]}
              heading="Findings sometimes seen in active TB (or other conditions)"
              headingLevel={3}
              headingSize="s"
              required={false}
              sortAnswersAlphabetically={false}
              errorMessage={errors?.xrayActiveTbFindings?.message ?? ""}
              formValue="xrayActiveTbFindings"
              defaultValue={
                chestXrayData.xrayActiveTbFindings.length ? chestXrayData.xrayActiveTbFindings : []
              }
            />
          </div>
        </div>

        <SubmitButton id="save-and-continue" type={ButtonType.DEFAULT} text="Save and continue" />
      </form>
    </FormProvider>
  );
};

export default ChestXrayFindingsForm;
