type LabelProps = {
  ariaLabel?: string;
  title: string;
  to: string;
  isDeepLink?: boolean;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  style?: React.CSSProperties;
  className?: string;
  lang?: string;
  id?: string;
};

const LinkLabel = ({
  title,
  to,
  isDeepLink,
  onClick,
  style,
  lang,
  ariaLabel,
  className = "govuk-link govuk-link--no-visited-state",
  id,
}: LabelProps) => {
  return (
    <a
      className={className}
      id={id}
      href={to}
      aria-label={ariaLabel}
      style={style}
      onClick={onClick}
      target={isDeepLink ? "_blank" : undefined}
      rel={isDeepLink ? "noopener noreferrer" : undefined}
      lang={lang}
    >
      {title}
    </a>
  );
};

export default LinkLabel;
