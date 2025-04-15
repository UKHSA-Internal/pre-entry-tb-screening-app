import "./skipLink.scss";

import LinkLabel from "../linkLabel/LinkLabel";

export default function SkipLink() {
  return (
    <LinkLabel
      to="#main-content"
      className="govuk-skip-link"
      dataModule="govuk-skip-link"
      title="Skip to main content"
      externalLink
    />
  );
}
