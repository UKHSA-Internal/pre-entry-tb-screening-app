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
  if (Array.isArray(summaryElement.value)) {
    return (
      <div className="govuk-summary-value-column">
        {summaryElement.value.length > 0
          ? summaryElement.value.map((value) => {
              return (
                <dd className="govuk-summary-list__value" key={value}>
                  {value}
                </dd>
              );
            })
          : status != ApplicationStatus.COMPLETE &&
            summaryElement.link && (
              <LinkLabel
                to={summaryElement.link}
                title={summaryElement.emptyValueText ?? ""}
                hiddenLabel=""
                externalLink={false}
              />
            )}
      </div>
    );
  } else {
    let displayValue: string;
    if (summaryElement.value) {
      displayValue = summaryElement.value;
    } else if (summaryElement.emptyValueText) {
      displayValue = summaryElement.emptyValueText;
    } else {
      displayValue = "";
    }

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
            {(() => {
              const hasValue = Array.isArray(summaryElement.value)
                ? summaryElement.value.length > 0
                : !!summaryElement.value;

              return (
                summaryElement.link &&
                summaryElement.link.length > 0 &&
                hasValue &&
                props.status !== ApplicationStatus.COMPLETE && (
                  <dd className="govuk-summary-list__actions">
                    <LinkLabel
                      to={summaryElement.link}
                      title="Change"
                      hiddenLabel={" " + summaryElement.hiddenLabel}
                      externalLink={false}
                    />
                  </dd>
                )
              );
            })()}
          </div>
        );
      })}
    </dl>
  );
}
