/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Header from './header'

describe('Header component', () => {
    it('renders', () => {
        render(<Header/>)
        const header = screen.getByRole('banner')
        expect(header).toBeTruthy()
    })
})