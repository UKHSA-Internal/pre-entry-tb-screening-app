import { useEffect, useRef } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";

import Checkbox from "@/components/checkbox/checkbox";
import ErrorSummary from "@/components/errorSummary/errorSummary";
import Heading from "@/components/heading/heading";
import SubmitButton from "@/components/submitButton/submitButton";
import TextArea from "@/components/textArea/textArea";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setXrayActiveTbFindings,
  setXrayAssociatedMinorFindings,
  setXrayMinorFindings,
  setXrayResultDetail,
} from "@/redux/radiologicalOutcomeSlice";
import { selectRadiologicalOutcome } from "@/redux/store";
import { ReduxRadiologicalOutcomeDetailsType } from "@/types";
import { ButtonType } from "@/utils/enums";

const ChestXrayFindingsForm = () => {
  const radiologicalOutcomeData = useAppSelector(selectRadiologicalOutcome);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const methods = useForm<ReduxRadiologicalOutcomeDetailsType>({
    reValidateMode: "onSubmit",
    defaultValues: {
      xrayResultDetail: radiologicalOutcomeData.xrayResultDetail,
      xrayMinorFindings: radiologicalOutcomeData.xrayMinorFindings,
      xrayAssociatedMinorFindings: radiologicalOutcomeData.xrayAssociatedMinorFindings,
      xrayActiveTbFindings: radiologicalOutcomeData.xrayActiveTbFindings,
    },
  });
  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit: SubmitHandler<ReduxRadiologicalOutcomeDetailsType> = (
    formRadiologicalOutcomeData,
  ) => {
    dispatch(setXrayResultDetail(formRadiologicalOutcomeData.xrayResultDetail));
    dispatch(setXrayMinorFindings(formRadiologicalOutcomeData.xrayMinorFindings));
    dispatch(
      setXrayAssociatedMinorFindings(formRadiologicalOutcomeData.xrayAssociatedMinorFindings),
    );
    dispatch(setXrayActiveTbFindings(formRadiologicalOutcomeData.xrayActiveTbFindings));
    navigate("/radiological-outcome-summary");
  };

  const errorsToShow = Object.keys(errors);

  const location = useLocation();
  const xrayResultDetail = useRef<HTMLDivElement | null>(null);
  const xrayMinorFindings = useRef<HTMLDivElement | null>(null);
  const xrayAssociatedMinorFindings = useRef<HTMLDivElement | null>(null);
  const xrayActiveTbFindings = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (location.hash) {
      const target = location.hash.substring(1);
      const refMap: { [key: string]: HTMLElement | null } = {
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

        <div id="radiographic-findings" className="govuk-form-group">
          <Heading
            level={1}
            size="l"
            style={{ marginBottom: -10, marginTop: 40 }}
            title="Enter X-ray findings"
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
              headingLevel={2}
              headingSize="m"
              hint="Select all that apply"
              required={false}
              sortAnswersAlphabetically={false}
              errorMessage={errors?.xrayMinorFindings?.message ?? ""}
              formValue="xrayMinorFindings"
              divStyle={{ marginTop: 40, marginBottom: 10 }}
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
              headingLevel={2}
              headingSize="m"
              hint="Select all that apply"
              required={false}
              sortAnswersAlphabetically={false}
              errorMessage={errors?.xrayAssociatedMinorFindings?.message ?? ""}
              formValue="xrayAssociatedMinorFindings"
              divStyle={{ marginTop: 40, marginBottom: 10 }}
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
              headingLevel={2}
              headingSize="m"
              hint="Select all that apply"
              required={false}
              sortAnswersAlphabetically={false}
              errorMessage={errors?.xrayActiveTbFindings?.message ?? ""}
              formValue="xrayActiveTbFindings"
              divStyle={{ marginTop: 40, marginBottom: 10 }}
            />
          </div>
        </div>

        <div ref={xrayResultDetail}>
          <TextArea
            id="xray-result-detail"
            hint="Add details if X-ray results are abnormal"
            headingLevel={2}
            headingSize="m"
            heading="Give further details (optional)"
            required={false}
            errorMessage={errors?.xrayResultDetail?.message ?? ""}
            formValue="xrayResultDetail"
            rows={4}
            defaultValue={radiologicalOutcomeData.xrayResultDetail}
          />
        </div>

        <SubmitButton id="save-and-continue" type={ButtonType.DEFAULT} text="Continue" />
      </form>
    </FormProvider>
  );
};

export default ChestXrayFindingsForm;
