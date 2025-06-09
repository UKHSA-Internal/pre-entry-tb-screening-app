import { useRef } from "react";
import { Controller, FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { DateType } from "@/applicant";
import DateTextInput from "@/components/dateTextInput/dateTextInput";
import Dropdown from "@/components/dropdown/dropdown";
import ErrorSummary from "@/components/errorSummary/errorSummary";
import Heading from "@/components/heading/heading";
import SubmitButton from "@/components/submitButton/submitButton";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  selectSputum,
  setSample1Collection,
  setSample2Collection,
  setSample3Collection,
  setSputumStatus,
} from "@/redux/sputumSlice";
import { ApplicationStatus, ButtonType } from "@/utils/enums";
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
  { value: "Coughed up", label: "Coughed up" },
  { value: "Induced", label: "Induced" },
  { value: "Gastric lavage", label: "Gastric lavage" },
  { value: "Not known", label: "Not known" },
];

const SputumCollectionForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const sputumData = useAppSelector(selectSputum);
  const lastClickedButtonId = useRef<string | null>(null);

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

  const onSubmit: SubmitHandler<SputumCollectionFormFields> = (formData) => {
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

    let hasError = false;

    if (submittedBy === "save-progress") {
      const filled1 = isSampleFilled(
        formData.dateOfSputumSample1,
        formData.collectionMethodSample1,
      );
      const filled2 = isSampleFilled(
        formData.dateOfSputumSample2,
        formData.collectionMethodSample2,
      );
      const filled3 = isSampleFilled(
        formData.dateOfSputumSample3,
        formData.collectionMethodSample3,
      );

      if (!filled1 && !filled2 && !filled3) {
        setSampleErrors(1, formData.dateOfSputumSample1, formData.collectionMethodSample1);
        setSampleErrors(2, formData.dateOfSputumSample2, formData.collectionMethodSample2);
        setSampleErrors(3, formData.dateOfSputumSample3, formData.collectionMethodSample3);
      }
    }

    if (submittedBy === "save-and-continue-to-results") {
      const filled1 = isSampleFilled(
        formData.dateOfSputumSample1,
        formData.collectionMethodSample1,
      );
      const filled2 = isSampleFilled(
        formData.dateOfSputumSample2,
        formData.collectionMethodSample2,
      );
      const filled3 = isSampleFilled(
        formData.dateOfSputumSample3,
        formData.collectionMethodSample3,
      );

      if (!filled1) {
        setSampleErrors(1, formData.dateOfSputumSample1, formData.collectionMethodSample1);
      }
      if (!filled2) {
        setSampleErrors(2, formData.dateOfSputumSample2, formData.collectionMethodSample2);
      }
      if (!filled3) {
        setSampleErrors(3, formData.dateOfSputumSample3, formData.collectionMethodSample3);
      }
    }

    if (hasError) {
      return;
    }

    dispatch(setSputumStatus(ApplicationStatus.IN_PROGRESS));

    dispatch(
      setSample1Collection({
        dateOfSample: formData.dateOfSputumSample1,
        collectionMethod: formData.collectionMethodSample1,
        submittedToDatabase: sputumData.sample1.collection.submittedToDatabase,
      }),
    );

    dispatch(
      setSample2Collection({
        dateOfSample: formData.dateOfSputumSample2,
        collectionMethod: formData.collectionMethodSample2,
        submittedToDatabase: sputumData.sample2.collection.submittedToDatabase,
      }),
    );

    dispatch(
      setSample3Collection({
        dateOfSample: formData.dateOfSputumSample3,
        collectionMethod: formData.collectionMethodSample3,
        submittedToDatabase: sputumData.sample3.collection.submittedToDatabase,
      }),
    );

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
        </div>
        <div className="govuk-grid-row" style={{ display: "flex", alignItems: "flex-end" }}>
          <div className="govuk-grid-column-one-half" ref={sample1DateRef}>
            <Controller
              name="dateOfSputumSample1"
              control={control}
              rules={{
                validate: (value: DateType) => {
                  const hasData = value.day || value.month || value.year;
                  const methodValue = getValues("collectionMethodSample1");
                  if (hasData || methodValue) {
                    if (!hasData) {
                      return "Enter the date sample 1 was taken on";
                    }

                    if (hasData && (!value.day || !value.month || !value.year)) {
                      return dateValidationMessages.sputumSampleDate.emptyFieldError.replace(
                        "{sampleNumber}",
                        "1",
                      );
                    }
                    const result = validateDate(value, "sputumSampleDate");
                    if (typeof result === "string") {
                      return result.replace("{sampleNumber}", "1");
                    }
                    return result;
                  }
                  return true;
                },
              }}
              render={({ field: { value, onChange } }) => (
                <DateTextInput
                  hint="For example, 31 3 2024"
                  value={value}
                  setDateValue={onChange}
                  id="date-sample-1-taken"
                  autocomplete={false}
                  errorMessage={errors?.dateOfSputumSample1?.message ?? ""}
                />
              )}
            />
          </div>
          <div className="govuk-grid-column-one-half">
            <Dropdown
              id="collection-method-sample-1"
              label="Collection method"
              options={collectionMethodOptions}
              formValue="collectionMethodSample1"
              errorMessage={errors?.collectionMethodSample1?.message ?? ""}
              required=""
            />
          </div>
        </div>

        <hr
          className="govuk-section-break govuk-section-break--l govuk-section-break--visible"
          style={{ marginTop: 30, marginBottom: 30 }}
        />

        <Heading level={2} size="m" title="Sputum sample 2" style={{ marginBottom: 20 }} />
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-one-half">
            <Heading level={3} size="s" title="Date sample 2 was taken on" />
          </div>
        </div>
        <div className="govuk-grid-row" style={{ display: "flex", alignItems: "flex-end" }}>
          <div className="govuk-grid-column-one-half" ref={sample2DateRef}>
            <Controller
              name="dateOfSputumSample2"
              control={control}
              rules={{
                validate: (value: DateType) => {
                  const hasData = value.day || value.month || value.year;
                  const methodValue = getValues("collectionMethodSample2");
                  if (hasData || methodValue) {
                    if (!hasData) {
                      return "Enter the date sample 2 was taken on";
                    }

                    if (hasData && (!value.day || !value.month || !value.year)) {
                      return dateValidationMessages.sputumSampleDate.emptyFieldError.replace(
                        "{sampleNumber}",
                        "2",
                      );
                    }
                    const result = validateDate(value, "sputumSampleDate");
                    if (typeof result === "string") {
                      return result.replace("{sampleNumber}", "2");
                    }
                    return result;
                  }
                  return true;
                },
              }}
              render={({ field: { value, onChange } }) => (
                <DateTextInput
                  hint="For example, 31 3 2024"
                  value={value}
                  setDateValue={onChange}
                  id="date-sample-2-taken"
                  autocomplete={false}
                  errorMessage={errors?.dateOfSputumSample2?.message ?? ""}
                />
              )}
            />
          </div>
          <div className="govuk-grid-column-one-half">
            <Dropdown
              id="collection-method-sample-2"
              label="Collection method"
              options={collectionMethodOptions}
              formValue="collectionMethodSample2"
              errorMessage={errors?.collectionMethodSample2?.message ?? ""}
              required=""
            />
          </div>
        </div>

        <hr
          className="govuk-section-break govuk-section-break--l govuk-section-break--visible"
          style={{ marginTop: 30, marginBottom: 30 }}
        />

        <Heading level={2} size="m" title="Sputum sample 3" style={{ marginBottom: 20 }} />
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-one-half">
            <Heading level={3} size="s" title="Date sample 3 was taken on" />
          </div>
        </div>
        <div className="govuk-grid-row" style={{ display: "flex", alignItems: "flex-end" }}>
          <div className="govuk-grid-column-one-half" ref={sample3DateRef}>
            <Controller
              name="dateOfSputumSample3"
              control={control}
              rules={{
                validate: (value: DateType) => {
                  const hasData = value.day || value.month || value.year;
                  const methodValue = getValues("collectionMethodSample3");
                  if (hasData || methodValue) {
                    if (!hasData) {
                      return "Enter the date sample 3 was taken on";
                    }

                    if (hasData && (!value.day || !value.month || !value.year)) {
                      return dateValidationMessages.sputumSampleDate.emptyFieldError.replace(
                        "{sampleNumber}",
                        "3",
                      );
                    }
                    const result = validateDate(value, "sputumSampleDate");
                    if (typeof result === "string") {
                      return result.replace("{sampleNumber}", "3");
                    }
                    return result;
                  }
                  return true;
                },
              }}
              render={({ field: { value, onChange } }) => (
                <DateTextInput
                  hint="For example, 31 3 2024"
                  value={value}
                  setDateValue={onChange}
                  id="date-sample-3-taken"
                  autocomplete={false}
                  errorMessage={errors?.dateOfSputumSample3?.message ?? ""}
                />
              )}
            />
          </div>
          <div className="govuk-grid-column-one-half">
            <div style={{ width: "177px" }}>
              <Dropdown
                id="collection-method-sample-3"
                label="Collection method"
                options={collectionMethodOptions}
                formValue="collectionMethodSample3"
                errorMessage={errors?.collectionMethodSample3?.message ?? ""}
                required=""
              />
            </div>
          </div>
        </div>

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
