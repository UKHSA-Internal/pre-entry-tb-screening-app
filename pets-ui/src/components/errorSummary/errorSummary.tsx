import { FieldErrors } from "react-hook-form";

import { attributeToComponentId } from "@/utils/helpers";

interface ErrorSummaryProps {
  errorsToShow: string[];
  errors: FieldErrors;
}

export default function ErrorSummary(props: Readonly<ErrorSummaryProps>) {
  const setErrorSummaryRef = (element: HTMLDivElement | null) => {
    if (element && props.errorsToShow.length > 0) {
      setTimeout(() => element.focus(), 0);
    }
  };

  return (
    <div
      className="govuk-error-summary"
      data-module="govuk-error-summary"
      aria-labelledby="error-summary-title"
      tabIndex={-1}
      ref={setErrorSummaryRef}
    >
      <div role="alert">
        <h2 className="govuk-error-summary__title">There is a problem</h2>
        <div className="govuk-error-summary__body">
          <ul className="govuk-list govuk-error-summary__list">
            {props.errorsToShow.map((error) => (
              <li
                key={attributeToComponentId[error]}
                aria-label={`Error: ${props.errors[error]?.message as string}`}
              >
                <a href={"#" + attributeToComponentId[error]}>
                  {props.errors[error]?.message as string}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
