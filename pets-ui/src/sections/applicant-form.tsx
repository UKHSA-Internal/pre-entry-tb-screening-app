import { useForm, SubmitHandler } from "react-hook-form"
import { default as CountryList } from "@/utils/country-list"
import Button, { ButtonType } from "@/components/button/button"
import DateTextInput from "@/components/dateTextInput/dateTextInput"
import Dropdown from "@/components/dropdown/dropdown"
import FreeText from "@/components/freeText/freeText"
import Radio, { RadioIsInline } from "@/components/radio/radio"

type FormValues = {
  fullName: string
  dateOfBirth: string
  sex: string
  passportNumber: string
  countryOfNationality: string
  countryOfIssue: string
  passportIssueDate: string
  passportExpiryDate: string 
  applicantHomeAddress1: string
  applicantHomeAddress2: string
  applicantHomeAddress3: string
  townOrCity: string
  provinceOrState: string
  country: string
  postcode: string
}

const ApplicantForm = () => {
  const { register, handleSubmit } = useForm<FormValues>()
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    alert(JSON.stringify(data))
  }

  return (
    // <form onSubmit={handleSubmit(onSubmit)}>
    //   <GridRow>
    //     <GridCol>
    //       <Label>
    //         <LabelText>Applicant&apos;s Name</LabelText>
    //         <Input
    //           {...register("fullName", { required: true, pattern: /[^a-zA-Z\s]+/})}
    //           id="name"
    //           title="Applicant's Name"
    //           label="Full Name"
    //         />
    //       </Label>
    //     </GridCol>
    //   </GridRow>
    //   <GridRow>
    //     <GridCol>
    //       <Label>
    //         <LabelText>Applicant&apos;s Passport Information</LabelText>
    //         <Input
    //           {...register("passportNumber", { required: true, pattern: /[^a-zA-Z\d]+/})}
    //           id="passport-number"
    //           title="Applicant's Passport Information"
    //           label="Passport Number"
    //           hint="For example, 1208297A"
    //         />
    //       </Label>
    //     </GridCol>
    //   </GridRow>
    //   <GridRow>
    //     <GridCol>
    //       <Select
    //         {...register("countryOfNationality", { required: true})}
    //         id="country-of-nationality"
    //         label="Country of Nationality"
    //       >
    //         { CountryList.map((country) => 
    //           <option key={country.value} value={country.value}>{country.label}</option>) 
    //         }
    //       </Select>
    //     </GridCol>
    //   </GridRow>
    //   <Button 
    //     id="save-and-continue" 
    //     route="/applicant/confirmation" 
    //     type="submit"
    //   >
    //     Save and Continue
    //   </Button>
    // </form>

    <form onSubmit={handleSubmit(onSubmit)}>
      
        <FreeText
          {...register("fullName", { required: true, pattern: /[^a-zA-Z\s]+/})}
          id="name"
          title="Applicant's Personal Details"
          label="Full Name"
          // handleChange={handleTextChange}
          // errorMessage={errorMessages.fullName}
          handleChange={() => {}}
          errorMessage=""
        />

        <DateTextInput
          {...register("dateOfBirth", { required: true })}
          id="birth-date"
          autocomplete={true}
          legend="Date of Birth"
          hint="For example, 31 3 2019"
          // handleChange={handleDateChange}
          // errorMessage={errorMessages.dateOfBirth}
          handleChange={() => {}}
          errorMessage=""
        />

        <Radio
          {...register("sex", { required: true })}
          id="applicants-sex"
          legend="Sex"
          isInline={RadioIsInline.TRUE}
          answerOptions={["Male", "Female"]}
          sortAnswersAlphabetically={false}
          // handleChange={handleRadioChange}
          // errorMessage={errorMessages.sex}
          handleChange={() => {}}
          errorMessage=""
        />

        <FreeText
          {...register("passportNumber", { required: true })}
          id="passport-number"
          title="Applicant's Passport Details"
          label="Passport Number"
          hint="For example, 1208297A"
          // handleChange={handleTextChange}
          // errorMessage={errorMessages.passportNumber}
          handleChange={() => {}}
          errorMessage=""
        />

        <Dropdown
          {...register("countryOfNationality", { required: true })}
          id="country-of-nationality"
          label="Country of Nationality"
          name="country"
          options={CountryList}
          // handleOptionChange={handleDropdownChange}
          // errorMessage={errorMessages.countryOfNationality}
          handleOptionChange={() => {}}
          errorMessage=""
        />

        <Dropdown
          {...register("countryOfIssue", { required: true })}
          id="country-of-issue"
          label="Country of Issue"
          hint="This is usually shown on the first page of the passport, at the top. Use the English spelling or the country code."
          name="country"
          options={CountryList}
          // handleOptionChange={handleDropdownChange}
          // errorMessage={errorMessages.countryOfIssue}
          handleOptionChange={() => {}}
          errorMessage=""
        />

        <DateTextInput
          {...register("passportIssueDate", { required: true })}
          id="passport-issue-date"
          autocomplete={false}
          legend="Issue Date"
          hint="For example, 31 3 2019"
          // handleChange={handleDateChange}
          // errorMessage={errorMessages.issueDate}
          handleChange={() => {}}
          errorMessage=""
        />

        <DateTextInput
          {...register("passportExpiryDate", { required: true })}
          id="passport-expiry-date"
          autocomplete={false}
          legend="Expiry Date"
          hint="For example, 31 3 2019"
          // handleChange={handleDateChange}
          // errorMessage={errorMessages.expiryDate}
          handleChange={() => {}}
          errorMessage=""
        />

        <FreeText
          {...register("applicantHomeAddress1", { required: true })}
          id="address-1"
          title="Applicant's Home Address"
          label="Address line 1"
          // handleChange={handleTextChange}
          // errorMessage={errorMessages.applicantHomeAddress1}
          handleChange={() => {}}
          errorMessage=""
        />

        <FreeText
          {...register("applicantHomeAddress2", { required: false })}
          id="address-2"
          label="Address line 2"
          // handleChange={handleTextChange}
          // errorMessage={errorMessages.applicantHomeAddress2}
          handleChange={() => {}}
          errorMessage=""
        />

        <FreeText
          {...register("applicantHomeAddress3", { required: false })}
          id="address-3"
          label="Address line 3"
          // handleChange={handleTextChange}
          // errorMessage={errorMessages.applicantHomeAddress3}
          handleChange={() => {}}
          errorMessage=""
        />

        <FreeText
          {...register("townOrCity", { required: true })}
          id="town-or-city"
          label="Town/City"
          // handleChange={handleTextChange}
          // errorMessage={errorMessages.townOrCity}
          handleChange={() => {}}
          errorMessage=""
        />
        
        <FreeText
          {...register("provinceOrState", { required: false })}
          id="province-or-state"
          label="Province/State"
          // handleChange={handleTextChange}
          // errorMessage={errorMessages.provinceOrState}
          handleChange={() => {}}
          errorMessage=""
        />

        <Dropdown
          {...register("country", { required: true })}
          id="address-country"
          label="Country"
          name="country"
          options={CountryList}
          // handleOptionChange={handleDropdownChange}
          // errorMessage={errorMessages.country}
          handleOptionChange={() => {}}
          errorMessage=""
        />

        <FreeText
          {...register("postcode", { required: false })}
          id="postcode"
          label="Postcode"
          // handleChange={handleTextChange}
          // errorMessage={errorMessages.postcode}
          handleChange={() => {}}
          errorMessage=""
        />

        <Button
          id="save-and-continue"
          type={ButtonType.DEFAULT}
          text="Save and continue"
          href="/applicant/confirmation"
          // handleClick={handleButtonClick}
          handleClick={() => {}}
        />

    </form>
  )
}

export default ApplicantForm;
