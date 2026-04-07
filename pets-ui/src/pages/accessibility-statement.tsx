import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";
import LinkLabel from "@/components/linkLabel/LinkLabel";
import List from "@/components/list/list";

export default function AccessibilityStatementPage() {
  const backLinkTo = "/";
  return (
    <Container
      title="Accessibility statement - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo={backLinkTo}
    >
      <section className="govuk-!-margin-bottom-6">
        <Heading
          level={1}
          size="xl"
          title="Accessibility statement for Complete UK pre-entry health screening"
        />
        <p className="govuk-body">
          This accessibility statement applies to the Complete UK pre-entry health screening
          service.
        </p>
        <p className="govuk-body">
          This service is run by the UK Health Security Agency (UKHSA). We want as many people as
          possible to be able to use this website. For example, that means you should be able to:
        </p>
        <List
          items={[
            "change colours, contrast levels and fonts using browser or device settings",
            "zoom in up to 400% without the text spilling off the screen",
            "navigate most of the website using a keyboard or speech recognition software",
            "listen to most of the website using a screen reader (including the most recent versions of JAWS, NVDA and VoiceOver)",
          ]}
        />
        <p className="govuk-body">
          We&apos;ve also made the website text as simple as possible to understand.
        </p>
        <p className="govuk-body">
          <LinkLabel
            title="AbilityNet (opens in new tab)"
            to="https://mcmw.abilitynet.org.uk/"
            externalLink
            className="govuk-link"
            openInNewTab
          />{" "}
          has advice on making your device easier to use if you have a disability.
        </p>
      </section>

      <section className="govuk-!-margin-bottom-6">
        <Heading level={2} size="l" title="Feedback and contact information" />
        <p className="govuk-body">
          If you find any problems not listed on this page or believe we&apos;re not meeting
          accessibility requirements, email:{" "}
          <LinkLabel
            className="govuk-link"
            to="mailto:uktbscreeningsupport@ukhsa.gov.uk"
            title="uktbscreeningsupport@ukhsa.gov.uk"
            externalLink
          />
        </p>
      </section>

      <section className="govuk-!-margin-bottom-6">
        <Heading level={2} size="l" title="Enforcement procedure" />
        <p className="govuk-body">
          The Equality and Human Rights Commission (EHRC) is responsible for enforcing the Public
          Sector Bodies (Websites and Mobile Applications) (No. 2) Accessibility Regulations 2018
          (the &apos;accessibility regulations&apos;). If you&apos;re not happy with how we respond
          to your complaint,{" "}
          <LinkLabel
            title="contact the Equality Advisory and Support Service (EASS) (opens in new tab)"
            to="https://www.equalityadvisoryservice.com/"
            externalLink
            className="govuk-link"
            openInNewTab
          />
          .
        </p>
      </section>

      <section className="govuk-!-margin-bottom-6">
        <Heading
          level={2}
          size="l"
          title="Technical information about this website's accessibility"
        />
        <p className="govuk-body">
          UK Health Security Agency (UKHSA) is committed to making its website accessible, in
          accordance with the Public Sector Bodies (Websites and Mobile Applications) (No. 2)
          Accessibility Regulations 2018.
        </p>
      </section>

      <section className="govuk-!-margin-bottom-6">
        <Heading level={3} size="m" title="Compliance status" />
        <p className="govuk-body">
          This website is fully compliant with the{" "}
          <LinkLabel
            title="Web Content Accessibility Guidelines version 2.2 (opens in new tab)"
            to="https://www.w3.org/TR/WCAG22/"
            externalLink
            className="govuk-link"
            openInNewTab
          />{" "}
          AA standard.
        </p>
      </section>

      <section className="govuk-!-margin-bottom-6">
        <Heading level={3} size="m" title="Disproportionate burden" />
        <p className="govuk-body">
          At this time, we have not made any disproportionate burden claims.
        </p>
      </section>

      <section className="govuk-!-margin-bottom-6">
        <Heading level={2} size="l" title="What we're doing to improve accessibility" />
        <p className="govuk-body">
          We are testing our service with users with a variety of accessibility needs. We will keep
          testing our content to understand where we are non-compliant with accessibility standards.
        </p>
      </section>

      <section className="govuk-!-margin-bottom-6">
        <Heading level={2} size="l" title="Preparation of this accessibility statement" />
        <p className="govuk-body">
          This statement was prepared in August 2025. It was last reviewed in April 2026.
        </p>
        <p className="govuk-body">
          This service was last tested in April 2025 against the WCAG 2.2 AA standard.
        </p>
        <p className="govuk-body">
          The test was carried out by the Digital Accessibility Centre. The service was tested using
          automated testing tools by their accessibility technical team.
        </p>
      </section>
    </Container>
  );
}
