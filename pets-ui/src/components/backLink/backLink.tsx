import LinkLabel from "../linkLabel/LinkLabel";

export interface BackLinkProps {
  href: string;
}

export default function BackLink(props: Readonly<BackLinkProps>) {
  return (
    <LinkLabel className="govuk-back-link" to={props.href} title="Back" externalLink={false} />
  );
}
