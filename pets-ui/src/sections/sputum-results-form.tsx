import { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import Dropdown from "@/components/dropdown/dropdown";
import ErrorSummary from "@/components/errorSummary/errorSummary";
import Heading from "@/components/heading/heading";
import Spinner from "@/components/spinner/spinner";
import SubmitButton from "@/components/submitButton/submitButton";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  selectSputum,
  setSample1CultureResults,
  setSample1SmearResults,
  setSample2CultureResults,
  setSample2SmearResults,
  setSample3CultureResults,
  setSample3SmearResults,
} from "@/redux/sputumSlice";
import { ButtonType, PositiveOrNegative } from "@/utils/enums";
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

  const errorsToShow = Object.keys(errors);

  const resultOptions = [
    { label: "Negative", value: PositiveOrNegative.NEGATIVE },
    { label: "Positive", value: PositiveOrNegative.POSITIVE },
    { label: "Inconclusive", value: PositiveOrNegative.INCONCLUSIVE },
  ];

  const onSubmit: SubmitHandler<SputumResultsFormType> = (formData) => {
    let hasError = false;

    const samplesWithData = [
      {
        sample: "sample1" as const,
        hasData: !!(
          sputumData.sample1.collection.dateOfSample.day &&
          sputumData.sample1.collection.dateOfSample.month &&
          sputumData.sample1.collection.dateOfSample.year
        ),
      },
      {
        sample: "sample2" as const,
        hasData: !!(
          sputumData.sample2.collection.dateOfSample.day &&
          sputumData.sample2.collection.dateOfSample.month &&
          sputumData.sample2.collection.dateOfSample.year
        ),
      },
      {
        sample: "sample3" as const,
        hasData: !!(
          sputumData.sample3.collection.dateOfSample.day &&
          sputumData.sample3.collection.dateOfSample.month &&
          sputumData.sample3.collection.dateOfSample.year
        ),
      },
    ].filter((s) => s.hasData);

    if (samplesWithData.length > 0) {
      const editableSmearResults = samplesWithData
        .filter(({ sample }) => !sputumData[sample].smearResults.submittedToDatabase)
        .map(({ sample }) => {
          const fieldName = `${sample}SmearResult` as keyof SputumResultsFormType;
          const formValue = formData[fieldName]?.toString().trim();
          const initialValue = sputumData[sample].smearResults.smearResult;

          const hasNewEntry =
            formValue &&
            formValue !== "" &&
            (initialValue === PositiveOrNegative.NOT_YET_ENTERED ||
              formValue !== initialValue.toString());

          return hasNewEntry;
        });

      const hasAnyNewSmearResult = editableSmearResults.some((result) => result);

      const editableCultureResults = samplesWithData
        .filter(({ sample }) => !sputumData[sample].cultureResults.submittedToDatabase)
        .map(({ sample }) => {
          const fieldName = `${sample}CultureResult` as keyof SputumResultsFormType;
          const formValue = formData[fieldName]?.toString().trim();
          const initialValue = sputumData[sample].cultureResults.cultureResult;

          const hasNewEntry =
            formValue &&
            formValue !== "" &&
            (initialValue === PositiveOrNegative.NOT_YET_ENTERED ||
              formValue !== initialValue.toString());

          return hasNewEntry;
        });

      const hasAnyNewCultureResult = editableCultureResults.some((result) => result);

      const hasEditableFields = samplesWithData.some(
        ({ sample }) =>
          !sputumData[sample].smearResults.submittedToDatabase ||
          !sputumData[sample].cultureResults.submittedToDatabase,
      );

      if (hasEditableFields && !hasAnyNewSmearResult && !hasAnyNewCultureResult) {
        samplesWithData.forEach(({ sample }) => {
          const smearNotInDb = !sputumData[sample].smearResults.submittedToDatabase;
          const cultureNotInDb = !sputumData[sample].cultureResults.submittedToDatabase;

          if (smearNotInDb) {
            const smearFieldName = `${sample}SmearResult` as keyof SputumResultsFormType;
            const smearValue = formData[smearFieldName]?.toString().trim();

            if (!smearValue || smearValue === "") {
              setError(smearFieldName, {
                type: "manual",
                message: sputumResultsValidationMessages.smearTestRequired,
              });
              hasError = true;
            }
          }

          if (cultureNotInDb) {
            const cultureFieldName = `${sample}CultureResult` as keyof SputumResultsFormType;
            const cultureValue = formData[cultureFieldName]?.toString().trim();

            if (!cultureValue || cultureValue === "") {
              setError(cultureFieldName, {
                type: "manual",
                message: sputumResultsValidationMessages.cultureTestRequired,
              });
              hasError = true;
            }
          }
        });
      }
    }

    if (hasError) {
      return;
    }

    setIsLoading(true);
    try {
      if (formData.sample1SmearResult && !sputumData.sample1.smearResults.submittedToDatabase) {
        dispatch(
          setSample1SmearResults({
            submittedToDatabase: false,
            smearResult: formData.sample1SmearResult as PositiveOrNegative,
          }),
        );
      }
      if (formData.sample1CultureResult && !sputumData.sample1.cultureResults.submittedToDatabase) {
        dispatch(
          setSample1CultureResults({
            submittedToDatabase: false,
            cultureResult: formData.sample1CultureResult as PositiveOrNegative,
          }),
        );
      }
      if (formData.sample2SmearResult && !sputumData.sample2.smearResults.submittedToDatabase) {
        dispatch(
          setSample2SmearResults({
            submittedToDatabase: false,
            smearResult: formData.sample2SmearResult as PositiveOrNegative,
          }),
        );
      }
      if (formData.sample2CultureResult && !sputumData.sample2.cultureResults.submittedToDatabase) {
        dispatch(
          setSample2CultureResults({
            submittedToDatabase: false,
            cultureResult: formData.sample2CultureResult as PositiveOrNegative,
          }),
        );
      }
      if (formData.sample3SmearResult && !sputumData.sample3.smearResults.submittedToDatabase) {
        dispatch(
          setSample3SmearResults({
            submittedToDatabase: false,
            smearResult: formData.sample3SmearResult as PositiveOrNegative,
          }),
        );
      }
      if (formData.sample3CultureResult && !sputumData.sample3.cultureResults.submittedToDatabase) {
        dispatch(
          setSample3CultureResults({
            submittedToDatabase: false,
            cultureResult: formData.sample3CultureResult as PositiveOrNegative,
          }),
        );
      }

      navigate("/check-sputum-sample-information");
    } catch (error) {
      console.error(error);
      navigate("/error");
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
          <div className="govuk-grid-row">
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
          <div className="govuk-grid-row" style={flexRowStyle}>
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
          <div className="govuk-grid-row" style={flexRowStyle}>
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
          <div className="govuk-grid-row" style={flexRowStyle}>
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
          <SubmitButton id="save-and-continue" type={ButtonType.DEFAULT} text="Save and continue" />
        </form>
      </FormProvider>
    </div>
  );
};

export default SputumResultsForm;
