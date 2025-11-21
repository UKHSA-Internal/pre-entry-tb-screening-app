interface SummaryListProps {
  keyValuePairList: { key: string; value: string }[];
}
export default function SummaryList(props: Readonly<SummaryListProps>) {
  return (
    <dl className="govuk-summary-list">
      {props.keyValuePairList.map(({ key, value }, index) => (
        <div className="govuk-summary-list__row" key={key + "-" + index}>
          <dt className="govuk-summary-list__key">{key}</dt>
          <dd className="govuk-summary-list__value summary-list-value">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
