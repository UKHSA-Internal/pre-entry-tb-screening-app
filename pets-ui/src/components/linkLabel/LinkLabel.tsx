type LabelProps = {
  ariaLabel?: string;
  title: string;
  to: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  style?: React.CSSProperties;
  className?: string;
  id?: string;
};

const LinkLabel = ({
  className = "govuk-link govuk-link--no-visited-state",
  ...props
}: LabelProps) => {
  return (
    <a
      className={className}
      id={props.id}
      href={props.to}
      aria-label={props.ariaLabel}
      style={props.style}
      onClick={props.onClick}
    >
      {props.title}
    </a>
  );
};

export default LinkLabel;
