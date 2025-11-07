import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";
import LinkLabel from "@/components/linkLabel/LinkLabel";
import List from "@/components/list/list";

export default function PrivacyNoticePage() {
  const backLinkTo = "/";
  return (
    <Container
      title="Privacy notice - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo={backLinkTo}
    >
      <section className="govuk-!-margin-bottom-6">
        <Heading
          level={1}
          size="xl"
          title="Privacy notice for Complete UK pre-entry health screening"
        />
        <Heading level={2} size="l" title="About UKHSA" />
        <p className="govuk-body">
          On 1 October 2021, the UK Health Security Agency (UKHSA) came into being. An executive
          agency of the Department of Health and Social Care (DHSC), UKHSA combines many of the
          health protection activities previously undertaken by Public Health England (PHE),
          together with all of the activities of the NHS Test and Trace Programme and the Joint
          Biosecurity Centre (JBC).
        </p>
        <p className="govuk-body">
          The processing activities previously undertaken by these organisations and their
          associated data processors have not changed with the establishment of UKHSA. Individual
          rights are not affected by this change.
        </p>
        <p className="govuk-body">
          We are responsible for planning, preventing and responding to external health threats, and
          providing intellectual, scientific and operational leadership at national and local level,
          as well as internationally. UKHSA will ensure the nation can respond quickly and at
          greater scale to deal with pandemics and future threats.{" "}
        </p>
        <p className="govuk-body">
          We collect and use personal information to fulfil our remit from the government.
        </p>
        <p className="govuk-body">
          UKHSA&apos;s responsibilities include providing the Complete UK pre-entry health screening
          service. Read about UKHSA&apos;s responsibilities in the{" "}
          <LinkLabel
            title="UKHSA strategic plan 2023 to 2026 (opens in new tab)"
            to="https://www.gov.uk/government/publications/ukhsa-strategic-plan-2023-to-2026"
            externalLink
            className="govuk-link"
            openInNewTab
          />
          .
        </p>
        <p className="govuk-body">
          The purpose of the Complete UK pre-entry health screening service is to support the UK
          visa application process and monitor the effectiveness of pulmonary tuberculosis (TB)
          screening by overseas clinics. It does this by recording the personal and medical
          information of visa applicants throughout the screening process.
        </p>
        <p className="govuk-body">
          This privacy notice explains what personal information we collect, use and may share for
          Complete UK pre-entry health screening. It explains what your rights are if we hold your
          personal information, and how you can find out more or raise a concern.
        </p>
        <p className="govuk-body">
          The Home Office is the data controller for the personal information we collect, store and
          use for immigration purposes. UKHSA are data controllers for the public health purposes in
          managing the spread of tuberculosis in the UK.
        </p>
      </section>

      <section className="govuk-!-margin-bottom-6">
        <Heading level={2} size="l" title="The information we collect" />
        <p className="govuk-body">
          The Complete UK pre-entry health screening service collects personal and medical
          information to support the visa application process.
        </p>
        <p className="govuk-body">
          The personal information we collect and use includes the visa applicant&apos;s:
        </p>
        <List
          items={[
            "full name",
            "date of birth",
            "home address",
            "telephone number",
            "email address",
            "sex",
            "photo",
            "nationality",
            "passport number",
            "passport validity date",
            "medical history",
            "symptoms of pulmonary TB",
            "sputum sample results",
            "pregnancy status and if they have menstrual periods",
          ]}
        />
      </section>

      <section className="govuk-!-margin-bottom-6">
        <Heading level={2} size="l" title="How we collect your information" />
        <p className="govuk-body">
          This personal information comes directly from the approved overseas clinics that carry out
          your screening process.
        </p>
      </section>

      <section className="govuk-!-margin-bottom-6">
        <Heading level={2} size="l" title="The purposes we use your information for" />
        <p className="govuk-body">
          Complete UK pre-entry health screening collects personal and medical information on active
          pulmonary TB. It is used to support your UK visa application and make sure overseas
          clinics meet UK health standards.
        </p>
        <p className="govuk-body">
          The personal information about you collected by the Complete UK pre-entry health screening
          service helps us control and prevent the spread of active pulmonary TB in the UK. We use
          your information to:
        </p>
        <List
          items={[
            "support your visa application by establishing your TB status",
            "verify the accuracy of TB screening results to make sure clinics comply with UK health standards",
            "monitor the effectiveness of overseas pre-entry TB screening ",
            "monitor TB incidence in visa applicants",
            "assess clinic outcomes to provide quality assurance of the TB screening process",
          ]}
        />
        <p className="govuk-body">
          The results of this work are to prevent individuals infected with TB from entering the UK
          and to protect public health. The{" "}
          <LinkLabel
            title="UK pre-entry TB screening report is published on GOV.UK (opens in new tab)"
            to="https://www.gov.uk/government/publications/tuberculosis-in-england-2024-report"
            externalLink
            className="govuk-link"
            openInNewTab
          />
          .
        </p>
      </section>

      <section className="govuk-!-margin-bottom-6">
        <Heading level={2} size="l" title="How we protect your information" />
        <p className="govuk-body">
          The personal information used by Complete UK pre-entry health screening is protected in a
          number of ways.
        </p>
        <p className="govuk-body">
          It is stored on computer systems that have been tested to make sure they are secure and
          which are kept up to date to protect them from viruses and hacking. Where we share your
          personal information with other organisations, we only ever do so using secure computer
          systems or encrypted email.
        </p>
        <p className="govuk-body">
          Your information used by us can only be seen by staff who have been specifically trained
          to protect your privacy. Strong controls are in place to make sure all these staff can
          only see the minimum amount of personal information they need to do their job.
        </p>
        <p className="govuk-body">
          Whenever possible, we only use your information in a form that does not directly identify
          you. For example, our analyses for the annual UK pre-entry TB screening report uses
          information that does not directly identify you and reports at clinic and country level.
          The report shows where the highest number of applicants come from, as well as rates by
          country, age group and visa categories. We report in this way to protect your
          confidentiality.
        </p>
        <p className="govuk-body">
          No information that could identify individual people is ever published by UKHSA.
        </p>
      </section>

      <section className="govuk-!-margin-bottom-6">
        <Heading level={2} size="l" title="Where we store your information" />
        <p className="govuk-body">
          All personal information used by Complete UK pre-entry health screening is held in the UK
          only.
        </p>
      </section>

      <section className="govuk-!-margin-bottom-6">
        <Heading level={2} size="l" title="Who we share your information with" />
        <p className="govuk-body">
          We may share your personal information with other organisations to support Complete UK
          pre-entry health screening. If we do share your personal information, we only do so where
          the law allows, and we only share the minimum necessary amount of information.
        </p>
        <Heading level={3} size="m" title="With specialist radiologists" />
        <p className="govuk-body">
          We may share your chest X-ray images with specialist radiologists who support UKHSA in
          reviewing chest X-rays images. The radiologists will see the medical information that
          supports the chest X-ray, but this will not include any information that can identify you.
          We share this information to provide assurance that the UK health standards are being met.
        </p>
      </section>

      <section className="govuk-!-margin-bottom-6">
        <Heading level={2} size="l" title="How long we keep your information" />
        <p className="govuk-body">
          The personal information used by Complete UK pre-entry health screening is kept for 20
          years.
        </p>
        <p className="govuk-body">
          The information needs to be kept for this long to support epidemiological surveillance and
          research over a sufficient time period.
        </p>
      </section>

      <section className="govuk-!-margin-bottom-6">
        <Heading level={2} size="l" title="Your rights over your information" />
        <p className="govuk-body">
          Under data protection law, you have a number of rights over your personal information. You
          have the right to:
        </p>
        <List
          items={[
            "ask for a copy of any information we hold about you",
            "ask for any information we hold about you that you think is inaccurate to be changed",
            "ask us to restrict our use of your information, for example, where you think the information we are using is inaccurate",
            "object to us using any information we hold about you, although this is not an absolute right and we may need to continue to use your information - we will tell you why if this is the case",
            "delete any information we hold about you, although this is not an absolute right and we may need to continue to use your information - we will tell you why if this is the case",
            "ask us not to use your information to make automated decisions about you without the involvement of one of our staff",
          ]}
        />
        <p className="govuk-body">You can exercise any of these rights by contacting UKHSA at:</p>
        <p className="govuk-inset-text">
          Information Rights Team <br />
          UKHSA <br />
          5th Floor, 10 South Colonnade <br />
          London <br />
          E14 4PU <br />
          Email:{" "}
          <LinkLabel
            className="govuk-link"
            to="mailto:informationrights@ukhsa.gov.uk"
            title="informationrights@ukhsa.gov.uk"
            externalLink
          />
        </p>
        <p className="govuk-body">
          You will be asked to provide proof of your identity so that we can be sure we only provide
          you with your information.
        </p>
      </section>

      <section className="govuk-!-margin-bottom-6">
        <Heading level={2} size="l" title="Our legal basis to use your information" />
        <p className="govuk-body">
          The law on protecting personal information, known as the UK General Data Protection
          Regulation (UK GDPR) and the Data Protection Act 2018 (DPA), allows UKHSA to use the
          personal information collected by Complete UK pre-entry health screening.
        </p>
        <p className="govuk-body">
          The sections of the UK GDPR and the DPA that apply where we use personal information for
          Complete UK pre-entry health screening are:
        </p>
        <List
          items={[
            "UK GDPR Article 6(1)(c) Processing is necessary for compliance with a legal obligation - Immigration Act 1971",
            "UK GDPR Article 6(1)(e) Processing is necessary for the performance of a task carried out in the public interest or in the exercise of official authority vested in the controller",
            "UK GDPR Article 9(g) Reasons of substantial public interest (with a basis in law)",
            "UK GDPR Article 9(i) Public health (with a basis in law)",
            "Data Protection Act 2018 Part 2(6) Statutory and government purposes",
            "Data Protection Act 2018 Schedule 1 Part 1 (3) 'public health'",
          ]}
        />
      </section>

      <section className="govuk-!-margin-bottom-6">
        <Heading level={2} size="l" title="Our duty of confidentiality" />
        <p className="govuk-body">
          To fulfil our remit, we may need to use your confidential patient information without
          asking for your consent.
        </p>
        <p className="govuk-body">
          We have &apos;section 251&apos; approval from the Secretary of State for Health and Social
          Care to do this for the purpose of diagnosing, recognising trends, controlling and
          preventing, and monitoring and managing communicable diseases and other risks to public
          health.
        </p>
        <p className="govuk-body">
          The part of the law that applies here is section 251 of the National Health Service Act
          2006 and Regulation 3 of the associated Health Service (Control of Patient Information)
          Regulations 2002.
        </p>
      </section>

      <section className="govuk-!-margin-bottom-6">
        <Heading level={2} size="l" title="How to find out more or raise a concern" />
        <p className="govuk-body">
          If you would like to find out more about Complete UK pre-entry health screening, you can
          contact us at{" "}
          <LinkLabel
            className="govuk-link"
            to="mailto:uktbscreeningsupport@ukhsa.gov.uk"
            title="uktbscreeningsupport@ukhsa.gov.uk"
            externalLink
          />
          .
        </p>
        <p className="govuk-body">
          If you have any concerns about how personal information is used and protected by UKHSA,
          you can contact the Department of Health and Social Care&apos;s Data Protection Officer at{" "}
          <LinkLabel
            className="govuk-link"
            to="mailto:data_protection@dhsc.gov.uk"
            title="data_protection@dhsc.gov.uk"
            externalLink
          />{" "}
          or by writing to:{" "}
        </p>
        <p className="govuk-inset-text">
          Office of the Data Protection Officer <br />
          Department of Health and Social Care <br />
          1st Floor North <br />
          39 Victoria Street <br />
          London <br />
          SW1H 0EU
        </p>
        <p className="govuk-body">
          You also have the right to contact the{" "}
          <LinkLabel
            title="Information Commissioner's Office (opens in new tab)"
            to="https://ico.org.uk/global/contact-us"
            externalLink
            className="govuk-link"
            openInNewTab
          />{" "}
          if you have any concerns about how UKHSA uses and protects any personal information it
          holds about you. You can do so by calling the ICO&apos;s helpline on 0303 123 1113,
          visiting the ICO&apos;s website or by writing to:{" "}
        </p>
        <p className="govuk-inset-text">
          Customer Contact <br />
          Information Commissioner&apos;s Office <br />
          Wycliffe House <br />
          Water Lane <br />
          Wilmslow <br />
          SK9 5AF
        </p>
      </section>

      <section className="govuk-!-margin-bottom-6">
        <Heading level={2} size="l" title="About this privacy information" />
        <p className="govuk-body">
          The personal information we collect and use may change so we may need to revise this
          notice. If we do, the publication date provided below will change.
        </p>
        <p className="govuk-body">Published 21 August 2025</p>
        <p className="govuk-body">
          For more information, see the{" "}
          <LinkLabel
            title="UKHSA privacy notice (opens in new tab)"
            to="https://www.gov.uk/government/publications/ukhsa-privacy-notice/ukhsa-privacy-notice"
            externalLink
            className="govuk-link"
            openInNewTab
          />
          .
        </p>
      </section>
    </Container>
  );
}
