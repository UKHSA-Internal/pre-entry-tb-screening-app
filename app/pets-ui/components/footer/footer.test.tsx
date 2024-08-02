import React from 'react'
import { render, screen } from '@testing-library/react'
import Footer from './footer'

describe('Footer component', () => {
    it('renders', () => {
        render(<Footer/>)
        const footer = screen.getByRole('contentinfo')
        const text = screen.getByText('© Crown copyright')
        expect(footer).toBeTruthy()
        expect(text).toBeTruthy()
    })
})