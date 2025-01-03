import { setupServer } from 'msw/node'
import { fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Mock } from 'vitest'
import { renderWithProviders } from '@/utils/test-utils'
import ApplicantTravelForm from '@/sections/applicant-travel-form'
import TravelReview from '@/sections/applicant-travel-confirmation'

const useNavigateMock: Mock = vi.fn();
vi.mock(`react-router-dom`, async (): Promise<unknown> => {
  const actual: Record<string, unknown> = await vi.importActual(`react-router-dom`);
  return {
    ...actual,
    useNavigate: (): Mock => useNavigateMock,
  };
});

export const handlers = []
const server = setupServer(...handlers)

// Enable API mocking before tests.
beforeAll(() => server.listen())

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers())

// Disable API mocking after the tests are done.
afterAll(() => server.close())

test('state is updated from ApplicantTravelForm and then read by TravelReview', async () => {
  renderWithProviders(
    <div>
      <ApplicantTravelForm /> 
      <TravelReview /> 
    </div>
  )
  
  const user = userEvent.setup()

  fireEvent.change(screen.getAllByRole('combobox')[0], {target: { value: 'Government Sponsored'}})
  await user.type(screen.getByTestId('address-1'), 'Edinburgh Castle, Castlehill')
  await user.type(screen.getByTestId('town-or-city'), 'Edinburgh')
  await user.type(screen.getByTestId('postcode'), 'EH1 2NG')
  await user.type(screen.getByTestId('mobile-number'), '07321900900')
  await user.type(screen.getByTestId('email'), 'sigmund.sigmundson@asgard.gov')

  expect(screen.getAllByRole('combobox')[0]).toHaveValue('Government Sponsored')
  expect(screen.getByTestId('address-1')).toHaveValue('Edinburgh Castle, Castlehill')
  expect(screen.getByTestId('town-or-city')).toHaveValue('Edinburgh')
  expect(screen.getByTestId('postcode')).toHaveValue('EH1 2NG')
  expect(screen.getByTestId('mobile-number')).toHaveValue('07321900900')
  expect(screen.getByTestId('email')).toHaveValue('sigmund.sigmundson@asgard.gov')

  await user.click(screen.getByRole('button'))

  expect(screen.getAllByRole('paragraph')[0]).toHaveTextContent('Visa type: Government Sponsored')
  expect(screen.getAllByRole('paragraph')[1]).toHaveTextContent('Address line 1: Edinburgh Castle, Castlehill')
  expect(screen.getAllByRole('paragraph')[2]).toHaveTextContent('Phone number: 07321900900')
  expect(screen.getAllByRole('paragraph')[3]).toHaveTextContent('Email address: sigmund.sigmundson@asgard.gov')
})
