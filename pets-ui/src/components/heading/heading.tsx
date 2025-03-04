export type HeadingSize = "s" | "l" | "m" | "xl";

type HeadingProps = {
  title: string;
  level?: 1 | 2 | 3 | 4;
  size?: HeadingSize;
  style?: React.CSSProperties;
};

const headingTags: { [key: number]: React.ElementType } = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
};

const Heading = ({ title, size, level = 1, style }: HeadingProps) => {
  const Tag = headingTags[level] || "h1";
  const variant = `govuk-heading-${size}`;
  return (
    <Tag className={variant} style={style}>
      {title}
    </Tag>
  );
};

export default Heading;
