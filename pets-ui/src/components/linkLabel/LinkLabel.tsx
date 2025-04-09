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
  externalLink?: boolean;
};

// excludes internal page navigations (e.g. error summary, skip to main content)
const LinkLabel = ({
  className = "govuk-link govuk-link--no-visited-state",
  externalLink = false,
  ...props
}: LabelProps) => {
  return externalLink ? (
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
  ) : (
    <Link
      className={className}
      id={props.id}
      to={props.to}
      aria-label={props.ariaLabel}
      style={props.style}
      onClick={props.onClick}
    >
      {props.title}
      {props.hiddenLabel && <span className="govuk-visually-hidden">{props.hiddenLabel}</span>}
    </Link>
  );
};

export default LinkLabel;
