import { useRef } from "react";
import {
  Control,
  Controller,
  FieldErrors,
  FormProvider,
  SubmitHandler,
  useForm,
  UseFormGetValues,
} from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { postSputumDetails } from "@/api/api";
import { DateType } from "@/applicant";
import DateTextInput from "@/components/dateTextInput/dateTextInput";
import Dropdown from "@/components/dropdown/dropdown";
import ErrorSummary from "@/components/errorSummary/errorSummary";
import Heading from "@/components/heading/heading";
import SubmitButton from "@/components/submitButton/submitButton";
import { selectApplication } from "@/redux/applicationSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  selectSputum,
  setSample1Collection,
  setSample2Collection,
  setSample3Collection,
  setSputumStatus,
  setSputumVersion,
} from "@/redux/sputumSlice";
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
  const applicationData = useAppSelector(selectApplication);
  const lastClickedButtonId = useRef<string | null>(null);

  const renderSampleReadOnlyDisplay = (sampleNumber: 1 | 2 | 3) => {
    const sample = sputumData[`sample${sampleNumber}`];
    return (
      <>
        <div className="govuk-grid-row" style={{ display: "flex", alignItems: "flex-end" }}>
          <div className="govuk-grid-column-one-half">
            <div style={{ opacity: 0.6, pointerEvents: "none" }}>
              <DateTextInput
                hint="For example, 31 3 2024"
                value={sample.collection.dateOfSample}
                setDateValue={() => {}}
                id={`date-sample-${sampleNumber}-taken`}
                autocomplete={false}
                errorMessage=""
              />
            </div>
          </div>
          <div className="govuk-grid-column-one-half">
            <div
              style={
                sampleNumber === 3
                  ? { width: "177px", opacity: 0.6, marginTop: "-70px" }
                  : { opacity: 0.6, marginTop: "-70px" }
              }
            >
              <select
                id={`collection-method-sample-${sampleNumber}-readonly`}
                className="govuk-select"
                disabled
                value={sample.collection.collectionMethod}
                title="Collection method (read-only)"
                aria-label="Collection method (read-only)"
                style={{ backgroundColor: "#f3f2f1", cursor: "not-allowed" }}
              >
                <option value={sample.collection.collectionMethod}>
                  {sample.collection.collectionMethod}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-one-half">
            <p className="govuk-body-s" style={{ color: "#505a5f", margin: "5px 0 0 0" }}>
              (Already submitted - cannot be changed)
            </p>
          </div>
          <div className="govuk-grid-column-one-half">
            <p className="govuk-body-s" style={{ color: "#505a5f", margin: "5px 0 0 0" }}>
              (Already submitted - cannot be changed)
            </p>
          </div>
        </div>
      </>
    );
  };

  const renderSampleEditableForm = (
    sampleNumber: 1 | 2 | 3,
    sampleRef: React.RefObject<HTMLDivElement>,
    control: Control<SputumCollectionFormFields>,
    errors: FieldErrors<SputumCollectionFormFields>,
    getValues: UseFormGetValues<SputumCollectionFormFields>,
  ) => {
    const dateFieldName = `dateOfSputumSample${sampleNumber}` as keyof SputumCollectionFormFields;
    const methodFieldName =
      `collectionMethodSample${sampleNumber}` as keyof SputumCollectionFormFields;

    return (
      <div className="govuk-grid-row" style={{ display: "flex", alignItems: "flex-end" }}>
        <div className="govuk-grid-column-one-half" ref={sampleRef}>
          <Controller
            name={dateFieldName}
            control={control}
            rules={{
              validate: (value: string | DateType) => {
                if (typeof value !== "object" || value === null) {
                  return true;
                }
                const hasData = value.day || value.month || value.year;
                const methodValue = getValues(methodFieldName);
                if (hasData || methodValue) {
                  if (!hasData) {
                    return `Enter the date sample ${sampleNumber} was taken on`;
                  }

                  if (hasData && (!value.day || !value.month || !value.year)) {
                    return dateValidationMessages.sputumSampleDate.emptyFieldError.replace(
                      "{sampleNumber}",
                      sampleNumber.toString(),
                    );
                  }
                  const result = validateDate(value, "sputumSampleDate");
                  if (typeof result === "string") {
                    return result.replace("{sampleNumber}", sampleNumber.toString());
                  }
                  return result;
                }
                return true;
              },
            }}
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
          <div style={sampleNumber === 3 ? { width: "177px" } : {}}>
            <Dropdown
              id={`collection-method-sample-${sampleNumber}`}
              label=""
              options={collectionMethodOptions}
              formValue={methodFieldName}
              errorMessage={
                (errors as Record<string, { message?: string }>)?.[methodFieldName]?.message ?? ""
              }
              required=""
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
    getValues,
  } = methods;

  const onSubmit: SubmitHandler<SputumCollectionFormFields> = async (formData) => {
    const submittedBy = lastClickedButtonId.current;
    lastClickedButtonId.current = null;

    const isSampleFilled = (date: DateType, method: string) => {
      const hasDate = date.day && date.month && date.year;
      return hasDate && !!method;
    };

    const setSampleErrors = (sampleNumber: number, date: DateType, method: string) => {
      if (!date.day || !date.month || !date.year) {
        methods.setError(`dateOfSputumSample${sampleNumber}` as keyof SputumCollectionFormFields, {
          type: "manual",
          message: `Enter the date sample ${sampleNumber} was taken on`,
        });
        hasError = true;
      }
      if (!method) {
        methods.setError(
          `collectionMethodSample${sampleNumber}` as keyof SputumCollectionFormFields,
          {
            type: "manual",
            message: "Select if collection method was coughed up, etc.",
          },
        );
        hasError = true;
      }
    };

    const isSampleFilledOrSubmitted = (sampleNumber: 1 | 2 | 3) => {
      const sample = sputumData[`sample${sampleNumber}`];
      const formDate = formData[`dateOfSputumSample${sampleNumber}`];
      const formMethod = formData[`collectionMethodSample${sampleNumber}`];

      return sample.collection.submittedToDatabase || isSampleFilled(formDate, formMethod);
    };

    const validateSample = (sampleNumber: 1 | 2 | 3) => {
      const sample = sputumData[`sample${sampleNumber}`];
      const formDate = formData[`dateOfSputumSample${sampleNumber}`];
      const formMethod = formData[`collectionMethodSample${sampleNumber}`];

      if (!sample.collection.submittedToDatabase && !isSampleFilled(formDate, formMethod)) {
        setSampleErrors(sampleNumber, formDate, formMethod);
      }
    };

    let hasError = false;

    if (submittedBy === "save-progress") {
      const filled1 = isSampleFilledOrSubmitted(1);
      const filled2 = isSampleFilledOrSubmitted(2);
      const filled3 = isSampleFilledOrSubmitted(3);

      if (!filled1 && !filled2 && !filled3) {
        validateSample(1);
        validateSample(2);
        validateSample(3);
      }
    }

    if (submittedBy === "save-and-continue-to-results") {
      validateSample(1);
      validateSample(2);
      validateSample(3);
    }

    if (hasError) {
      return;
    }

    dispatch(setSputumStatus(ApplicationStatus.IN_PROGRESS));

    const sputumSamples: Record<
      string,
      { dateOfSample: string; collectionMethod: string; dateUpdated: string }
    > = {};

    const formatDate = (date: DateType) =>
      `${date.year}-${date.month.padStart(2, "0")}-${date.day.padStart(2, "0")}`;

    const sampleKeys = ["sample1", "sample2", "sample3"] as const;
    const dispatchActions = [setSample1Collection, setSample2Collection, setSample3Collection];

    sampleKeys.forEach((sampleKey, index) => {
      const sampleData = sputumData[sampleKey];
      const formDateField = `dateOfSputumSample${index + 1}` as keyof SputumCollectionFormFields;
      const formMethodField =
        `collectionMethodSample${index + 1}` as keyof SputumCollectionFormFields;

      const dateValue = formData[formDateField] as DateType;
      const methodValue = formData[formMethodField] as string;

      if (!sampleData.collection.submittedToDatabase && isSampleFilled(dateValue, methodValue)) {
        sputumSamples[sampleKey] = {
          dateOfSample: formatDate(dateValue),
          collectionMethod: methodValue,
          dateUpdated: new Date().toISOString().split("T")[0],
        };
      }
    });

    if (Object.keys(sputumSamples).length > 0) {
      try {
        console.info("Attempting to save sputum details:", {
          applicationId: applicationData.applicationId,
          sputumSamples,
          version: sputumData.version,
        });
        const response = await postSputumDetails(
          applicationData.applicationId,
          sputumSamples,
          sputumData.version,
        );

        if (response.data.version !== undefined) {
          dispatch(setSputumVersion(response.data.version));
        }

        sampleKeys.forEach((sampleKey, index) => {
          if (sputumSamples[sampleKey]) {
            const formDateField =
              `dateOfSputumSample${index + 1}` as keyof SputumCollectionFormFields;
            const formMethodField =
              `collectionMethodSample${index + 1}` as keyof SputumCollectionFormFields;

            dispatch(
              dispatchActions[index]({
                dateOfSample: formData[formDateField] as DateType,
                collectionMethod: formData[formMethodField] as string,
                submittedToDatabase: true,
              }),
            );
          }
        });
      } catch (error: unknown) {
        console.error("Error saving sputum details:", error);

        if (error && typeof error === "object" && "response" in error) {
          const axiosError = error as { response?: { status?: number; data?: unknown } };
          if (axiosError.response?.status === 403) {
            console.error("Authentication error: The request was forbidden. This might be due to:");
            console.error("1. Invalid or expired authentication token");
            console.error("2. Insufficient permissions for the sputum-details endpoint");
            console.error("3. Backend authentication configuration issue");
            console.error("Response data:", axiosError.response?.data);
          }
        }

        return;
      }
    } else {
      if (!sputumData.sample1.collection.submittedToDatabase) {
        dispatch(
          setSample1Collection({
            dateOfSample: formData.dateOfSputumSample1,
            collectionMethod: formData.collectionMethodSample1,
            submittedToDatabase: false,
          }),
        );
      }

      if (!sputumData.sample2.collection.submittedToDatabase) {
        dispatch(
          setSample2Collection({
            dateOfSample: formData.dateOfSputumSample2,
            collectionMethod: formData.collectionMethodSample2,
            submittedToDatabase: false,
          }),
        );
      }

      if (!sputumData.sample3.collection.submittedToDatabase) {
        dispatch(
          setSample3Collection({
            dateOfSample: formData.dateOfSputumSample3,
            collectionMethod: formData.collectionMethodSample3,
            submittedToDatabase: false,
          }),
        );
      }
    }

    if (submittedBy === "save-progress") {
      navigate("/check-sputum-sample-information");
    } else if (submittedBy === "save-and-continue-to-results") {
      navigate("/enter-sputum-sample-results");
    }
  };

  const errorsToShow = Object.keys(errors);

  const sample1DateRef = useRef<HTMLDivElement | null>(null);
  const sample2DateRef = useRef<HTMLDivElement | null>(null);
  const sample3DateRef = useRef<HTMLDivElement | null>(null);

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
        {sputumData.sample1.collection.submittedToDatabase
          ? renderSampleReadOnlyDisplay(1)
          : renderSampleEditableForm(1, sample1DateRef, control, errors, getValues)}

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
        {sputumData.sample2.collection.submittedToDatabase
          ? renderSampleReadOnlyDisplay(2)
          : renderSampleEditableForm(2, sample2DateRef, control, errors, getValues)}

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
        {sputumData.sample3.collection.submittedToDatabase
          ? renderSampleReadOnlyDisplay(3)
          : renderSampleEditableForm(3, sample3DateRef, control, errors, getValues)}

        <div style={{ marginTop: 40, display: "flex", gap: "20px" }}>
          <div onClick={() => (lastClickedButtonId.current = "save-and-continue-to-results")}>
            <SubmitButton
              id="save-and-continue-to-results"
              type={ButtonType.DEFAULT}
              text="Save and continue to results"
            />
          </div>
          <div onClick={() => (lastClickedButtonId.current = "save-progress")}>
            <SubmitButton id="save-progress" type={ButtonType.SECONDARY} text="Save progress" />
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default SputumCollectionForm;
