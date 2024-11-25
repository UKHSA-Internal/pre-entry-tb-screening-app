import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useForm, FormProvider } from "react-hook-form";
import FreeText from './freeText'

const testRegex = {
    "lettersAndNumbers": /^[A-Za-z0-9]+$/,
}

type FormValues = {testValue: string}

describe('FreeText component', () => {
    it('renders correctly when all attributes are specified', () => {
        const FreetextToTest = () => {
            const methods = useForm<FormValues>()
            return (
                <FormProvider {...methods}>
                    <FreeText
                        id='test-id'
                        label='test-label'
                        hint='test-hint'
                        errorMessage=''
                        formValue='testValue'
                        required='This is required.'
                        patternValue={testRegex.lettersAndNumbers}
                        patternError='Pattern error'
                    />
                </FormProvider>
            )
        }
        render(<FreetextToTest/>)
        expect(screen.getByRole('textbox')).toBeTruthy()
        expect(screen.getByText('test-label')).toBeTruthy()
        expect(screen.getByText('test-hint')).toBeTruthy()
    })

    it('renders correctly when all optional attributes are omitted', () => {
        // render(<FreeText id='test-id' handleChange={handleChange} errorMessage=''/>)
        const FreetextToTest = () => {
            const methods = useForm<FormValues>()
            return (
                <FormProvider {...methods}>
                    <FreeText
                        id='test-id'
                        errorMessage=''
                        formValue='testValue'
                        required='This is required.'
                        patternValue={testRegex.lettersAndNumbers}
                        patternError='Pattern error'
                    />
                </FormProvider>
            )
        }
        render(<FreetextToTest/>)
        expect(screen.getByRole('textbox')).toBeTruthy()
        expect(screen.queryByText('test-label')).toBeNull()
        expect(screen.queryByText('test-hint')).toBeNull()
    })

    it('renders correctly when in an errored state', () => {
        const FreetextToTest = () => {
            const methods = useForm<FormValues>()
            return (
                <FormProvider {...methods}>
                    <FreeText
                        id='test-id'
                        errorMessage='test error'
                        formValue='testValue'
                        required='This is required.'
                        patternValue={testRegex.lettersAndNumbers}
                        patternError='Pattern error'
                    />
                </FormProvider>
            )
        }
        render(<FreetextToTest/>)
        expect(screen.getByRole('textbox')).toBeTruthy()
        expect(screen.queryByText('test-label')).toBeNull()
        expect(screen.queryByText('test-hint')).toBeNull()
        expect(screen.queryByText('test error')).toBeTruthy()
    })
})