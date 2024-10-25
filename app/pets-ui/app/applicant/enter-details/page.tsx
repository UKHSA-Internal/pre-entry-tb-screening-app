'use client'
import FreeText from '@/components/freeText/freeText';
import Button, { ButtonType } from '@/components/button/button';
import Date from '@/components/date/date';

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
        <Date
            id="passport-issue-date"
            autocomplete={false}
            title="Issue Date"
            hint="For example, 31 3 2019"
        />
        <Date
            id="passport-expiry-date"
            autocomplete={false}
            title="Expiry Date"
            hint="For example, 31 3 2019"
        />
        <Date
            id="birth-date"
            autocomplete={true}
            title="Date of Birth"
            hint="For example, 31 3 2019"
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
