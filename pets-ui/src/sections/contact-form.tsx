// @mui
import { Input, Select, DateField, Button, Radio, GridRow, GridCol, LabelText, Label } from "govuk-react"
import { default as CountryList } from "../utils/country-list"

// ----------------------------------------------------------------------

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

const sex = [
    {
        value: "male",
        label: "Male"
    },
    {
        value: "female",
        label: "Female"
    }
]

export default function ContactForm() {

  return (
    <div>
      <GridRow>
        <GridCol>
          <Label>
            <LabelText>Applicant&apos;s Name</LabelText>
            <Input
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
            id="country-of-nationality"
            label="Country of Nationality"
          >
            { CountryList.map((country) => 
              <option key={country.value} value={country.value}>{country.label}</option>) 
            }
          </Select>
        </GridCol>
      </GridRow>
      <GridRow>
        <GridCol>
          <Select
            id="country-of-issue"
            label="Country of Issue"
            hint="This is usually shown on the first page of the passport, at the top. Use the English spelling or the country code."
          >
            { CountryList.map((country) => 
              <option key={country.value} value={country.value}>{country.label}</option>)
            }
          </Select>
        </GridCol>
      </GridRow>
      <GridRow>
        <GridCol>
          <DateField
            id="date-of-birth"
            title="Date of Birth"
            inputs={{
              day: { },
              month: { },
              year: { }
            }}
          >     
            Date of Birth
          </DateField>
        </GridCol>
      </GridRow>
      <GridRow>
        <GridCol>
          <DateField
            id="passport-issue-date"
            title="Passport Issue Date"
            inputs={{
              day: { },
              month: { },
              year: { }
            }}
          >     
            Passport Issue Date
          </DateField>
        </GridCol>
      </GridRow>
      <GridRow>
        <GridCol>
          <DateField
            id="passport-expiry-date"
            title="Passport Expiry Date"
            inputs={{
              day: { },
              month: { },
              year: { }
            }}
          >     
            Passport Expiry Date
          </DateField>
        </GridCol>
      </GridRow>
          
      <GridRow>
        <GridCol>
          {sex.map((option) => (
            <Radio
              inline
              title="Applicant's Sex"
              name="group1"
              key={option.value}
            >
              {option.label}
            </Radio>
          ))}
        </GridCol>
      </GridRow>
          
      <GridRow>
        <GridCol>
        <Select
          id="visa-type"
          label="Applicant's Visa Type"
        >
          {visaOptions.map((country) => <option key={country.value} value={country.value}>{country.label}</option>)}
        </Select>
        </GridCol>
      </GridRow>
          
      <GridRow>
        <GridCol>
          <Label>
            <LabelText>
                Applicant&apos;s Home Address
            </LabelText>
            <Input
              id="address-1"
              title="Applicant's Home Address"
              label="Address line 1"
            />
            <Input
              id="address-2"
              label="Address line 2"
            />
            <Input
              id="address-3"
              label="Address line 3"
            />
            <Input
              id="town-or-city"
              label="Town/City"
            />
            <Input
              id="province-or-state"
              label="Province/State"
            />
            <Input
              id="postcode"
              label="Postcode"
            />
          </Label>
        </GridCol>
      </GridRow>
          
      <GridRow>
        <GridCol>
          <Select
            id="address-country"
            label="Country"
          >
            {CountryList.map((country) => <option key={country.value} value={country.value}>{country.label}</option>)}
          </Select>
        </GridCol>
      </GridRow>
          
      <Button id="save-and-continue" route="/applicant/confirmation">
        Save and continue
      </Button>
    </div>
  );
}
