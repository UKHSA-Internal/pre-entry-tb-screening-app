import React from 'react'
import { render, screen } from '@testing-library/react'
import FreeText from './freeText'

describe('FreeText component', () => {
    it('renders correctly when all attributes are specified', () => {
        render(<FreeText id='test-id' title='test-title' label='test-label' hint='test-hint'/>)
        expect(screen.getByRole('textbox')).toBeTruthy()
        expect(screen.getByText('test-title')).toBeTruthy()
        expect(screen.getByText('test-label')).toBeTruthy()
        expect(screen.getByText('test-hint')).toBeTruthy()
    })

    it('renders correctly when all optional attributes are omitted', () => {
        render(<FreeText id='test-id'/>)
        expect(screen.getByRole('textbox')).toBeTruthy()
        expect(screen.queryByText('test-title')).toBeNull()
        expect(screen.queryByText('test-label')).toBeNull()
        expect(screen.queryByText('test-hint')).toBeNull()
    })
})