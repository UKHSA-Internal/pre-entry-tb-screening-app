type ListProps = {
  items: string[];
  style?: React.CSSProperties;
};

export default function List({ items, style }: ListProps) {
  return (
    <ul className="govuk-body" style={style}>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}
