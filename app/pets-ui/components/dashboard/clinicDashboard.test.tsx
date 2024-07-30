import React from 'react'
import { render, screen, act, waitFor } from '@testing-library/react'
import fetchMock from "jest-fetch-mock"
import ClinicDashboard from './clinicDashboard'

fetchMock.enableMocks()

beforeEach(() => {
    fetchMock.resetMocks()
})

const mockResponseSingleClinic = JSON.stringify([
    {
        "petsClinicId": "testId",
        "petsClinicPNumber": "testPNumber",
        "petsClinicStatus": "testStatus",
        "petsClinicName": "testName",
        "petsClinicContactNumber": "testContactNumber",
        "petsClinicAccessNotes": "testAccessNotes",
        "petsClinicGeneralNotes": "testGeneralNotes",
        "petsClinicTown": "testTown",
        "petsClinicAddress": "testAddress",
        "petsClinicPostcode": "testPostcode",
        "petsClinicCountry": "testCountry",
        "petsClinicLongitude": "testLongitude",
        "petsClinicLatitude": "testLatitude",
        "petsClinicType": "testType",
        "petsClinicEmails": ["testEmail0","testEmail1"]
    }
])

const mockResponseMultipleClinics = JSON.stringify([
    {
        "petsClinicId": "testId0",
        "petsClinicPNumber": "testPNumber0",
        "petsClinicStatus": "testStatus0",
        "petsClinicName": "testName0",
        "petsClinicContactNumber": "testContactNumber0",
        "petsClinicAccessNotes": "testAccessNotes0",
        "petsClinicGeneralNotes": "testGeneralNotes0",
        "petsClinicTown": "testTown0",
        "petsClinicAddress": "testAddress0",
        "petsClinicPostcode": "testPostcode0",
        "petsClinicCountry": "testCountry0",
        "petsClinicLongitude": "testLongitude0",
        "petsClinicLatitude": "testLatitude0",
        "petsClinicType": "testType0",
        "petsClinicEmails": ["testEmail00","testEmail01"]
    },
    {
        "petsClinicId": "testId1",
        "petsClinicPNumber": "testPNumber1",
        "petsClinicStatus": "testStatus1",
        "petsClinicName": "testName1",
        "petsClinicContactNumber": "testContactNumber1",
        "petsClinicAccessNotes": "testAccessNotes1",
        "petsClinicGeneralNotes": "testGeneralNotes1",
        "petsClinicTown": "testTown1",
        "petsClinicAddress": "testAddress1",
        "petsClinicPostcode": "testPostcode1",
        "petsClinicCountry": "testCountry1",
        "petsClinicLongitude": "testLongitude1",
        "petsClinicLatitude": "testLatitude1",
        "petsClinicType": "testType1",
        "petsClinicEmails": ["testEmail10","testEmail11"]
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
        expect(await screen.findAllByRole("row")).toHaveLength(6)
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
        expect(await screen.findAllByRole("row")).toHaveLength(11)
        expect(await screen.findByRole("button")).toBeTruthy()
    })
})
