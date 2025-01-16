import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useForm, FormProvider } from "react-hook-form";
import TextArea from './textArea';

type FormValues = {testValue: string}

describe('TextArea component', () => {
    it('renders correctly when all attributes are specified', () => {
        const FreetextToTest = () => {
            const methods = useForm<FormValues>()
            return (
                <FormProvider {...methods}>
                    <TextArea
                        id='test-id'
                        label='test-label'
                        hint='test-hint'
                        errorMessage=''
                        formValue='testValue'
                        required='This is required.'
                        rows={10}
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
        const FreetextToTest = () => {
            const methods = useForm<FormValues>()
            return (
                <FormProvider {...methods}>
                    <TextArea
                        id='test-id'
                        errorMessage=''
                        formValue='testValue'
                        required='This is required.'
                        rows={10}
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
                    <TextArea
                        id='test-id'
                        errorMessage='test error'
                        formValue='testValue'
                        required='This is required.'
                        rows={10}
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