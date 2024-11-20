import { useForm, SubmitHandler } from "react-hook-form"
import { Input, Select, Button, GridRow, GridCol, LabelText, Label } from "govuk-react"
import { default as CountryList } from "../utils/country-list"

type FormValues = {
  fullName: string
  passportNumber: string
  countryOfNationality: string
}

const ApplicantForm = () => {
  const { register, handleSubmit } = useForm<FormValues>()
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    alert(JSON.stringify(data))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <GridRow>
        <GridCol>
          <Label>
            <LabelText>Applicant&apos;s Name</LabelText>
            <Input
              {...register("fullName", { required: true, pattern: /[^a-zA-Z\s]+/})}
              id="name"
              title="Applicant's Name"
              label="Full Name"
            />
          </Label>
        </GridCol>
      </GridRow>
      <GridRow>
        <GridCol>
          <Label>
            <LabelText>Applicant&apos;s Passport Information</LabelText>
            <Input
              {...register("passportNumber", { required: true, pattern: /[^a-zA-Z\d]+/})}
              id="passport-number"
              title="Applicant's Passport Information"
              label="Passport Number"
              hint="For example, 1208297A"
            />
          </Label>
        </GridCol>
      </GridRow>
      <GridRow>
        <GridCol>
          <Select
            {...register("countryOfNationality", { required: true})}
            id="country-of-nationality"
            label="Country of Nationality"
          >
            { CountryList.map((country) => 
              <option key={country.value} value={country.value}>{country.label}</option>) 
            }
          </Select>
        </GridCol>
      </GridRow>
      <Button 
        id="save-and-continue" 
        route="/applicant/confirmation" 
        type="submit"
      >
        Save and Continue
      </Button>
    </form>
  )
}

export default ApplicantForm;
