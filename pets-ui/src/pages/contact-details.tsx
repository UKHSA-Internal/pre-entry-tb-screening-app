import { Helmet } from 'react-helmet-async';
import ContactForm from '@sections/contact-form';
import { Heading, Main, Paragraph, Page, GlobalStyle } from 'govuk-react';

// ----------------------------------------------------------------------


export default function ContactDetailsPage() {
  return (
    <Page>
      <GlobalStyle/>
      <Helmet>
        <title> Create Applicant Form</title>
      </Helmet>

      <Main>
        <Heading>
            Enter Applicant Information
        </Heading>
        <Paragraph>Enter the applicants profile information below. Select &apos;Save and Review&apos; to save any information added</Paragraph>
        <ContactForm />
      </Main>

    </Page>
  );
}
