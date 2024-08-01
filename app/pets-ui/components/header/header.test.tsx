import React from 'react'
import { render, screen } from '@testing-library/react'
import Header from './header'

describe('Header component', () => {
    it('renders', () => {
        render(<Header/>)
        const header = screen.getByRole('banner')
        expect(header).toBeTruthy()
    })
})