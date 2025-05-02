export type HeadingSize = "s" | "l" | "m" | "xl";

type HeadingProps = {
  title: string;
  level?: 1 | 2 | 3 | 4;
  size?: HeadingSize;
  style?: React.CSSProperties;
  id?: string;
};

const headingTags: { [key: number]: React.ElementType } = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
};

const Heading = ({ level = 1, ...props }: Readonly<HeadingProps>) => {
  const Tag = headingTags[level] || "h1";
  const variant = `govuk-heading-${props.size}`;
  return (
    <Tag className={variant} style={props.style} id={props.id}>
      {props.title}
    </Tag>
  );
};

export default Heading;
