import { Link } from "react-router-dom";

type LabelProps = {
  ariaLabel?: string;
  title: string;
  to: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  style?: React.CSSProperties;
  className?: string;
  id?: string;
  hiddenLabel?: string;
};

const LinkLabel = ({
  className = "govuk-link govuk-link--no-visited-state",
  ...props
}: LabelProps) => {
  return (
    <Link
      className={className}
      id={props.id}
      to={props.to}
      aria-label={props.ariaLabel}
      style={props.style}
      onClick={props.onClick}
    >
      {props.title}
      {props.hiddenLabel && <span className="govuk-visually-hidden"> {props.hiddenLabel}</span>}
    </Link>
  );
};

export default LinkLabel;
