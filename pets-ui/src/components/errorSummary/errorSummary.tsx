import { FieldErrors } from "react-hook-form";

import { attributeToComponentId } from "@/utils/helpers";

interface ErrorDisplayProps {
  errorsToShow: string[];
  errors: FieldErrors;
}

export default function ErrorSummary(props: Readonly<ErrorDisplayProps>) {
  return (
    <div className="govuk-error-summary" data-module="govuk-error-summary">
      <div role="alert">
        <h2 className="govuk-error-summary__title">There is a problem</h2>
        <div className="govuk-error-summary__body">
          <ul className="govuk-list govuk-error-summary__list">
            {props.errorsToShow.map((error) => (
              <li key={attributeToComponentId[error]}>
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
