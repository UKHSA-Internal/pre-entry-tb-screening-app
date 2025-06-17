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
    formState: { errors },
  } = methods;

  const errorsToShow = Object.keys(errors);

  const resultOptions = [
    { label: "Negative", value: PositiveOrNegative.NEGATIVE },
    { label: "Positive", value: PositiveOrNegative.POSITIVE },
    { label: "Inconclusive", value: PositiveOrNegative.INCONCLUSIVE },
  ];

  const onSubmit: SubmitHandler<SputumResultsFormType> = (formData) => {
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
      <style>
        {`
          #sample1-smear-result .govuk-select,
          #sample1-culture-result .govuk-select,
          #sample2-smear-result .govuk-select,
          #sample2-culture-result .govuk-select,
          #sample3-smear-result .govuk-select,
          #sample3-culture-result .govuk-select {
            min-width: auto !important;
            width: 100% !important;
            height: 35px !important;
            padding: 2px 8px !important;
          }
         
          #sample1-smear-result .govuk-select:disabled,
          #sample1-culture-result .govuk-select:disabled,
          #sample2-smear-result .govuk-select:disabled,
          #sample2-culture-result .govuk-select:disabled,
          #sample3-smear-result .govuk-select:disabled,
          #sample3-culture-result .govuk-select:disabled {
            background-color: #f3f2f1 !important;
            color: #626a6e !important;
            cursor: not-allowed !important;
          }
         
          #sample1-smear-result .govuk-select option[disabled],
          #sample1-culture-result .govuk-select option[disabled],
          #sample2-smear-result .govuk-select option[disabled],
          #sample2-culture-result .govuk-select option[disabled],
          #sample3-smear-result .govuk-select option[disabled],
          #sample3-culture-result .govuk-select option[disabled] {
            font-size: 0 !important;
          }
         
          #sample1-smear-result .govuk-select option[disabled]:before,
          #sample1-culture-result .govuk-select option[disabled]:before,
          #sample2-smear-result .govuk-select option[disabled]:before,
          #sample2-culture-result .govuk-select option[disabled]:before,
          #sample3-smear-result .govuk-select option[disabled]:before,
          #sample3-culture-result .govuk-select option[disabled]:before {
            content: "Select";
            font-size: 14px;
          }
         
          .govuk-grid-row {
            min-height: auto !important;
            margin-bottom: 2px !important;
          }
        `}
      </style>
      {isLoading && <Spinner />}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: "540px", margin: "0" }}>
          {!!errorsToShow?.length && <ErrorSummary errorsToShow={errorsToShow} errors={errors} />}{" "}
          <Heading
            level={1}
            size="l"
            title="Enter sputum sample results"
            style={{ marginBottom: "70px" }}
          />
          <div className="govuk-grid-row">
            <div className="govuk-grid-column-one-third">
              <strong>Sample</strong>
            </div>
            <div className="govuk-grid-column-one-third" style={{ textAlign: "center" }}>
              <strong>Smear result</strong>
            </div>
            <div className="govuk-grid-column-one-third" style={{ textAlign: "center" }}>
              <strong>Culture result</strong>
            </div>
          </div>
          <hr
            className="govuk-section-break govuk-section-break--m govuk-section-break--visible"
            style={{ marginTop: "5px", marginBottom: "10px" }}
          />
          <div
            className="govuk-grid-row"
            style={{ display: "flex", alignItems: "flex-end", marginBottom: "2px" }}
          >
            <div className="govuk-grid-column-one-third">
              <span>{getSampleDate("sample1")}</span>
            </div>
            <div
              className="govuk-grid-column-one-third"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <div style={{ width: "100%", maxWidth: "150px" }}>
                <Dropdown
                  id="sample1-smear-result"
                  options={resultOptions}
                  errorMessage={errors?.sample1SmearResult?.message ?? ""}
                  formValue="sample1SmearResult"
                  required={false}
                  label=""
                  divStyle={{ minWidth: "auto", width: "100%", marginBottom: "10px" }}
                  disabled={sputumData.sample1.smearResults.submittedToDatabase}
                  placeholder="Select"
                />
              </div>
            </div>
            <div
              className="govuk-grid-column-one-third"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <div style={{ width: "100%", maxWidth: "150px" }}>
                <Dropdown
                  id="sample1-culture-result"
                  options={resultOptions}
                  errorMessage={errors?.sample1CultureResult?.message ?? ""}
                  formValue="sample1CultureResult"
                  required={false}
                  label=""
                  divStyle={{ minWidth: "auto", width: "100%", marginBottom: "10px" }}
                  disabled={sputumData.sample1.cultureResults.submittedToDatabase}
                  placeholder="Select"
                />
              </div>
            </div>
          </div>
          <hr
            className="govuk-section-break govuk-section-break--m govuk-section-break--visible"
            style={{ marginTop: "2px", marginBottom: "2px" }}
          />
          <div
            className="govuk-grid-row"
            style={{ display: "flex", alignItems: "flex-end", marginBottom: "2px" }}
          >
            <div className="govuk-grid-column-one-third">
              <span>{getSampleDate("sample2")}</span>
            </div>
            <div
              className="govuk-grid-column-one-third"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <div style={{ width: "100%", maxWidth: "150px" }}>
                <Dropdown
                  id="sample2-smear-result"
                  options={resultOptions}
                  errorMessage={errors?.sample2SmearResult?.message ?? ""}
                  formValue="sample2SmearResult"
                  required={false}
                  label=""
                  divStyle={{ minWidth: "auto", width: "100%", marginBottom: "10px" }}
                  disabled={sputumData.sample2.smearResults.submittedToDatabase}
                  placeholder="Select"
                />
              </div>
            </div>
            <div
              className="govuk-grid-column-one-third"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <div style={{ width: "100%", maxWidth: "150px" }}>
                <Dropdown
                  id="sample2-culture-result"
                  options={resultOptions}
                  errorMessage={errors?.sample2CultureResult?.message ?? ""}
                  formValue="sample2CultureResult"
                  required={false}
                  label=""
                  divStyle={{ minWidth: "auto", width: "100%", marginBottom: "10px" }}
                  disabled={sputumData.sample2.cultureResults.submittedToDatabase}
                  placeholder="Select"
                />
              </div>
            </div>
          </div>
          <hr
            className="govuk-section-break govuk-section-break--m govuk-section-break--visible"
            style={{ marginTop: "2px", marginBottom: "2px" }}
          />
          <div
            className="govuk-grid-row"
            style={{ display: "flex", alignItems: "flex-end", marginBottom: "2px" }}
          >
            <div className="govuk-grid-column-one-third">
              <span>{getSampleDate("sample3")}</span>
            </div>
            <div
              className="govuk-grid-column-one-third"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <div style={{ width: "100%", maxWidth: "150px" }}>
                <Dropdown
                  id="sample3-smear-result"
                  options={resultOptions}
                  errorMessage={errors?.sample3SmearResult?.message ?? ""}
                  formValue="sample3SmearResult"
                  required={false}
                  label=""
                  divStyle={{ minWidth: "auto", width: "100%", marginBottom: "10px" }}
                  disabled={sputumData.sample3.smearResults.submittedToDatabase}
                  placeholder="Select"
                />
              </div>
            </div>
            <div
              className="govuk-grid-column-one-third"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <div style={{ width: "100%", maxWidth: "150px" }}>
                <Dropdown
                  id="sample3-culture-result"
                  options={resultOptions}
                  errorMessage={errors?.sample3CultureResult?.message ?? ""}
                  formValue="sample3CultureResult"
                  required={false}
                  label=""
                  divStyle={{ minWidth: "auto", width: "100%", marginBottom: "10px" }}
                  disabled={sputumData.sample3.cultureResults.submittedToDatabase}
                  placeholder="Select"
                />
              </div>
            </div>
          </div>
          <hr
            className="govuk-section-break govuk-section-break--m govuk-section-break--visible"
            style={{ marginTop: "2px", marginBottom: "15px" }}
          />
          <SubmitButton id="save-and-continue" type={ButtonType.DEFAULT} text="Save and continue" />
        </form>
      </FormProvider>
    </div>
  );
};

export default SputumResultsForm;
