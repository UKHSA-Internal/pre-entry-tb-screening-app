/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import FreeText from './freeText'

const handleChange = () => {}

describe('FreeText component', () => {
    it('renders correctly when all attributes are specified', () => {
        render(<FreeText id='test-id' title='test-title' label='test-label' hint='test-hint' handleChange={handleChange} errorMessage=''/>)
        expect(screen.getByRole('textbox')).toBeTruthy()
        expect(screen.getByText('test-title')).toBeTruthy()
        expect(screen.getByText('test-label')).toBeTruthy()
        expect(screen.getByText('test-hint')).toBeTruthy()
    })

    it('renders correctly when all optional attributes are omitted', () => {
        render(<FreeText id='test-id' handleChange={handleChange} errorMessage=''/>)
        expect(screen.getByRole('textbox')).toBeTruthy()
        expect(screen.queryByText('test-title')).toBeNull()
        expect(screen.queryByText('test-label')).toBeNull()
        expect(screen.queryByText('test-hint')).toBeNull()
    })

    it('renders correctly when in an errored state', () => {
        render(<FreeText id='test-id' handleChange={handleChange} errorMessage='test error'/>)
        expect(screen.getByRole('textbox')).toBeTruthy()
        expect(screen.queryByText('test-title')).toBeNull()
        expect(screen.queryByText('test-label')).toBeNull()
        expect(screen.queryByText('test-hint')).toBeNull()
        expect(screen.queryByText('test error')).toBeTruthy()
    })
})