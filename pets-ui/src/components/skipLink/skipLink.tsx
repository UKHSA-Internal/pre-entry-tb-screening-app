import LinkLabel from "../linkLabel/LinkLabel";

export default function SkipLink() {
  return (
    <LinkLabel
      title="Skip to main content"
      to="#main-content"
      className="govuk-skip-link"
      data-module="govuk-skip-link"
    />
  );
}
