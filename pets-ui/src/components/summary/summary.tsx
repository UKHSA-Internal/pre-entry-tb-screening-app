import { ApplicationStatus } from "@/utils/enums";

import LinkLabel from "../linkLabel/LinkLabel";

export type SummaryElement = {
  key: string;
  value: string | Array<string> | undefined;
  link: string;
  hiddenLabel: string;
};

interface SummaryProps {
  status: ApplicationStatus;
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
            {props.status == ApplicationStatus.INCOMPLETE && (
              <dd className="govuk-summary-list__actions">
                <LinkLabel
                  to={summaryElement.link}
                  title="Change"
                  hiddenLabel={summaryElement.hiddenLabel}
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
