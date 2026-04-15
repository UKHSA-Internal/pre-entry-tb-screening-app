import { ApplicationStatus, TaskStatus } from "@/utils/enums";

import LinkLabel from "../linkLabel/LinkLabel";

export type SummaryElement = {
  key: string;
  value: string | Array<string> | undefined;
  link?: string;
  hiddenLabel: string;
};

interface SummaryProps {
  taskStatus: TaskStatus;
  applicationStatus: ApplicationStatus;
  summaryElements: SummaryElement[];
  showChangeLinksAfterTaskComplete?: boolean;
}

function summaryValue(summaryElement: SummaryElement) {
  const hasValue = Array.isArray(summaryElement.value)
    ? summaryElement.value.length > 0
    : !!summaryElement.value;

  if (hasValue) {
    if (Array.isArray(summaryElement.value)) {
      return (
        <div className="govuk-summary-value-column">
          <dd className="govuk-summary-list__value">
            {summaryElement.value.map((value, index) => {
              return (
                <p className="govuk-body" key={index + "-" + value}>
                  {value}
                </p>
              );
            })}
          </dd>
        </div>
      );
    } else {
      return <dd className="govuk-summary-list__value">{summaryElement.value}</dd>;
    }
  } else {
    return <dd className="govuk-summary-list__value">Not provided</dd>;
  }
}

export default function Summary(props: Readonly<SummaryProps>) {
  let showChangeLink = undefined;
  if (props.showChangeLinksAfterTaskComplete) {
    showChangeLink =
      props.applicationStatus !== ApplicationStatus.CANCELLED &&
      props.applicationStatus !== ApplicationStatus.CERTIFICATE_NOT_ISSUED;
  } else {
    showChangeLink =
      props.taskStatus !== TaskStatus.COMPLETE &&
      (props.applicationStatus === ApplicationStatus.IN_PROGRESS ||
        props.applicationStatus === ApplicationStatus.NULL);
  }

  return (
    <dl className="govuk-summary-list">
      {props.summaryElements.map((summaryElement) => {
        return (
          <div className="govuk-summary-list__row" key={summaryElement.key}>
            <dt className="govuk-summary-list__key">{summaryElement.key}</dt>
            {summaryValue(summaryElement)}
            {summaryElement.link && summaryElement.link.length > 0 && showChangeLink && (
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
