'use client'
import FreeText from '@/components/freeText/freeText';
import Button, { ButtonType } from '@/components/button/button';
import DateTextInput from '@/components/dateTextInput/dateTextInput';
import Radio, { RadioIsInline } from '@/components/radio/radio';

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
        {/* Country of nationality dropdown */}
        {/* Country of issue dropdown */}
        <DateTextInput
            id="passport-issue-date"
            autocomplete={false}
            legend="Issue Date"
            hint="For example, 31 3 2019"
        />
        <DateTextInput
            id="passport-expiry-date"
            autocomplete={false}
            legend="Expiry Date"
            hint="For example, 31 3 2019"
        />
        <DateTextInput
            id="birth-date"
            autocomplete={true}
            legend="Date of Birth"
            hint="For example, 31 3 2019"
        />
        <Radio
            id="sex"
            title="Applicant's Sex"
            isInline={RadioIsInline.TRUE}
            answerOptions={["Male", "Female"]}
            sortAnswersAlphabetically={false}
        />
        {/* Type of visa dropdown */}
        <FreeText
            id="address-1"
            title="Applicant's Home Address"
            label="Address line 1"
        />
        <FreeText
            id="address-2"
            label="Address line 2"
        />
        <FreeText
            id="address-3"
            label="Address line 3"
        />
        <FreeText
            id="town-or-city"
            label="Town/City"
        />
        <FreeText
            id="province-or-state"
            label="Province/State"
        />
        {/* Country dropdown */}
        <FreeText
            id="postcode"
            label="Postcode"
        />
        <Button
            id="save-and-continue"
            type={ButtonType.DEFAULT}
            text="Save and continue"
            href="/applicant/confirmation"
        />
        <br/>
      </main>
    </div>
  );
}
