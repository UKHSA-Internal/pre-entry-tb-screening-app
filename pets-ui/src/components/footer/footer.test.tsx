/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { describe, it, expect } from 'vitest'
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