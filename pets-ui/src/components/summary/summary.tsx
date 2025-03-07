import { Link } from "react-router-dom";

export type SummaryElement = {
  key: string;
  value: string | Array<string> | null;
  link: string;
  hiddenLabel: string;
};

interface SummaryProps {
  summaryElements: SummaryElement[];
}

export default function Summary(props: Readonly<SummaryProps>) {
  return (
    <dl className="govuk-summary-list">
      {props.summaryElements.map((summaryElement) => {
        return (
          <div className="govuk-summary-list__row" key={summaryElement.key}>
            <dt className="govuk-summary-list__key">{summaryElement.key}</dt>
            {Array.isArray(summaryElement.value) ? (
              <div className="govuk-summary-value-column">
                {summaryElement.value.map((value) => {
                  return (
                    <dd className="govuk-summary-list__value" key={value}>
                      {value}
                    </dd>
                  );
                })}
              </div>
            ) : (
              <dd className="govuk-summary-list__value">{summaryElement.value}</dd>
            )}
            <dd className="govuk-summary-list__actions">
              <Link className="govuk-link" style={{ color: "#1d70b8" }} to={summaryElement.link}>
                Change<span className="govuk-visually-hidden">{summaryElement.hiddenLabel}</span>
              </Link>
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
