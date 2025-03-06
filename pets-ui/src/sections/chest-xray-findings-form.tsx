import { useEffect, useRef } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";

import { ReduxChestXrayDetailsType } from "@/applicant";
import ApplicantDataHeader from "@/components/applicantDataHeader/applicantDataHeader";
import Button from "@/components/button/button";
import Checkbox from "@/components/checkbox/checkbox";
import ErrorDisplay from "@/components/errorSummary/errorSummary";
import Heading from "@/components/heading/heading";
import Radio from "@/components/radio/radio";
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

  const updateReduxStore = () => {
    dispatch(setXrayResult(chestXrayData.xrayResult));
    dispatch(setXrayResultDetail(chestXrayData.xrayResultDetail));
    dispatch(setXrayMinorFindings(chestXrayData.xrayMinorFindings));
    dispatch(setXrayAssociatedMinorFindings(chestXrayData.xrayAssociatedMinorFindings));
    dispatch(setXrayActiveTbFindings(chestXrayData.xrayActiveTbFindings));
  };

  const onSubmit: SubmitHandler<ReduxChestXrayDetailsType> = () => {
    updateReduxStore();
    navigate("/chest-xray-summary");
  };

  const errorsToShow = Object.keys(errors);

  // Required to scroll to the correct element when a change link on the summary page is clicked
  const location = useLocation();
  const xrayResult = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (location.hash) {
      const target = location.hash.substring(1);
      const refMap: { [key: string]: HTMLElement | null } = {
        "xray-result": xrayResult.current,
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

        <div ref={xrayResult}>
          <Heading
            level={3}
            size="m"
            style={{ marginBottom: 20, marginTop: 40 }}
            title="X-ray result"
          />
          <Radio
            id="xray-result"
            isInline={RadioIsInline.FALSE}
            answerOptions={["Chest X-ray normal", "Non-TB abnormality", "Old or active TB"]}
            sortAnswersAlphabetically={false}
            errorMessage={errors?.xrayResult?.message ?? ""}
            formValue="xrayResult"
            required="Select an X-ray result."
            defaultValue={chestXrayData.xrayResult}
          />
        </div>

        <Heading level={4} size="s" style={{ marginBottom: 20, marginTop: 40 }} title="Details" />
        <TextArea
          id="xray-result-detail"
          label="Add details if X-ray results are abnormal"
          required={false}
          errorMessage={errors?.xrayResultDetail?.message ?? ""}
          formValue="xrayResultDetail"
          rows={4}
          defaultValue={chestXrayData.xrayResultDetail}
        />

        <Heading
          level={2}
          size="l"
          style={{ marginBottom: 20, marginTop: 40 }}
          title="X-ray findings"
        />

        <Heading
          level={3}
          size="m"
          style={{ marginBottom: 20, marginTop: 40 }}
          title="Minor findings"
        />
        <Checkbox
          id="xray-minor-findings"
          answerOptions={[
            "1.1 Single fibrous streak or band or scar",
            "1.2 Bony islets",
            "2.1 Pleural capping with a smooth inferior border (less than 1cm thick at all points)",
            "2.2 Unilateral or bilateral costophrenic angle blunding (below the horizontal)",
            "2.3 Calcified nodule(s) in the hilum or mediastinum with no pulmonary granulomas",
          ]}
          required={false}
          sortAnswersAlphabetically={false}
          errorMessage={errors?.xrayMinorFindings?.message ?? ""}
          formValue="xrayMinorFindings"
          defaultValue={chestXrayData.xrayMinorFindings}
        />

        <Heading
          size="m"
          level={3}
          title="Minor findings (occasionally associated with TB infection)"
          style={{ marginBottom: 20, marginTop: 40 }}
        />
        <Checkbox
          id="xray-associated-minor-findings"
          answerOptions={[
            "3.1 Solitary granuloma (less than 1cm and of any lobe) with an unremarkable hilum",
            "3.2 Solitary granuloma (less than 1cm and of any lobe) with calcified or enlarged hilar lymph nodes",
            "3.3 Single or multiple calcified pulmonary nodules or micronodulese with distinct borders",
            "3.4 Calcified pleural lesion",
            "3.5 Costophrenic angle blunting (either side above the horizontal)",
          ]}
          required={false}
          sortAnswersAlphabetically={false}
          errorMessage={errors?.xrayAssociatedMinorFindings?.message ?? ""}
          formValue="xrayAssociatedMinorFindings"
          defaultValue={chestXrayData.xrayAssociatedMinorFindings}
        />

        <Heading
          level={3}
          size="m"
          title="Findings sometimes seen in active TB (or other conditions)"
          style={{ marginBottom: 20, marginTop: 40 }}
        />
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
          required={false}
          sortAnswersAlphabetically={false}
          errorMessage={errors?.xrayActiveTbFindings?.message ?? ""}
          formValue="xrayActiveTbFindings"
          defaultValue={chestXrayData.xrayActiveTbFindings}
        />

        <Button
          id="save-and-continue"
          type={ButtonType.DEFAULT}
          text="Save and continue"
          href="/chest-xray-summary"
          handleClick={() => {}}
        />
      </form>
    </FormProvider>
  );
};

export default ChestXrayFindingsForm;
