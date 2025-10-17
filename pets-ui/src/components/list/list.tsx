type ListItem =
  | string
  | {
      key: string;
      elem: React.ReactNode;
    };

interface ListProps {
  items: ListItem[];
  style?: React.CSSProperties;
}

export default function List({ items, style }: Readonly<ListProps>) {
  return (
    <ul className="govuk-body" style={style}>
      {items.map((item) => {
        if (typeof item === "string") {
          return <li key={item}>{item}</li>;
        } else {
          return <li key={item.key}>{item.elem}</li>;
        }
      })}
    </ul>
  );
}
