import ContactForm from '@sections/contact-form';
import { GridCol, GridRow, Heading, Main, Paragraph, Page } from 'govuk-react';

// ----------------------------------------------------------------------


export default function ContactDetailsPage() {
  return (
    <Page>
      <Main>
        {/* Page Title */}
        <Heading>
            Service Name
        </Heading>
        <Paragraph>Welcome to the service description or page introduction text.</Paragraph>

        {/* Content Section */}
        <GridRow>
            <GridCol setWidth="one-half">
                <Heading size="M">Section Title</Heading>
                <Paragraph>Content for this section goes here.</Paragraph>
            </GridCol>

            <GridCol setWidth="one-half">
                <Heading size="M">Another Section</Heading>
                <Paragraph>Additional content or instructions go here.</Paragraph>
            </GridCol>
        </GridRow>

        <ContactForm />

    </Main>

    </Page>
  );
}
