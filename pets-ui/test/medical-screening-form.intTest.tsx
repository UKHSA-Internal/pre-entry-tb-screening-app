import { setupServer } from 'msw/node'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Mock } from 'vitest'
import { renderWithProviders } from '@/utils/test-utils'
import MedicalScreeningForm from '@/sections/medical-screening-form'
import MedicalScreeningReview from '@/sections/medical-screening-confirmation'

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

test('state is updated from MedicalScreeningForm and then read by MedicalScreeningReview', async () => {
  renderWithProviders(
    <div>
      <MedicalScreeningForm /> 
      <MedicalScreeningReview /> 
    </div>
  )
  
  const user = userEvent.setup()

  await user.type(screen.getByTestId('age'), '99')
  await user.click(screen.getAllByTestId('tb-symptoms')[0])
  await user.click(screen.getAllByTestId('tb-symptoms-list')[0])
  await user.click(screen.getAllByTestId('tb-symptoms-list')[1])
  await user.click(screen.getAllByTestId('under-eleven-conditions')[5])
  await user.click(screen.getAllByTestId('previous-tb')[0])
  await user.type(screen.getByTestId('previous-tb-detail'), 'Details of previous TB.')
  await user.click(screen.getAllByTestId('close-contact-with-tb')[1])
  await user.click(screen.getAllByTestId('pregnant')[2])
  await user.click(screen.getAllByTestId('menstrual-periods')[1])
  await user.type(screen.getByTestId('physical-exam-notes'), 'Details of physical examination.')

  expect(screen.getByTestId('age')).toHaveValue('99')
  expect(screen.getAllByTestId('tb-symptoms')[0]).toBeChecked()
  expect(screen.getAllByTestId('tb-symptoms')[1]).not.toBeChecked()
  expect(screen.getAllByTestId('tb-symptoms-list')[0]).toBeChecked()
  expect(screen.getAllByTestId('tb-symptoms-list')[1]).toBeChecked()
  expect(screen.getAllByTestId('tb-symptoms-list')[2]).not.toBeChecked()
  expect(screen.getAllByTestId('tb-symptoms-list')[3]).not.toBeChecked()
  expect(screen.getAllByTestId('tb-symptoms-list')[4]).not.toBeChecked()
  expect(screen.getAllByTestId('tb-symptoms-list')[5]).not.toBeChecked()
  expect(screen.getByTestId('other-symptoms-detail')).toHaveValue('')
  expect(screen.getAllByTestId('under-eleven-conditions')[0]).not.toBeChecked()
  expect(screen.getAllByTestId('under-eleven-conditions')[1]).not.toBeChecked()
  expect(screen.getAllByTestId('under-eleven-conditions')[2]).not.toBeChecked()
  expect(screen.getAllByTestId('under-eleven-conditions')[3]).not.toBeChecked()
  expect(screen.getAllByTestId('under-eleven-conditions')[4]).not.toBeChecked()
  expect(screen.getAllByTestId('under-eleven-conditions')[5]).toBeChecked()
  expect(screen.getByTestId('under-eleven-conditions-detail')).toHaveValue('')
  expect(screen.getAllByTestId('previous-tb')[0]).toBeChecked()
  expect(screen.getAllByTestId('previous-tb')[1]).not.toBeChecked()
  expect(screen.getByTestId('previous-tb-detail')).toHaveValue('Details of previous TB.')
  expect(screen.getAllByTestId('close-contact-with-tb')[0]).not.toBeChecked()
  expect(screen.getAllByTestId('close-contact-with-tb')[1]).toBeChecked()
  expect(screen.getByTestId('close-contact-with-tb-detail')).toHaveValue('')
  expect(screen.getAllByTestId('pregnant')[0]).not.toBeChecked()
  expect(screen.getAllByTestId('pregnant')[1]).not.toBeChecked()
  expect(screen.getAllByTestId('pregnant')[2]).toBeChecked()
  expect(screen.getAllByTestId('pregnant')[3]).not.toBeChecked()
  expect(screen.getAllByTestId('menstrual-periods')[0]).not.toBeChecked()
  expect(screen.getAllByTestId('menstrual-periods')[1]).toBeChecked()
  expect(screen.getAllByTestId('menstrual-periods')[2]).not.toBeChecked()
  expect(screen.getByTestId('physical-exam-notes')).toHaveValue('Details of physical examination.')

  await user.click(screen.getByRole('button'))

  expect(screen.getAllByRole('paragraph')[0]).toHaveTextContent('Age: 99')
  expect(screen.getAllByRole('paragraph')[1]).toHaveTextContent('Previous TB: yes')
  expect(screen.getAllByRole('paragraph')[2]).toHaveTextContent('Exam Notes: Details of physical examination.')
})
