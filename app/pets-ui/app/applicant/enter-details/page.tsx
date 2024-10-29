'use client'
import FreeText from '@/components/freeText/freeText';
import Button, { ButtonType } from '@/components/button/button';
import DateTextInput from '@/components/dateTextInput/dateTextInput';
import Dropdown from '@/components/dropdown/dropdown';

import './page.scss'

const countryOptions = [
    {
        value: "NGR",
        label: "Nigeria"
    },
    {
        value: "TOG",
        label: "Togo"
    },
    {
        value: "IND",
        label: "India"
    }
]

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
        <DateTextInput
            id="passport-issue-date"
            autocomplete={false}
            title="Issue Date"
            hint="For example, 31 3 2019"
        />
        <DateTextInput
            id="passport-expiry-date"
            autocomplete={false}
            title="Expiry Date"
            hint="For example, 31 3 2019"
        />
        <DateTextInput
            id="birth-date"
            autocomplete={true}
            title="Date of Birth"
            hint="For example, 31 3 2019"
        />
        <Dropdown
            id="country-of-issue-selector"
            label="Country of Issue"
            hint="This is usualy shown on the first page of the passport, at the top. Use the English spelling or the country code"
            name="country"
            options={countryOptions}
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
