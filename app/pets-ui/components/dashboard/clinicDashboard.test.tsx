import React from 'react'
import { render, screen } from '@testing-library/react'
import fetchMock from "jest-fetch-mock"
import ClinicDashboard from './clinicDashboard'

fetchMock.enableMocks()

beforeEach(() => {
    fetchMock.resetMocks()
})

const mockResponseSingleClinic = JSON.stringify([
    {
        "petsClinicId": "testId",
        "petsClinicName":  "testName",
        "petsClinicAddressLine1": "testAddressLine1",
        "petsClinicAddressLine2": "testAddressLine2",
        "petsClinicCity": "testCity",
        "petsClinicCountry": "testCountry",
        "petsClinicPostcode": "testPostcode",
        "petsClinicContactNumber1": "testContactNumber1",
        "petsClinicContactNumber2": "testContactNumber2",
        "petsClinicEmails": ["testEmail0","testEmail1"],
        "petsClinicIsIom": true
    }
])

const mockResponseMultipleClinics = JSON.stringify([
    {
        "petsClinicId": "testId0",
        "petsClinicName":  "testName0",
        "petsClinicAddressLine1": "testAddressLine10",
        "petsClinicAddressLine2": "testAddressLine20",
        "petsClinicCity": "testCity0",
        "petsClinicCountry": "testCountry0",
        "petsClinicPostcode": "testPostcode0",
        "petsClinicContactNumber1": "testContactNumber10",
        "petsClinicContactNumber2": "testContactNumber20",
        "petsClinicEmails": ["testEmail00","testEmail10"],
        "petsClinicIsIom": false
    },
    {
        "petsClinicId": "testId1",
        "petsClinicName":  "testName1",
        "petsClinicAddressLine1": "testAddressLine11",
        "petsClinicAddressLine2": "testAddressLine21",
        "petsClinicCity": "testCity1",
        "petsClinicCountry": "testCountry1",
        "petsClinicPostcode": "testPostcode1",
        "petsClinicContactNumber1": "testContactNumber11",
        "petsClinicContactNumber2": "testContactNumber21",
        "petsClinicEmails": ["testEmail01","testEmail11"],
        "petsClinicIsIom": true
    }
])

describe('Dashboard component', () => {
    it('renders correctly when fetch returns no data', async () => {
        const mockResponse = JSON.stringify(null)
        fetchMock.mockResponseOnce(mockResponse)
        render(<ClinicDashboard/>)
        expect(screen.getByText("Loading...")).toBeTruthy()
        expect(await screen.findByText("No clinic data")).toBeTruthy()
    })
    
    it('renders correctly when fetch returns a single clinic', async () => {
        fetchMock.mockResponseOnce(mockResponseSingleClinic)
        render(<ClinicDashboard/>)
        expect(screen.getByText("Loading...")).toBeTruthy()
        expect(await screen.findByText("Clinic ID")).toBeTruthy()
        expect(await screen.findByText("testId")).toBeTruthy()
        expect(await screen.findByRole("table")).toBeTruthy()
        expect(await screen.findAllByRole("rowgroup")).toHaveLength(2) // testing for 1 thead and 1 tbody element
        expect(await screen.findAllByRole("row")).toHaveLength(7)
        expect(await screen.findByRole("button")).toBeTruthy()
    })

    it('renders correctly when fetch returns multiple clinics', async () => {
        fetchMock.mockResponseOnce(mockResponseMultipleClinics)
        render(<ClinicDashboard/>)
        expect(screen.getByText("Loading...")).toBeTruthy()
        expect(await screen.findAllByText("Clinic ID")).toHaveLength(2)
        expect(await screen.findByText("testId0")).toBeTruthy()
        expect(await screen.findByText("testId1")).toBeTruthy()
        expect(await screen.findByRole("table")).toBeTruthy()
        expect(await screen.findAllByRole("rowgroup")).toHaveLength(3) // testing for 1 thead and 2 tbody elements
        expect(await screen.findAllByRole("row")).toHaveLength(13)
        expect(await screen.findByRole("button")).toBeTruthy()
    })
})
