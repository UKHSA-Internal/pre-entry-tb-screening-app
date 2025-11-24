import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import Dropdown from "@/components/dropdown/dropdown";
import ErrorSummary from "@/components/errorSummary/errorSummary";
import Heading from "@/components/heading/heading";
import Spinner from "@/components/spinner/spinner";
import SubmitButton from "@/components/submitButton/submitButton";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setSample1CultureResults,
  setSample1SmearResults,
  setSample2CultureResults,
  setSample2SmearResults,
  setSample3CultureResults,
  setSample3SmearResults,
} from "@/redux/sputumSlice";
import { selectSputum } from "@/redux/store";
import { ButtonClass, PositiveOrNegative } from "@/utils/enums";
import { sendGoogleAnalyticsFormErrorEvent } from "@/utils/google-analytics-utils";
import { formatDateForDisplay } from "@/utils/helpers";
import { sputumResultsValidationMessages } from "@/utils/records";

interface SputumResultsFormType {
  sample1SmearResult: PositiveOrNegative | string;
  sample1CultureResult: PositiveOrNegative | string;
  sample2SmearResult: PositiveOrNegative | string;
  sample2CultureResult: PositiveOrNegative | string;
  sample3SmearResult: PositiveOrNegative | string;
  sample3CultureResult: PositiveOrNegative | string;
}

const SputumResultsForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const sputumData = useAppSelector(selectSputum);
  const [isLoading, setIsLoading] = useState(false);

  const selectStyle: React.CSSProperties = {
    minWidth: "auto",
    width: "100%",
    height: "35px",
    padding: "2px 8px",
  };

  const disabledSelectStyle: React.CSSProperties = {
    ...selectStyle,
    backgroundColor: "#f3f2f1",
    color: "#626a6e",
    cursor: "not-allowed",
  };

  const formStyle: React.CSSProperties = {
    maxWidth: "540px",
    margin: "0",
  };

  const headingStyle: React.CSSProperties = {
    marginBottom: "70px",
  };

  const tableHeadersStyle: React.CSSProperties = {
    marginBottom: "0px",
  };

  const columnCenterStyle: React.CSSProperties = {
    textAlign: "center",
  };

  const flexRowStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "flex-end",
    marginBottom: "2px",
  };

  const flexCenterStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
  };

  const dropdownContainerStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: "150px",
  };

  const dropdownDivStyle: React.CSSProperties = {
    minWidth: "auto",
    width: "100%",
    marginBottom: "10px",
  };

  const hrStyle: React.CSSProperties = {
    marginTop: "2px",
    marginBottom: "2px",
  };

  const hrFirstStyle: React.CSSProperties = {
    marginTop: "5px",
    marginBottom: "10px",
  };

  const hrLastStyle: React.CSSProperties = {
    marginTop: "2px",
    marginBottom: "15px",
  };

  const methods = useForm<SputumResultsFormType>({
    reValidateMode: "onSubmit",
    defaultValues: {
      sample1SmearResult:
        sputumData.sample1.smearResults.smearResult !== PositiveOrNegative.NOT_YET_ENTERED
          ? sputumData.sample1.smearResults.smearResult
          : "",
      sample1CultureResult:
        sputumData.sample1.cultureResults.cultureResult !== PositiveOrNegative.NOT_YET_ENTERED
          ? sputumData.sample1.cultureResults.cultureResult
          : "",
      sample2SmearResult:
        sputumData.sample2.smearResults.smearResult !== PositiveOrNegative.NOT_YET_ENTERED
          ? sputumData.sample2.smearResults.smearResult
          : "",
      sample2CultureResult:
        sputumData.sample2.cultureResults.cultureResult !== PositiveOrNegative.NOT_YET_ENTERED
          ? sputumData.sample2.cultureResults.cultureResult
          : "",
      sample3SmearResult:
        sputumData.sample3.smearResults.smearResult !== PositiveOrNegative.NOT_YET_ENTERED
          ? sputumData.sample3.smearResults.smearResult
          : "",
      sample3CultureResult:
        sputumData.sample3.cultureResults.cultureResult !== PositiveOrNegative.NOT_YET_ENTERED
          ? sputumData.sample3.cultureResults.cultureResult
          : "",
    },
  });

  const {
    handleSubmit,
    setError,
    formState: { errors },
  } = methods;

  type SampleKey = "sample1" | "sample2" | "sample3";
  const sampleKeys: SampleKey[] = ["sample1", "sample2", "sample3"];

  const getSamplesWithData = (): SampleKey[] =>
    sampleKeys.filter((sample) => {
      const { day, month, year } = sputumData[sample].collection.dateOfSample;
      return day && month && year;
    });

  const getValidationStats = (
    samples: SampleKey[],
    formData: SputumResultsFormType,
  ): {
    hasEditableFields: boolean;
    hasAnySmearResult: boolean;
    hasAnyCultureResult: boolean;
  } => {
    let hasEditableFields = false;
    let hasAnySmearResult = false;
    let hasAnyCultureResult = false;

    samples.forEach((sample) => {
      const smearResults = sputumData[sample].smearResults;
      const cultureResults = sputumData[sample].cultureResults;

      if (!smearResults.submittedToDatabase || !cultureResults.submittedToDatabase) {
        hasEditableFields = true;
      }

      if (smearResults.submittedToDatabase) {
        hasAnySmearResult = true;
      } else {
        const smearField = `${sample}SmearResult` as keyof SputumResultsFormType;
        const formValue = formData[smearField]?.toString().trim();
        const initialValue = smearResults.smearResult;

        if (
          (formValue && formValue !== "") ||
          initialValue !== PositiveOrNegative.NOT_YET_ENTERED
        ) {
          hasAnySmearResult = true;
        }
      }

      if (cultureResults.submittedToDatabase) {
        hasAnyCultureResult = true;
      } else {
        const cultureField = `${sample}CultureResult` as keyof SputumResultsFormType;
        const formValue = formData[cultureField]?.toString().trim();
        const initialValue = cultureResults.cultureResult;

        if (
          (formValue && formValue !== "") ||
          initialValue !== PositiveOrNegative.NOT_YET_ENTERED
        ) {
          hasAnyCultureResult = true;
        }
      }
    });

    return { hasEditableFields, hasAnySmearResult, hasAnyCultureResult };
  };

  const applyRequiredFieldErrors = (samples: SampleKey[]): boolean => {
    let foundError = false;

    samples.forEach((sample) => {
      const smearNotInDb = !sputumData[sample].smearResults.submittedToDatabase;
      const cultureNotInDb = !sputumData[sample].cultureResults.submittedToDatabase;

      if (smearNotInDb) {
        const smearField = `${sample}SmearResult` as keyof SputumResultsFormType;
        setError(smearField, {
          type: "manual",
          message: sputumResultsValidationMessages.smearTestRequired,
        });
        foundError = true;
      }

      if (cultureNotInDb) {
        const cultureField = `${sample}CultureResult` as keyof SputumResultsFormType;
        setError(cultureField, {
          type: "manual",
          message: sputumResultsValidationMessages.cultureTestRequired,
        });
        foundError = true;
      }
    });

    return foundError;
  };

  const errorsToShow = Object.keys(errors);
  useEffect(() => {
    if (errorsToShow.length > 0) {
      sendGoogleAnalyticsFormErrorEvent("Enter sputum sample results", errorsToShow);
    }
  }, [errorsToShow]);

  const resultOptions = [
    { label: "Negative", value: PositiveOrNegative.NEGATIVE },
    { label: "Positive", value: PositiveOrNegative.POSITIVE },
    { label: "Inconclusive", value: PositiveOrNegative.INCONCLUSIVE },
  ];

  const persistResultsToStore = (formData: SputumResultsFormType) => {
    type SampleKey = "sample1" | "sample2" | "sample3";
    type SmearActionCreator =
      | typeof setSample1SmearResults
      | typeof setSample2SmearResults
      | typeof setSample3SmearResults;

    type CultureActionCreator =
      | typeof setSample1CultureResults
      | typeof setSample2CultureResults
      | typeof setSample3CultureResults;

    type ResultConfig = {
      sample: SampleKey;
      smearField: keyof SputumResultsFormType;
      cultureField: keyof SputumResultsFormType;
      smearAction: SmearActionCreator;
      cultureAction: CultureActionCreator;
    };

    const resultConfigs: ResultConfig[] = [
      {
        sample: "sample1",
        smearField: "sample1SmearResult",
        cultureField: "sample1CultureResult",
        smearAction: setSample1SmearResults,
        cultureAction: setSample1CultureResults,
      },
      {
        sample: "sample2",
        smearField: "sample2SmearResult",
        cultureField: "sample2CultureResult",
        smearAction: setSample2SmearResults,
        cultureAction: setSample2CultureResults,
      },
      {
        sample: "sample3",
        smearField: "sample3SmearResult",
        cultureField: "sample3CultureResult",
        smearAction: setSample3SmearResults,
        cultureAction: setSample3CultureResults,
      },
    ];

    resultConfigs.forEach(({ sample, smearField, cultureField, smearAction, cultureAction }) => {
      const sampleData = sputumData[sample];

      if (formData[smearField] && !sampleData.smearResults.submittedToDatabase) {
        dispatch(
          smearAction({
            submittedToDatabase: false,
            smearResult: formData[smearField] as PositiveOrNegative,
          }),
        );
      }

      if (formData[cultureField] && !sampleData.cultureResults.submittedToDatabase) {
        dispatch(
          cultureAction({
            submittedToDatabase: false,
            cultureResult: formData[cultureField] as PositiveOrNegative,
          }),
        );
      }
    });
  };

  const onSubmit: SubmitHandler<SputumResultsFormType> = (formData) => {
    const samplesWithData = getSamplesWithData();

    if (samplesWithData.length > 0) {
      const { hasEditableFields, hasAnySmearResult, hasAnyCultureResult } = getValidationStats(
        samplesWithData,
        formData,
      );

      if (!hasAnySmearResult && !hasAnyCultureResult && hasEditableFields) {
        if (applyRequiredFieldErrors(samplesWithData)) {
          return;
        }
      }
    }

    setIsLoading(true);
    try {
      persistResultsToStore(formData);
      navigate("/check-sputum-collection-details-results");
    } catch (error) {
      console.error(error);
      navigate("/sorry-there-is-problem-with-service");
    } finally {
      setIsLoading(false);
    }
  };
  const getSampleDate = (sample: "sample1" | "sample2" | "sample3"): string => {
    const sampleData = sputumData[sample];
    const hasDate =
      sampleData.collection.dateOfSample.day &&
      sampleData.collection.dateOfSample.month &&
      sampleData.collection.dateOfSample.year;

    return hasDate ? formatDateForDisplay(sampleData.collection.dateOfSample) : "No date recorded";
  };

  return (
    <div>
      {isLoading && <Spinner />}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} style={formStyle}>
          {!!errorsToShow?.length && <ErrorSummary errorsToShow={errorsToShow} errors={errors} />}{" "}
          <Heading level={1} size="l" title="Enter sputum sample results" style={headingStyle} />
          <div className="govuk-grid-row govuk-body" style={tableHeadersStyle}>
            <div className="govuk-grid-column-one-third">
              <strong>Sample</strong>
            </div>
            <div className="govuk-grid-column-one-third" style={columnCenterStyle}>
              <strong>Smear result</strong>
            </div>
            <div className="govuk-grid-column-one-third" style={columnCenterStyle}>
              <strong>Culture result</strong>
            </div>
          </div>
          <hr
            className="govuk-section-break govuk-section-break--m govuk-section-break--visible"
            style={hrFirstStyle}
          />
          <div className="govuk-grid-row govuk-body" style={flexRowStyle}>
            <div className="govuk-grid-column-one-third">
              <span>{getSampleDate("sample1")}</span>
            </div>
            <div className="govuk-grid-column-one-third" style={flexCenterStyle}>
              <div style={dropdownContainerStyle}>
                <Dropdown
                  id="sample1-smear-result"
                  options={resultOptions}
                  errorMessage={errors?.sample1SmearResult?.message ?? ""}
                  formValue="sample1SmearResult"
                  required={false}
                  label=""
                  divStyle={dropdownDivStyle}
                  selectStyle={
                    sputumData.sample1.smearResults.submittedToDatabase
                      ? disabledSelectStyle
                      : selectStyle
                  }
                  disabled={sputumData.sample1.smearResults.submittedToDatabase}
                  placeholder="Select"
                />
              </div>
            </div>
            <div className="govuk-grid-column-one-third" style={flexCenterStyle}>
              <div style={dropdownContainerStyle}>
                <Dropdown
                  id="sample1-culture-result"
                  options={resultOptions}
                  errorMessage={errors?.sample1CultureResult?.message ?? ""}
                  formValue="sample1CultureResult"
                  required={false}
                  label=""
                  divStyle={dropdownDivStyle}
                  selectStyle={
                    sputumData.sample1.cultureResults.submittedToDatabase
                      ? disabledSelectStyle
                      : selectStyle
                  }
                  disabled={sputumData.sample1.cultureResults.submittedToDatabase}
                  placeholder="Select"
                />
              </div>
            </div>
          </div>
          <hr
            className="govuk-section-break govuk-section-break--m govuk-section-break--visible"
            style={hrStyle}
          />
          <div className="govuk-grid-row govuk-body" style={flexRowStyle}>
            <div className="govuk-grid-column-one-third">
              <span>{getSampleDate("sample2")}</span>
            </div>
            <div className="govuk-grid-column-one-third" style={flexCenterStyle}>
              <div style={dropdownContainerStyle}>
                <Dropdown
                  id="sample2-smear-result"
                  options={resultOptions}
                  errorMessage={errors?.sample2SmearResult?.message ?? ""}
                  formValue="sample2SmearResult"
                  required={false}
                  label=""
                  divStyle={dropdownDivStyle}
                  selectStyle={
                    sputumData.sample2.smearResults.submittedToDatabase
                      ? disabledSelectStyle
                      : selectStyle
                  }
                  disabled={sputumData.sample2.smearResults.submittedToDatabase}
                  placeholder="Select"
                />
              </div>
            </div>
            <div className="govuk-grid-column-one-third" style={flexCenterStyle}>
              <div style={dropdownContainerStyle}>
                <Dropdown
                  id="sample2-culture-result"
                  options={resultOptions}
                  errorMessage={errors?.sample2CultureResult?.message ?? ""}
                  formValue="sample2CultureResult"
                  required={false}
                  label=""
                  divStyle={dropdownDivStyle}
                  selectStyle={
                    sputumData.sample2.cultureResults.submittedToDatabase
                      ? disabledSelectStyle
                      : selectStyle
                  }
                  disabled={sputumData.sample2.cultureResults.submittedToDatabase}
                  placeholder="Select"
                />
              </div>
            </div>
          </div>
          <hr
            className="govuk-section-break govuk-section-break--m govuk-section-break--visible"
            style={hrStyle}
          />
          <div className="govuk-grid-row govuk-body" style={flexRowStyle}>
            <div className="govuk-grid-column-one-third">
              <span>{getSampleDate("sample3")}</span>
            </div>
            <div className="govuk-grid-column-one-third" style={flexCenterStyle}>
              <div style={dropdownContainerStyle}>
                <Dropdown
                  id="sample3-smear-result"
                  options={resultOptions}
                  errorMessage={errors?.sample3SmearResult?.message ?? ""}
                  formValue="sample3SmearResult"
                  required={false}
                  label=""
                  divStyle={dropdownDivStyle}
                  selectStyle={
                    sputumData.sample3.smearResults.submittedToDatabase
                      ? disabledSelectStyle
                      : selectStyle
                  }
                  disabled={sputumData.sample3.smearResults.submittedToDatabase}
                  placeholder="Select"
                />
              </div>
            </div>
            <div className="govuk-grid-column-one-third" style={flexCenterStyle}>
              <div style={dropdownContainerStyle}>
                <Dropdown
                  id="sample3-culture-result"
                  options={resultOptions}
                  errorMessage={errors?.sample3CultureResult?.message ?? ""}
                  formValue="sample3CultureResult"
                  required={false}
                  label=""
                  divStyle={dropdownDivStyle}
                  selectStyle={
                    sputumData.sample3.cultureResults.submittedToDatabase
                      ? disabledSelectStyle
                      : selectStyle
                  }
                  disabled={sputumData.sample3.cultureResults.submittedToDatabase}
                  placeholder="Select"
                />
              </div>
            </div>
          </div>
          <hr
            className="govuk-section-break govuk-section-break--m govuk-section-break--visible"
            style={hrLastStyle}
          />
          <SubmitButton
            id="save-and-continue"
            class={ButtonClass.DEFAULT}
            text="Save and continue"
          />
        </form>
      </FormProvider>
    </div>
  );
};

export default SputumResultsForm;
