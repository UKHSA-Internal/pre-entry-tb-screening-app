import { describe, it, expect } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { useForm, FormProvider } from "react-hook-form";
import Checkbox from './checkbox';

type FormValues = {testValue: string}

const DefaultCheckboxToTest = () => {
    const methods = useForm<FormValues>()
    return (
        <FormProvider {...methods}>
            <Checkbox
                id='test-id'
                answerOptions={['zzz Answer One', 'aaa Answer Two']}
                sortAnswersAlphabetically={false}
                errorMessage=''
                formValue='testValue'
                required='This is required.'
            />
        </FormProvider>
    )
}

describe('Checkbox component', () => {
    it('renders correctly when all optional props are specified', () => {
        const CheckboxToTest = () => {
            const methods = useForm<FormValues>()
            return (
                <FormProvider {...methods}>
                    <Checkbox
                        id='test-id'
                        legend='test-legend'
                        hint='test-hint'
                        answerOptions={['zzz Answer One', 'aaa Answer Two']}
                        exclusiveAnswerOptions={['Exclusive Answer']}
                        sortAnswersAlphabetically={false}
                        errorMessage=''
                        formValue='testValue'
                        required='This is required.'
                    />
                </FormProvider>
            )
        }
        render(<CheckboxToTest/>)
        expect(screen.getAllByRole('checkbox')).toBeTruthy()
        expect(screen.getByText('test-legend')).toBeTruthy()
        expect(screen.getByText('test-hint')).toBeTruthy()
        expect(screen.getByText('zzz Answer One')).toBeTruthy()
        expect(screen.getByText('aaa Answer Two')).toBeTruthy()
        expect(screen.getByText('Exclusive Answer')).toBeTruthy()
    })

    it('renders correctly when all optional props are omitted', () => {
        render(<DefaultCheckboxToTest/>)
        expect(screen.getAllByRole('checkbox')).toBeTruthy()
        expect(screen.queryByText('test-legend')).toBeNull()
        expect(screen.queryByText('test-hint')).toBeNull()
        expect(screen.getByText('zzz Answer One')).toBeTruthy()
        expect(screen.getByText('aaa Answer Two')).toBeTruthy()
    })

    it('renders correctly when in an errored state', () => {
        const CheckboxToTest = () => {
            const methods = useForm<FormValues>()
            return (
                <FormProvider {...methods}>
                    <Checkbox
                        id='test-id'
                        answerOptions={['zzz Answer One', 'aaa Answer Two']}
                        sortAnswersAlphabetically={false}
                        errorMessage='test error'
                        formValue='testValue'
                        required='This is required.'
                    />
                </FormProvider>
            )
        }
        render(<CheckboxToTest/>)
        expect(screen.getAllByRole('checkbox')).toBeTruthy()
        expect(screen.queryByText('test-legend')).toBeNull()
        expect(screen.queryByText('test-hint')).toBeNull()
        expect(screen.queryByText('test error')).toBeTruthy()
        expect(screen.getByText('zzz Answer One')).toBeTruthy()
        expect(screen.getByText('aaa Answer Two')).toBeTruthy()
    })

    it('orders answers in the order specified when props.sortAnswersAlphabetically is false', () => {
        const {container} = render(<DefaultCheckboxToTest/>)
        const labels = container.getElementsByClassName('govuk-label govuk-checkboxes__label')
        expect(labels[0].innerHTML).toEqual(expect.stringContaining('zzz Answer One'))
        expect(labels[1].innerHTML).toEqual(expect.stringContaining('aaa Answer Two'))
    })

    it('orders answers alphabetically when props.sortAnswersAlphabetically is true', () => {
        const CheckboxToTest = () => {
            const methods = useForm<FormValues>()
            return (
                <FormProvider {...methods}>
                    <Checkbox
                        id='test-id'
                        answerOptions={['zzz Answer One', 'aaa Answer Two']}
                        exclusiveAnswerOptions={['Exclusive Answer']}
                        sortAnswersAlphabetically={true}
                        errorMessage=''
                        formValue='testValue'
                        required='This is required.'
                    />
                </FormProvider>
            )
        }
        const {container} = render(<CheckboxToTest/>)
        const labels = container.getElementsByClassName('govuk-label govuk-checkboxes__label')
        expect(labels[0].innerHTML).toEqual(expect.stringContaining('aaa Answer Two'))
        expect(labels[1].innerHTML).toEqual(expect.stringContaining('zzz Answer One'))
        expect(labels[2].innerHTML).toEqual(expect.stringContaining('Exclusive Answer'))
    })

    it('renders with no answer selected and allows multiple answers to be selected', () => {
        render(<DefaultCheckboxToTest/>)
        const checkboxOne = screen.getAllByRole('checkbox')[0]
        const checkboxTwo = screen.getAllByRole('checkbox')[1]
        
        expect(checkboxOne).not.toBeChecked()
        expect(checkboxTwo).not.toBeChecked()
        
        fireEvent.click(checkboxOne)
        expect(checkboxOne).toBeChecked()
        expect(checkboxTwo).not.toBeChecked()

        fireEvent.click(checkboxTwo)
        expect(checkboxOne).toBeChecked()
        expect(checkboxTwo).toBeChecked()

        fireEvent.click(checkboxOne)
        expect(checkboxOne).not.toBeChecked()
        expect(checkboxTwo).toBeChecked()

        fireEvent.click(checkboxTwo)
        expect(checkboxOne).not.toBeChecked()
        expect(checkboxTwo).not.toBeChecked()
    })
})