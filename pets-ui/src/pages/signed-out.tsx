import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";
import LinkLabel from "@/components/linkLabel/LinkLabel";

export default function SignedOutPage() {
  return (
    <Container title="You have signed out - Complete UK pre-entry health screening - GOV.UK">
      <Heading level={1} size="l" title="You have signed out" />
      <p className="govuk-body ">You will need to sign in to continue or start a new screening.</p>
      <p>
        <LinkLabel
          key="sign-in"
          className="govuk-link"
          to="/"
          title="Sign in"
          externalLink={false}
        />
      </p>
      <p>
        <LinkLabel
          key="feedback"
          className="govuk-link"
          to="https://forms.office.com/pages/responsepage.aspx?id=mRRO7jVKLkutR188-d6GZtaAaJfrhApCue13O2-oStFUNlIyRkRMWVBNQkszSTJISDJGU1pJTTkxNy4u&route=shorturl"
          title="What did you think of this service? (opens in new tab)"
          externalLink={true}
        />{" "}
        (takes 10 minutes)
      </p>
    </Container>
  );
}
