import { setupServer } from 'msw/node'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Mock } from 'vitest'
import { renderWithProviders } from '@/utils/test-utils'
import MedicalScreeningForm from '@/sections/medical-screening-form'
import MedicalScreeningReview from '@/sections/medical-screening-summary'
import { BrowserRouter as Router } from 'react-router-dom'

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
    <Router>
      <MedicalScreeningForm /> 
      <MedicalScreeningReview /> 
    </Router>
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

  await user.click(screen.getAllByRole('button')[0])
  
  expect(useNavigateMock).toBeCalled()

  expect(screen.getAllByRole('term')[3]).toHaveTextContent('Name')
  expect(screen.getAllByRole('definition')[4]).toHaveTextContent('')
  expect(screen.getAllByRole('term')[4]).toHaveTextContent('Age')
  expect(screen.getAllByRole('definition')[5]).toHaveTextContent('99')
  expect(screen.getAllByRole('term')[5]).toHaveTextContent('Does the applicant have TB symptoms?')
  expect(screen.getAllByRole('definition')[7]).toHaveTextContent('yes')
  expect(screen.getAllByRole('term')[6]).toHaveTextContent('TB symptoms')
  expect(screen.getAllByRole('definition')[9]).toHaveTextContent('cough, night sweats')
  expect(screen.getAllByRole('term')[7]).toHaveTextContent('Other symptoms')
  expect(screen.getAllByRole('definition')[11]).toHaveTextContent('')
  expect(screen.getAllByRole('term')[8]).toHaveTextContent('Applicant history if under 11')
  expect(screen.getAllByRole('definition')[13]).toHaveTextContent('not applicable applicant is aged 11 or over')
  expect(screen.getAllByRole('term')[9]).toHaveTextContent('Additional details of applicant history if under 11')
  expect(screen.getAllByRole('definition')[15]).toHaveTextContent('')
  expect(screen.getAllByRole('term')[10]).toHaveTextContent('Has the applicant ever had tuberculosis?')
  expect(screen.getAllByRole('definition')[17]).toHaveTextContent('yes')
  expect(screen.getAllByRole('term')[11]).toHaveTextContent("Detail of applicant's previous TB")
  expect(screen.getAllByRole('definition')[19]).toHaveTextContent('Details of previous TB.')
  expect(screen.getAllByRole('term')[12]).toHaveTextContent('Has the applicant had close contact with any person with active pulmonary tuberculosis within the past year?')
  expect(screen.getAllByRole('definition')[21]).toHaveTextContent('no')
  expect(screen.getAllByRole('term')[13]).toHaveTextContent("Details of applicant's close contact with any person with active pulmonary tuberculosis")
  expect(screen.getAllByRole('definition')[23]).toHaveTextContent('')
  expect(screen.getAllByRole('term')[14]).toHaveTextContent('Is the applicant pregnant?')
  expect(screen.getAllByRole('definition')[25]).toHaveTextContent('dont-know')
  expect(screen.getAllByRole('term')[15]).toHaveTextContent('Does the applicant have menstrual periods?')
  expect(screen.getAllByRole('definition')[27]).toHaveTextContent('no')
  expect(screen.getAllByRole('term')[16]).toHaveTextContent('Physical examination notes')
  expect(screen.getAllByRole('definition')[29]).toHaveTextContent('Details of physical examination.')
})
