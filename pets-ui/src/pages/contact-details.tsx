import { Helmet } from 'react-helmet-async';
import ContactForm from '@sections/contact-form';
import { Heading, Main, Paragraph, Page } from 'govuk-react';

// ----------------------------------------------------------------------


export default function ContactDetailsPage() {
  return (
    <Page>
      <Helmet>
        <title> Create Applicant Form</title>
      </Helmet>

      <Main>
        {/* Page Title */}
        <Heading>
            Enter Applicant Information
        </Heading>
        <Paragraph>Enter the applicants profile information below. Select &apos;Save and Review&apos; to save any information added</Paragraph>

        {/* Content Section */}
        {/* <GridRow>
            <GridCol setWidth="one-half">
                <Heading size="M">Section Title</Heading>
                <Paragraph>Content for this section goes here.</Paragraph>
            </GridCol>

            <GridCol setWidth="one-half">
                <Heading size="M">Another Section</Heading>
                <Paragraph>Additional content or instructions go here.</Paragraph>
            </GridCol>
        </GridRow> */}

        <ContactForm />

    </Main>

    </Page>
  );
}
