import { useRef } from "react";
import {
  Control,
  Controller,
  FieldErrors,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { useNavigate } from "react-router-dom";

import DateTextInput from "@/components/dateTextInput/dateTextInput";
import Dropdown from "@/components/dropdown/dropdown";
import ErrorSummary from "@/components/errorSummary/errorSummary";
import Heading from "@/components/heading/heading";
import SubmitButton from "@/components/submitButton/submitButton";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setSample1Collection,
  setSample2Collection,
  setSample3Collection,
  setSputumStatus,
} from "@/redux/sputumSlice";
import { selectSputum } from "@/redux/store";
import { DateType } from "@/types";
import { ApplicationStatus, ButtonType, SputumCollectionMethod } from "@/utils/enums";
import { validateDate } from "@/utils/helpers";
import { dateValidationMessages } from "@/utils/records";

interface SputumCollectionFormFields {
  dateOfSputumSample1: DateType;
  collectionMethodSample1: string;
  dateOfSputumSample2: DateType;
  collectionMethodSample2: string;
  dateOfSputumSample3: DateType;
  collectionMethodSample3: string;
}

const collectionMethodOptions = [
  { value: SputumCollectionMethod.COUGHED_UP, label: SputumCollectionMethod.COUGHED_UP },
  { value: SputumCollectionMethod.INDUCED, label: SputumCollectionMethod.INDUCED },
  { value: SputumCollectionMethod.GASTRIC_LAVAGE, label: SputumCollectionMethod.GASTRIC_LAVAGE },
  { value: SputumCollectionMethod.NOT_KNOWN, label: SputumCollectionMethod.NOT_KNOWN },
];

const SputumCollectionForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const sputumData = useAppSelector(selectSputum);
  const lastClickedButtonId = useRef<string | null>(null);

  const renderSampleEditableForm = (
    sampleNumber: 1 | 2 | 3,
    control: Control<SputumCollectionFormFields>,
    errors: FieldErrors<SputumCollectionFormFields>,
  ) => {
    const dateFieldName = `dateOfSputumSample${sampleNumber}` as keyof SputumCollectionFormFields;
    const methodFieldName =
      `collectionMethodSample${sampleNumber}` as keyof SputumCollectionFormFields;

    return (
      <div className="govuk-grid-row" style={{ display: "flex", alignItems: "flex-end" }}>
        <div className="govuk-grid-column-one-half">
          <Controller
            name={dateFieldName}
            control={control}
            rules={{}}
            render={({ field: { value, onChange } }) => (
              <DateTextInput
                hint="For example, 31 3 2024"
                value={
                  typeof value === "object" && value !== null
                    ? value
                    : { day: "", month: "", year: "" }
                }
                setDateValue={onChange}
                id={`date-sample-${sampleNumber}-taken`}
                autocomplete={false}
                errorMessage={
                  (errors as Record<string, { message?: string }>)?.[dateFieldName]?.message ?? ""
                }
              />
            )}
          />
        </div>
        <div className="govuk-grid-column-one-half">
          <div>
            <Dropdown
              id={`collection-method-sample-${sampleNumber}`}
              label=""
              options={collectionMethodOptions}
              formValue={methodFieldName}
              errorMessage={
                (errors as Record<string, { message?: string }>)?.[methodFieldName]?.message ?? ""
              }
              required=""
              placeholder="Select"
            />
          </div>
        </div>
      </div>
    );
  };

  const methods = useForm<SputumCollectionFormFields>({
    reValidateMode: "onSubmit",
    defaultValues: {
      dateOfSputumSample1: sputumData.sample1.collection.dateOfSample || {
        day: "",
        month: "",
        year: "",
      },
      collectionMethodSample1: sputumData.sample1.collection.collectionMethod || "",
      dateOfSputumSample2: sputumData.sample2.collection.dateOfSample || {
        day: "",
        month: "",
        year: "",
      },
      collectionMethodSample2: sputumData.sample2.collection.collectionMethod || "",
      dateOfSputumSample3: sputumData.sample3.collection.dateOfSample || {
        day: "",
        month: "",
        year: "",
      },
      collectionMethodSample3: sputumData.sample3.collection.collectionMethod || "",
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit: SubmitHandler<SputumCollectionFormFields> = (formData) => {
    const submittedBy = lastClickedButtonId.current;
    lastClickedButtonId.current = null;

    let hasError = false;
    if (submittedBy === "save-progress" || submittedBy === "save-and-continue-to-results") {
      const isAnySampleFilled = Object.values(formData).some((field) => {
        if (typeof field === "string") {
          return field.trim() !== "";
        }
        if (typeof field === "object" && field !== null) {
          const date = field as DateType;
          return date.day || date.month || date.year;
        }
        return false;
      });

      if (isAnySampleFilled) {
        [1, 2, 3].forEach((sampleNumber) => {
          const dateFieldName =
            `dateOfSputumSample${sampleNumber}` as keyof SputumCollectionFormFields;
          const methodFieldName =
            `collectionMethodSample${sampleNumber}` as keyof SputumCollectionFormFields;
          const date = formData[dateFieldName] as DateType;
          const method = formData[methodFieldName] as string;

          const hasDate = date.day || date.month || date.year;

          if (!hasDate) {
            methods.setError(dateFieldName, {
              type: "manual",
              message: `Enter the date sample ${sampleNumber} was taken on`,
            });
            hasError = true;
          } else if (!date.day || !date.month || !date.year) {
            methods.setError(dateFieldName, {
              type: "manual",
              message: dateValidationMessages.sputumSampleDate.emptyFieldError.replace(
                "{sampleNumber}",
                sampleNumber.toString(),
              ),
            });
            hasError = true;
          } else {
            const result = validateDate(date, "sputumSampleDate");
            if (typeof result === "string") {
              methods.setError(dateFieldName, {
                type: "manual",
                message: result.replace("{sampleNumber}", sampleNumber.toString()),
              });
              hasError = true;
            }
          }

          if (!method) {
            methods.setError(methodFieldName, {
              type: "manual",
              message: `Enter Sputum sample ${sampleNumber} collection method`,
            });
            hasError = true;
          }
        });
      } else {
        [1, 2, 3].forEach((sampleNumber) => {
          methods.setError(
            `dateOfSputumSample${sampleNumber}` as keyof SputumCollectionFormFields,
            {
              type: "manual",
              message: `Enter the date sample ${sampleNumber} was taken on`,
            },
          );
          methods.setError(
            `collectionMethodSample${sampleNumber}` as keyof SputumCollectionFormFields,
            {
              type: "manual",
              message: `Enter Sputum sample ${sampleNumber} collection method`,
            },
          );
        });
        hasError = true;
      }
    }

    if (hasError) {
      return;
    }

    dispatch(setSputumStatus(ApplicationStatus.IN_PROGRESS));

    const sampleKeys = ["sample1", "sample2", "sample3"] as const;
    const dispatchActions = [setSample1Collection, setSample2Collection, setSample3Collection];

    sampleKeys.forEach((_, index) => {
      const formDateField = `dateOfSputumSample${index + 1}` as keyof SputumCollectionFormFields;
      const formMethodField =
        `collectionMethodSample${index + 1}` as keyof SputumCollectionFormFields;

      const dateValue = formData[formDateField] as DateType;
      const methodValue = formData[formMethodField] as string;

      if (dateValue.day && dateValue.month && dateValue.year && methodValue) {
        dispatch(
          dispatchActions[index]({
            dateOfSample: dateValue,
            collectionMethod: methodValue,
            submittedToDatabase: false,
          }),
        );
      }
    });

    if (submittedBy === "save-progress") {
      navigate("/check-sputum-collection-details-results");
    } else if (submittedBy === "save-and-continue-to-results") {
      navigate("/enter-sputum-sample-results");
    }
  };

  const errorsToShow = Object.keys(errors);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {!!errorsToShow?.length && <ErrorSummary errorsToShow={errorsToShow} errors={errors} />}

        <Heading level={1} size="l" title="Enter sputum sample collection information" />

        <Heading
          level={2}
          size="m"
          title="Sputum sample 1"
          style={{ marginTop: 40, marginBottom: 20 }}
        />
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-one-half">
            <Heading level={3} size="s" title="Date sample 1 was taken on" />
          </div>
          <div className="govuk-grid-column-one-half">
            <Heading level={3} size="s" title="Collection method" />
          </div>
        </div>
        {renderSampleEditableForm(1, control, errors)}

        <hr
          className="govuk-section-break govuk-section-break--l govuk-section-break--visible"
          style={{ marginTop: 30, marginBottom: 30 }}
        />

        <Heading level={2} size="m" title="Sputum sample 2" style={{ marginBottom: 20 }} />
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-one-half">
            <Heading level={3} size="s" title="Date sample 2 was taken on" />
          </div>
          <div className="govuk-grid-column-one-half">
            <Heading level={3} size="s" title="Collection method" />
          </div>
        </div>
        {renderSampleEditableForm(2, control, errors)}

        <hr
          className="govuk-section-break govuk-section-break--l govuk-section-break--visible"
          style={{ marginTop: 30, marginBottom: 30 }}
        />

        <Heading level={2} size="m" title="Sputum sample 3" style={{ marginBottom: 20 }} />
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-one-half">
            <Heading level={3} size="s" title="Date sample 3 was taken on" />
          </div>
          <div className="govuk-grid-column-one-half">
            <Heading level={3} size="s" title="Collection method" />
          </div>
        </div>
        {renderSampleEditableForm(3, control, errors)}

        <div style={{ marginTop: 40, display: "flex", gap: "20px" }}>
          <button
            type="button"
            onMouseDown={() => (lastClickedButtonId.current = "save-and-continue-to-results")}
            aria-label="Save and continue to results"
            style={{ border: "none", background: "none", padding: 0, cursor: "pointer" }}
          >
            <SubmitButton
              id="save-and-continue-to-results"
              type={ButtonType.DEFAULT}
              text="Save and continue to results"
            />
          </button>
          <button
            type="button"
            onMouseDown={() => (lastClickedButtonId.current = "save-progress")}
            aria-label="Save progress"
            style={{ border: "none", background: "none", padding: 0, cursor: "pointer" }}
          >
            <SubmitButton id="save-progress" type={ButtonType.SECONDARY} text="Save progress" />
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default SputumCollectionForm;
