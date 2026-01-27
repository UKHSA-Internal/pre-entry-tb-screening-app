import { useRef } from "react";
import { FieldErrors } from "react-hook-form";

import { attributeToComponentId } from "@/utils/records";

interface ErrorSummaryProps {
  errorsToShow: string[];
  errors: FieldErrors;
}

export default function ErrorSummary(props: Readonly<ErrorSummaryProps>) {
  const hasFocusedRef = useRef(false);

  const setErrorSummaryRef = (element: HTMLDivElement | null) => {
    if (element && !hasFocusedRef.current && props.errorsToShow.length > 0) {
      hasFocusedRef.current = true;
      setTimeout(() => element.focus(), 0);
    }
  };

  const handleFocus = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();

    const target = document.getElementById(id);
    if (target) {
      const inputElement = target.querySelector("input, select, textarea, button") as HTMLElement;

      inputElement.focus();
      inputElement.setAttribute("tabIndex", "-1");
    }
  };

  return (
    <div
      className="govuk-error-summary"
      data-module="govuk-error-summary"
      tabIndex={-1}
      ref={setErrorSummaryRef}
      data-testid="error-summary"
    >
      <div role="alert">
        <h2 className="govuk-error-summary__title">There is a problem</h2>
        <div className="govuk-error-summary__body">
          <ul className="govuk-list govuk-error-summary__list">
            {props.errorsToShow.map((error) => {
              const fieldId = attributeToComponentId[error];
              return (
                <li key={fieldId}>
                  <a
                    href={"#" + fieldId}
                    aria-label={`Error: ${props.errors[error]?.message as string}`}
                    onClick={(e) => handleFocus(e, fieldId)}
                  >
                    {props.errors[error]?.message as string}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
