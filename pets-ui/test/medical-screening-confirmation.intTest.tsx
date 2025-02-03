import { setupServer } from 'msw/node'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Mock } from 'vitest'
import { renderWithProviders } from '@/utils/test-utils'
import { BrowserRouter as Router } from 'react-router-dom'
import MedicalConfirmation from '@/pages/medical-screening-confirmation'

const useNavigateMock: Mock = vi.fn();
vi.mock(`react-router-dom`, async (): Promise<unknown> => {
  const actual: Record<string, unknown> = await vi.importActual(`react-router-dom`);
  return {
    ...actual,
    useNavigate: (): Mock => useNavigateMock,
  };
});
vi.mock('react-helmet-async', () => ({
  Helmet: () => <>{}</>,
  HelmetProvider: () => <>{}</>,
}));

export const handlers = []
const server = setupServer(...handlers)

// Enable API mocking before tests.
beforeAll(() => server.listen())

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers())

// Disable API mocking after the tests are done.
afterAll(() => server.close())

test('Medical screening confirmation page renders correctly & redirects on button click', async () => {
  renderWithProviders(
    <Router>
      <MedicalConfirmation /> 
    </Router>
  )
  
  const user = userEvent.setup()
  expect(screen.getByText('Medical screening record created')).toBeTruthy()
  await user.click(screen.getAllByRole('button')[0])
  expect(useNavigateMock).toHaveBeenCalled()
})
