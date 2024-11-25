import { describe, it, expect } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { useForm, FormProvider } from "react-hook-form";
import Radio, { RadioIsInline } from './radio'

type FormValues = {testValue: string}

const DefaultRadioToTest = () => {
    const methods = useForm<FormValues>()
    return (
        <FormProvider {...methods}>
            <Radio
                id='test-id'
                isInline={RadioIsInline.FALSE}
                answerOptions={['zzz Answer One', 'aaa Answer Two']}
                sortAnswersAlphabetically={false}
                errorMessage=''
                formValue='testValue'
                required='This is required.'
            />
        </FormProvider>
    )
}

describe('Radio component', () => {
    it('renders correctly when all optional props are specified', () => {
        const RadioToTest = () => {
            const methods = useForm<FormValues>()
            return (
                <FormProvider {...methods}>
                    <Radio
                        id='test-id'
                        legend='test-legend'
                        hint='test-hint'
                        isInline={RadioIsInline.FALSE}
                        answerOptions={['zzz Answer One', 'aaa Answer Two']}
                        sortAnswersAlphabetically={false}
                        errorMessage=''
                        formValue='testValue'
                        required='This is required.'
                    />
                </FormProvider>
            )
        }
        render(<RadioToTest/>)
        expect(screen.getAllByRole('radio')).toBeTruthy()
        expect(screen.getByText('test-legend')).toBeTruthy()
        expect(screen.getByText('test-hint')).toBeTruthy()
        expect(screen.getByText('zzz Answer One')).toBeTruthy()
        expect(screen.getByText('aaa Answer Two')).toBeTruthy()
    })

    it('renders correctly when all optional props are omitted', () => {
        render(<DefaultRadioToTest/>)
        expect(screen.getAllByRole('radio')).toBeTruthy()
        expect(screen.queryByText('test-legend')).toBeNull()
        expect(screen.queryByText('test-hint')).toBeNull()
        expect(screen.getByText('zzz Answer One')).toBeTruthy()
        expect(screen.getByText('aaa Answer Two')).toBeTruthy()
    })

    it('renders correctly when in an errored state', () => {
        const RadioToTest = () => {
            const methods = useForm<FormValues>()
            return (
                <FormProvider {...methods}>
                    <Radio
                        id='test-id'
                        isInline={RadioIsInline.FALSE}
                        answerOptions={['zzz Answer One', 'aaa Answer Two']}
                        sortAnswersAlphabetically={false}
                        errorMessage='test error'
                        formValue='testValue'
                        required='This is required.'
                    />
                </FormProvider>
            )
        }
        render(<RadioToTest/>)
        expect(screen.getAllByRole('radio')).toBeTruthy()
        expect(screen.queryByText('test-legend')).toBeNull()
        expect(screen.queryByText('test-hint')).toBeNull()
        expect(screen.queryByText('test error')).toBeTruthy()
        expect(screen.getByText('zzz Answer One')).toBeTruthy()
        expect(screen.getByText('aaa Answer Two')).toBeTruthy()
    })

    it('is not inline when props.isInline is FALSE', () => {
        const {container} = render(<DefaultRadioToTest/>)
        expect(container.getElementsByClassName('govuk-radios')).toHaveLength(1)
        expect(container.getElementsByClassName('govuk-radios--inline')).toHaveLength(0)
    })
    
    it('is inline when props.isInline is TRUE', () => {
        const RadioToTest = () => {
            const methods = useForm<FormValues>()
            return (
                <FormProvider {...methods}>
                    <Radio
                        id='test-id'
                        isInline={RadioIsInline.TRUE}
                        answerOptions={['zzz Answer One', 'aaa Answer Two']}
                        sortAnswersAlphabetically={false}
                        errorMessage=''
                        formValue='testValue'
                        required='This is required.'
                    />
                </FormProvider>
            )
        }
        const {container} = render(<RadioToTest/>)
        expect(container.getElementsByClassName('govuk-radios')).toHaveLength(1)
        expect(container.getElementsByClassName('govuk-radios--inline')).toHaveLength(1)
    })

    it('orders answers in the order specified when props.sortAnswersAlphabetically is false', () => {
        const {container} = render(<DefaultRadioToTest/>)
        const labels = container.getElementsByClassName('govuk-label govuk-radios__label')
        expect(labels[0].innerHTML).toEqual(expect.stringContaining('zzz Answer One'))
        expect(labels[1].innerHTML).toEqual(expect.stringContaining('aaa Answer Two'))
    })

    it('orders answers alphabetically when props.sortAnswersAlphabetically is true', () => {
        const RadioToTest = () => {
            const methods = useForm<FormValues>()
            return (
                <FormProvider {...methods}>
                    <Radio
                        id='test-id'
                        isInline={RadioIsInline.FALSE}
                        answerOptions={['zzz Answer One', 'aaa Answer Two']}
                        sortAnswersAlphabetically={true}
                        errorMessage=''
                        formValue='testValue'
                        required='This is required.'
                    />
                </FormProvider>
            )
        }
        const {container} = render(<RadioToTest/>)
        const labels = container.getElementsByClassName('govuk-label govuk-radios__label')
        expect(labels[0].innerHTML).toEqual(expect.stringContaining('aaa Answer Two'))
        expect(labels[1].innerHTML).toEqual(expect.stringContaining('zzz Answer One'))
    })

    it('renders with no answer selected and only selects a single answer at a time', () => {
        render(<DefaultRadioToTest/>)
        const radioOne = screen.getAllByRole('radio')[0]
        const radioTwo = screen.getAllByRole('radio')[1]
        
        expect(radioOne).not.toBeChecked()
        expect(radioTwo).not.toBeChecked()
        
        fireEvent.click(radioOne)
        expect(radioOne).toBeChecked()
        expect(radioTwo).not.toBeChecked()

        fireEvent.click(radioTwo)
        expect(radioOne).not.toBeChecked()
        expect(radioTwo).toBeChecked()

        fireEvent.click(radioOne)
        expect(radioOne).toBeChecked()
        expect(radioTwo).not.toBeChecked()
    })
})