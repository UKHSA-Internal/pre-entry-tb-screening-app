import { ApplicationStatus } from "@/utils/enums";

import LinkLabel from "../linkLabel/LinkLabel";

export type SummaryElement = {
  key: string;
  value: string | Array<string> | undefined;
  link?: string;
  hiddenLabel: string;
  emptyValueText?: string;
};

interface SummaryProps {
  status: ApplicationStatus;
  summaryElements: SummaryElement[];
}

function summaryValue(status: ApplicationStatus, summaryElement: SummaryElement) {
  const hasValue = Array.isArray(summaryElement.value)
    ? summaryElement.value.length > 0
    : !!summaryElement.value;

  if (hasValue) {
    if (Array.isArray(summaryElement.value)) {
      return (
        <div className="govuk-summary-value-column">
          {summaryElement.value.map((value) => {
            return (
              <dd className="govuk-summary-list__value" key={value}>
                {value}
              </dd>
            );
          })}
        </div>
      );
    } else {
      return <dd className="govuk-summary-list__value">{summaryElement.value}</dd>;
    }
  } else {
    const displayValue = status === ApplicationStatus.COMPLETE ? "" : "Not provided";
    return <dd className="govuk-summary-list__value">{displayValue}</dd>;
  }
}

export default function Summary(props: Readonly<SummaryProps>) {
  return (
    <dl className="govuk-summary-list">
      {props.summaryElements.map((summaryElement) => {
        return (
          <div className="govuk-summary-list__row" key={summaryElement.key}>
            <dt className="govuk-summary-list__key">{summaryElement.key}</dt>
            {summaryValue(props.status, summaryElement)}
            {summaryElement.link &&
              summaryElement.link.length > 0 &&
              props.status !== ApplicationStatus.COMPLETE && (
                <dd className="govuk-summary-list__actions">
                  <LinkLabel
                    to={summaryElement.link}
                    title="Change"
                    hiddenLabel={" " + summaryElement.hiddenLabel}
                    externalLink={false}
                  />
                </dd>
              )}
          </div>
        );
      })}
    </dl>
  );
}
