import React from 'react'
import { http, HttpResponse, delay } from 'msw'
import { setupServer } from 'msw/node'
import { fireEvent, screen } from '@testing-library/react'

import { renderWithProviders } from '@/utils/test-utils'
import ApplicantForm from '@/sections/applicant-form'
import ApplicantReview from '@sections/applicant-confirmation'


export const handlers = [
  http.post("http://localhost:3005/dev/register-applicant", async ({ request }) => {
    const newPost = await request.json()
    console.log(newPost);
    return HttpResponse.json({}, { status: 201 })
  }),
]

const server = setupServer(...handlers)

// Enable API mocking before tests.
beforeAll(() => server.listen())

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers())

// Disable API mocking after the tests are done.
afterAll(() => server.close())


test('fetches & receives a user after clicking the fetch user button', async () => {
  renderWithProviders(
    <>
      <ApplicantForm /> 
      <ApplicantReview /> 
    </>
  )

  // expect(screen.getByText(/no user/i)).toBeInTheDocument()
  // expect(screen.queryByText(/Fetching user\.\.\./i)).not.toBeInTheDocument()

  // after clicking the 'Fetch user' button, it should now show that it is fetching the user
  fireEvent.click(screen.getByRole('button', { name: /Fetch user/i }))
  expect(screen.getByText(/no user/i)).toBeInTheDocument()

  // after some time, the user should be received
  expect(await screen.findByText(/John Smith/i)).toBeInTheDocument()
  expect(screen.queryByText(/no user/i)).not.toBeInTheDocument()
  expect(screen.queryByText(/Fetching user\.\.\./i)).not.toBeInTheDocument()



  
})
