interface ListProps {
  items: React.ReactNode[];
  style?: React.CSSProperties;
}

export default function List({ items, style }: Readonly<ListProps>) {
  return (
    <ul className="govuk-body" style={style}>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}
