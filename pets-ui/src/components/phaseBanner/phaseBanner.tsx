import LinkLabel from "../linkLabel/LinkLabel";

export default function PhaseBanner() {
  return (
    <div className="govuk-phase-banner">
      <p className="govuk-phase-banner__content">
        <strong className="govuk-tag govuk-phase-banner__content__tag">BETA</strong>
        <span className="govuk-phase-banner__text">
          This is a new service – your{" "}
          <LinkLabel
            to="https://forms.office.com/pages/responsepage.aspx?id=mRRO7jVKLkutR188-d6GZtaAaJfrhApCue13O2-oStFUNlIyRkRMWVBNQkszSTJISDJGU1pJTTkxNy4u&route=shorturl"
            title="feedback"
            externalLink={true}
          />{" "}
          will help us to improve it.
        </span>
      </p>
    </div>
  );
}
