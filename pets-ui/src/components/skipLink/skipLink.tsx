interface SkipLinkProps {
  href: string;
}

export default function SkipLink(props: Readonly<SkipLinkProps>) {
  return (
    <a href={props.href} className="govuk-skip-link" data-module="govuk-skip-link">
      Skip to main content
    </a>
  );
}
