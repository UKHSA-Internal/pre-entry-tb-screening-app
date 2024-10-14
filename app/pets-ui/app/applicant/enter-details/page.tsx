'use client'
import FreeText from '@/components/freeText/freeText';
import Button, { ButtonType } from '@/components/button/button';
import './page.scss'

export default function Page() {
	return (
    <div className="govuk-width-container">
      <main className="govuk-main-wrapper">
        <FreeText
            id="name"
            title="Applicant's Name"
            label="Full Name"
        />
        <FreeText
            id="passport-number"
            title="Applicant's Passport Information"
            label="Passport Number"
            hint="For example, 1208297A"
        />
        <Button
            id="save-and-continue"
            type={ButtonType.DEFAULT}
            text="Save and continue"
            href="/applicant/check-answers"
        />
        <br/>
      </main>
    </div>
  );
}
