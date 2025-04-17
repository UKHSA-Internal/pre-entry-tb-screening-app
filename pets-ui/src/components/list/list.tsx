interface ListProps {
  items: string[];
  style?: React.CSSProperties;
}

export default function List({ items, style }: Readonly<ListProps>) {
  return (
    <ul className="govuk-body" style={style}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
