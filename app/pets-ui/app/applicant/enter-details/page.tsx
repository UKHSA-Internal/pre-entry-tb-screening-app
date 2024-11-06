'use client'
import './page.scss'
import FreeText from '@/components/freeText/freeText';
import Button, { ButtonType } from '@/components/button/button';
import DateTextInput from '@/components/dateTextInput/dateTextInput';
import Dropdown from '@/components/dropdown/dropdown';
import Radio, { RadioIsInline } from '@/components/radio/radio';
import { FormEvent, MouseEvent, useEffect, useRef, useState } from 'react';
import { convertDateToString } from '@utils/convert-date-to-string';
import { useRouter } from 'next/navigation';
import { countryList } from '@utils/country-list';
import { validateFreeTextFields } from '@/utils/validators/applicant-details-freetext-validation';
import { validateDateFields } from '@/utils/validators/applicant-details-date-validation';
import { idToDbAttribute } from '@/utils/component-id-to-db-attribute';
import { attributeToComponentId } from '@/utils/db-attribute-to-component-id';
import { visaOptions } from '@/utils/visa-options';

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

    const [errorMessages, setErrorMessages] = useState({
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
    const [errorsToDisplay, setErrorsToDisplay] = useState<string[]>([])
    
    const handleTextChange = (event: { target: { name: string; value: any; }; }) => {
        const { name, value } = event.target;
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
        name = name ?? "empty-name-attribute"
        value = value ?? "empty-value-attribute"

        if (name in idToDbAttribute) {
            setFormData({
                ...formData,
                [idToDbAttribute[name]]: value,
            });
        } else {
            console.error("Unrecognised radio component name")
        }
    };

    const handleDropdownChange = (event: { target: any; }) => {
        const name = event.target.id
        const value = event.target.value
        if (name in idToDbAttribute) {
            setFormData({
                ...formData,
                [idToDbAttribute[name]]: value,
            });
        } else {
            console.error("Unrecognised dropdown component name")
        }
    };

    const handleButtonClick = async (event: MouseEvent) => {
        event.preventDefault()

        const textErrors = validateFreeTextFields(formData)
        const dateErrors = validateDateFields(dateData)
        
        setErrorMessages({
            ...errorMessages,
            ...textErrors.errorMessages,
            ...dateErrors.errorMessages
        });

        const dataIsValid = textErrors.isValid
            && dateErrors.isValid

        if (dataIsValid) {
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
                const myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                await fetch("http://localhost:3004/dev/register-applicant", {
                    method: "POST",
                    body: JSON.stringify(formData),
                    headers: myHeaders,
                })
                router.push("/applicant/confirmation")
            } catch (error: any) {
                console.error("Error submitting POST request:")
                console.error(error.message);
            }
        }
    };

    const initialPageRender = useRef(true);
    const initialiseErrorMessages = useRef(true);
    useEffect(() => {
        if (initialPageRender.current) {
            initialPageRender.current = false
        } else if (initialiseErrorMessages.current) {
            initialiseErrorMessages.current = false
        } else {
            const errorsAsArray = Object.entries(errorMessages)
            const nonEmptyErrors = errorsAsArray.filter(([field, error]) => error !== "")
            setErrorsToDisplay(nonEmptyErrors.map(([field, error]) => field))
        }
    }, [errorMessages])

    return (
    <div className="govuk-width-container">
        <main className="govuk-main-wrapper">
            {errorsToDisplay.length > 0 &&
                <div className="govuk-error-summary" data-module="govuk-error-summary">
                    <div role="alert">
                        <h2 className="govuk-error-summary__title">
                        There is a problem
                        </h2>
                        <div className="govuk-error-summary__body">
                        <ul className="govuk-list govuk-error-summary__list">
                            {errorsToDisplay.map((error) => (
                                <li key={attributeToComponentId[error]}>
                                <a href={"#" + attributeToComponentId[error]}>{errorMessages[error as keyof typeof errorMessages]}</a>
                                </li>
                            ))}
                        </ul>
                        </div>
                    </div>
                </div>
            }
            <FreeText
                id="name"
                title="Applicant's Name"
                label="Full Name"
                handleChange={handleTextChange}
                errorMessage={errorMessages.fullName}
            />
            <FreeText
                id="passport-number"
                title="Applicant's Passport Information"
                label="Passport Number"
                hint="For example, 1208297A"
                handleChange={handleTextChange}
                errorMessage={errorMessages.passportNumber}
            />
            <Dropdown
                id="country-of-nationality"
                label="Country of Nationality"
                name="country"
                options={countryList}
                handleOptionChange={handleDropdownChange}
            />
            <Dropdown
                id="country-of-issue"
                label="Country of Issue"
                hint="This is usually shown on the first page of the passport, at the top. Use the English spelling or the country code."
                name="country"
                options={countryList}
                handleOptionChange={handleDropdownChange}
            />
            <DateTextInput
                id="passport-issue-date"
                autocomplete={false}
                legend="Issue Date"
                hint="For example, 31 3 2019"
                handleChange={handleDateChange}
                errorMessage={errorMessages.issueDate}
            />
            <DateTextInput
                id="passport-expiry-date"
                autocomplete={false}
                legend="Expiry Date"
                hint="For example, 31 3 2019"
                handleChange={handleDateChange}
                errorMessage={errorMessages.expiryDate}
            />
            <DateTextInput
                id="birth-date"
                autocomplete={true}
                legend="Date of Birth"
                hint="For example, 31 3 2019"
                handleChange={handleDateChange}
                errorMessage={errorMessages.dateOfBirth}
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
                id="visa-type"
                label="Applicant's Visa Type"
                name="visa"
                options={visaOptions}
                handleOptionChange={handleDropdownChange}
            />
            <FreeText
                id="address-1"
                title="Applicant's Home Address"
                label="Address line 1"
                handleChange={handleTextChange}
                errorMessage={errorMessages.applicantHomeAddress1}
            />
            <FreeText
                id="address-2"
                label="Address line 2"
                handleChange={handleTextChange}
                errorMessage={errorMessages.applicantHomeAddress2}
            />
            <FreeText
                id="address-3"
                label="Address line 3"
                handleChange={handleTextChange}
                errorMessage={errorMessages.applicantHomeAddress3}
            />
            <FreeText
                id="town-or-city"
                label="Town/City"
                handleChange={handleTextChange}
                errorMessage={errorMessages.townOrCity}
            />
            <FreeText
                id="province-or-state"
                label="Province/State"
                handleChange={handleTextChange}
                errorMessage={errorMessages.provinceOrState}
            />
            <Dropdown
                id="address-country"
                label="Country"
                name="country"
                options={countryList}
                handleOptionChange={handleDropdownChange}
            />
            <FreeText
                id="postcode"
                label="Postcode"
                handleChange={handleTextChange}
                errorMessage={errorMessages.postcode}
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
