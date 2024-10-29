'use client'
import FreeText from '@/components/freeText/freeText';
import Button, { ButtonType } from '@/components/button/button';
import DateTextInput from '@/components/dateTextInput/dateTextInput';
import Dropdown from '@/components/dropdown/dropdown';
import Radio, { RadioIsInline } from '@/components/radio/radio';
import { FormEvent, MouseEvent, useState } from 'react';
import { convertDateToString } from './convert-date-to-string';
import { useRouter } from 'next/navigation';

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

const visaOptions = [
    {
        value: "Family Reunion",
        label: "Family Reunion"
    },
    {
        value: "Settlement and Dependents",
        label: "Settlement and Dependents"
    },
    {
        value: "Students",
        label: "Students"
    },
    {
        value: "Work",
        label: "Work"
    },
    {
        value: "Working Holiday Maker",
        label: "Working Holiday Maker"
    },
    {
        value: "Government Sponsored",
        label: "Government Sponsored"
    },
]

export default function Page() {

    const router = useRouter()
    
    const [formData, setFormData] = useState({
        "fullName": "",
        "passportNumber": "",
        "countryOfNationality": "",
        "countryOfIssue": "",
        "issueDate": "",
        "expiryDate": "",
        "dateOfBirth": "",
        "sex": "",
        "typesOfVisa": "",
        "applicantHomeAddress1": "",
        "applicantHomeAddress2": "",
        "applicantHomeAddress3": "",
        "townOrCity": "",
        "provinceOrState": "",
        "country": "",
        "postcode": ""
    });

    const [dateData, setDateData] = useState({
        "passport-issue-date-day": "",
        "passport-issue-date-month": "",
        "passport-issue-date-year": "",
        "passport-expiry-date-day": "",
        "passport-expiry-date-month": "",
        "passport-expiry-date-year": "",
        "birth-date-day": "",
        "birth-date-month": "",
        "birth-date-year": "",
    });
    
    const handleTextChange = (event: { target: { name: string; value: any; }; }) => {
        const { name, value } = event.target;
        const idToDbAttribute: {[key:string]:string} = {
            "name": "fullName",
            "passport-number": "passportNumber",
            "address-1": "applicantHomeAddress1",
            "address-2": "applicantHomeAddress2",
            "address-3": "applicantHomeAddress3",
            "town-or-city": "townOrCity",
            "province-or-state": "provinceOrState",
            "postcode": "postcode"
        }
        if (name in idToDbAttribute) {
            setFormData({
                ...formData,
                [idToDbAttribute[name]]: value,
            });
        } else {
            console.error("Unrecognised text component name")
        }
    };

    const handleDateChange = (event: { target: { name: string; value: any; }; }) => {
        const { name, value } = event.target;
        if (name in dateData) {
            setDateData({
                ...dateData,
                [name]: value,
            });
        } else {
            console.error("Unrecognised date component name")
        }
    };

    const handleRadioChange = (event: FormEvent) => {
        let name = event.currentTarget.attributes.getNamedItem("name")?.value
        let value = event.currentTarget.attributes.getNamedItem("value")?.value
        name = name ? name : "empty-name-attribute"
        value = value ? value : "empty-value-attribute"

        const idToDbAttribute: {[key:string]:string} = {
            "applicants-sex": "sex",
        }
        if (name in idToDbAttribute) {
            setFormData({
                ...formData,
                [idToDbAttribute[name]]: value,
            });
        } else {
            console.error("Unrecognised radio component name")
        }
    };

    const handleButtonClick = async (event: MouseEvent) => {
        event.preventDefault()
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        formData["issueDate"] = convertDateToString(
            dateData["passport-issue-date-day"], 
            dateData["passport-issue-date-month"], 
            dateData["passport-issue-date-year"]
        )
        formData["expiryDate"] = convertDateToString(
            dateData["passport-expiry-date-day"], 
            dateData["passport-expiry-date-month"], 
            dateData["passport-expiry-date-year"]
        )
        formData["dateOfBirth"] = convertDateToString(
            dateData["birth-date-day"], 
            dateData["birth-date-month"], 
            dateData["birth-date-year"]
        )

        try {
            const response = await fetch("http://localhost:3004/dev/register-applicant", {
                method: "POST",
                body: JSON.stringify(formData),
                headers: myHeaders,
            })
            if (response.ok) {
                console.log("Good response: " + response.status);
                console.log(response.json())
            }
            else {
                console.log("Bad response: " + response.status);
                console.log(response)
            }
            router.push("/applicant/confirmation")
        } catch (error: any) {
            console.log("Error submitting POST request:")
            console.error(error.message);
        }
    };
    
    return (
    <div className="govuk-width-container">
      <main className="govuk-main-wrapper">
        <FreeText
            id="name"
            title="Applicant's Name"
            label="Full Name"
            handleChange={handleTextChange}
        />
        <FreeText
            id="passport-number"
            title="Applicant's Passport Information"
            label="Passport Number"
            hint="For example, 1208297A"
            handleChange={handleTextChange}
        />
        <Dropdown
            id="country-of-nationality-selector"
            label="Country of Nationality"
            name="country"
            options={countryOptions}
        />
        <Dropdown
            id="country-of-issue-selector"
            label="Country of Issue"
            hint="This is usualy shown on the first page of the passport, at the top. Use the English spelling or the country code."
            name="country"
            options={countryOptions}
        />
        <DateTextInput
            id="passport-issue-date"
            autocomplete={false}
            legend="Issue Date"
            hint="For example, 31 3 2019"
            handleChange={handleDateChange}
        />
        <DateTextInput
            id="passport-expiry-date"
            autocomplete={false}
            legend="Expiry Date"
            hint="For example, 31 3 2019"
            handleChange={handleDateChange}
        />
        <DateTextInput
            id="birth-date"
            autocomplete={true}
            legend="Date of Birth"
            hint="For example, 31 3 2019"
            handleChange={handleDateChange}
        />
        <Radio
            id="sex"
            title="Applicant's Sex"
            isInline={RadioIsInline.TRUE}
            answerOptions={["Male", "Female"]}
            sortAnswersAlphabetically={false}
            handleChange={handleRadioChange}
        />
        <Dropdown
            id="visa-type-selector"
            label="Applicant's Visa Type"
            name="visa"
            options={visaOptions}
        />
        <FreeText
            id="address-1"
            title="Applicant's Home Address"
            label="Address line 1"
            handleChange={handleTextChange}
        />
        <FreeText
            id="address-2"
            label="Address line 2"
            handleChange={handleTextChange}
        />
        <FreeText
            id="address-3"
            label="Address line 3"
            handleChange={handleTextChange}
        />
        <FreeText
            id="town-or-city"
            label="Town/City"
            handleChange={handleTextChange}
        />
        <FreeText
            id="province-or-state"
            label="Province/State"
            handleChange={handleTextChange}
        />
        <Dropdown
            id="address-country-selector"
            label="Country"
            name="country"
            options={countryOptions}
        />
        <FreeText
            id="postcode"
            label="Postcode"
            handleChange={handleTextChange}
        />
        <Button
            id="save-and-continue"
            type={ButtonType.DEFAULT}
            text="Save and continue"
            href="/applicant/confirmation"
            handleClick={handleButtonClick}
        />
        <br/>
      </main>
    </div>
  );
}
