import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Mock } from 'vitest'
import { renderWithProviders } from '@/utils/test-utils'
import ApplicantForm from '@/sections/applicant-form'
import ApplicantReview from '@sections/applicant-confirmation'

const useNavigateMock: Mock = vi.fn();
vi.mock(`react-router-dom`, async (): Promise<unknown> => {
  const actual: Record<string, unknown> = await vi.importActual(`react-router-dom`);
  return {
    ...actual,
    useNavigate: (): Mock => useNavigateMock,
  };
});

export const handlers = [
  http.post('http://localhost:3005/dev/register-applicant', async ({ request }) => {
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

test('state is updated from ApplicantForm and then read by ApplicantReview', async () => {
  renderWithProviders(
    <div>
      <ApplicantForm /> 
      <ApplicantReview /> 
    </div>
  )
  
  const user = userEvent.setup()

  await user.type(screen.getByTestId('name'), 'Sigmund Sigmundson')
  await user.click(screen.getAllByTestId('sex')[1])
  fireEvent.change(screen.getAllByRole('combobox')[0], {target: { value: 'NOR'}})
  await user.type(screen.getByTestId('birth-date-day'), '1')
  await user.type(screen.getByTestId('birth-date-month'), '1')
  await user.type(screen.getByTestId('birth-date-year'), '1901')
  await user.type(screen.getByTestId('passportNumber'), '1234')
  fireEvent.change(screen.getAllByRole('combobox')[1], {target: { value: 'FIN'}})
  await user.type(screen.getByTestId('passport-issue-date-day'), '2')
  await user.type(screen.getByTestId('passport-issue-date-month'), 'feb')
  await user.type(screen.getByTestId('passport-issue-date-year'), '1902')
  await user.type(screen.getByTestId('passport-expiry-date-day'), '3')
  await user.type(screen.getByTestId('passport-expiry-date-month'), 'march')
  await user.type(screen.getByTestId('passport-expiry-date-year'), '2103')
  await user.type(screen.getByTestId('address-1'), 'The Bell Tower')
  await user.type(screen.getByTestId('address-2'), 'Hallgrimskirkja')
  await user.type(screen.getByTestId('address-3'), 'Hallgrimstorg 1')
  await user.type(screen.getByTestId('town-or-city'), 'Reykjavik')
  await user.type(screen.getByTestId('province-or-state'), 'Reykjavik')
  fireEvent.change(screen.getAllByRole('combobox')[2], {target: { value: 'ISL'}})
  await user.type(screen.getByTestId('postcode'), '101')

  expect(screen.getByTestId('name')).toHaveValue('Sigmund Sigmundson')
  expect(screen.getAllByTestId('sex')[0]).not.toBeChecked()
  expect(screen.getAllByTestId('sex')[1]).toBeChecked()
  expect(screen.getAllByRole('combobox')[0]).toHaveValue('NOR')
  expect(screen.getByTestId('birth-date-day')).toHaveValue('1')
  expect(screen.getByTestId('birth-date-month')).toHaveValue('1')
  expect(screen.getByTestId('birth-date-year')).toHaveValue('1901')
  expect(screen.getByTestId('passportNumber')).toHaveValue('1234')
  expect(screen.getAllByRole('combobox')[1]).toHaveValue('FIN')
  expect(screen.getByTestId('passport-issue-date-day')).toHaveValue('2')
  expect(screen.getByTestId('passport-issue-date-month')).toHaveValue('feb')
  expect(screen.getByTestId('passport-issue-date-year')).toHaveValue('1902')
  expect(screen.getByTestId('passport-expiry-date-day')).toHaveValue('3')
  expect(screen.getByTestId('passport-expiry-date-month')).toHaveValue('march')
  expect(screen.getByTestId('passport-expiry-date-year')).toHaveValue('2103')
  expect(screen.getByTestId('address-1')).toHaveValue('The Bell Tower')
  expect(screen.getByTestId('address-2')).toHaveValue('Hallgrimskirkja')
  expect(screen.getByTestId('address-3')).toHaveValue('Hallgrimstorg 1')
  expect(screen.getByTestId('town-or-city')).toHaveValue('Reykjavik')
  expect(screen.getByTestId('province-or-state')).toHaveValue('Reykjavik')
  expect(screen.getAllByRole('combobox')[2]).toHaveValue('ISL')
  expect(screen.getByTestId('postcode')).toHaveValue('101')

  await user.click(screen.getByRole('button'))

  expect(screen.getAllByRole('paragraph')[0]).toHaveTextContent('Name: Sigmund Sigmundson')
  expect(screen.getAllByRole('paragraph')[1]).toHaveTextContent('Country: ISL')
  expect(screen.getAllByRole('paragraph')[2]).toHaveTextContent('DOB: 1-1-1901')
})
