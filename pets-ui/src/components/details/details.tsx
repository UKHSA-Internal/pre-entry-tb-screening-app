interface DetailsProps {
  summary: string;
  details: string | React.JSX.Element;
}

export default function Details(props: Readonly<DetailsProps>) {
  return (
    <details className="govuk-details">
      <summary className="govuk-details__summary">
        <span className="govuk-details__summary-text">{props.summary}</span>
      </summary>
      <div className="govuk-details__text">{props.details}</div>
    </details>
  );
}
