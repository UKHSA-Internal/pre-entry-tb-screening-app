import LinkLabel from "../linkLabel/LinkLabel";

interface BetaProps {
  feedbackUrl?: string;
}

const Beta = ({ feedbackUrl = "/feedback" }: Readonly<BetaProps>) => {
  const isExternalLink = feedbackUrl.startsWith("http") || feedbackUrl.startsWith("mailto");

  return (
    <div className="govuk-phase-banner">
      <p className="govuk-phase-banner__content">
        <strong className="govuk-tag govuk-phase-banner__content__tag">BETA</strong>
        <span className="govuk-phase-banner__text">
          This is a new service – your{" "}
          <LinkLabel to={feedbackUrl} title="feedback" externalLink={isExternalLink} /> will help us
          to improve it.
        </span>
      </p>
    </div>
  );
};

export default Beta;
