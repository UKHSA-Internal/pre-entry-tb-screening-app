import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Date from './date'


describe('Date Component', () => {
    it('renders correctly when all optional props are specified', () => {
        render(<Date
            id="passport-issue-date"
            title="Issue Date"
            hint="For example, 31 3 2019"
            legend="Test legend"
            autocomplete={false}
        />)
        expect(screen.getAllByRole('textbox')).toBeTruthy()
        expect(screen.getByText('Issue Date')).toBeTruthy()
        expect(screen.getByText('For example, 31 3 2019')).toBeTruthy()
        expect(screen.getByText('Test legend')).toBeTruthy()
    })

    it('renders correctly when all optional props are omitted', () => {
        render(<Date
            id="passport-issue-date"
            autocomplete={false}
        />)
        expect(screen.getAllByRole('textbox')).toBeTruthy()
        expect(screen.queryByText('Issue Date')).toBeNull()
        expect(screen.queryByText('tFor example, 31 3 2019')).toBeNull()
        expect(screen.queryByText('Test legend')).toBeNull()
    })

    it('does not set bday autocomplete when autocomplete is false', () => {
        const { container } = render(<Date id="passport-issue-date" autocomplete={false}/>)
        const dateInputs = container.getElementsByClassName('govuk-input')
        expect(dateInputs.length).toBe(3);
        expect(dateInputs[0].getAttribute("autocomplete")).toBeNull();
        expect(dateInputs[1].getAttribute("autocomplete")).toBeNull();
        expect(dateInputs[2].getAttribute("autocomplete")).toBeNull();
    })

    it('sets bday autocomplete when autocomplete prop is true', () => {
        const { container } = render(<Date id="passport-issue-date" autocomplete={true}/>)
        expect(container.getElementsByClassName('govuk-input').length).toBe(3);
        const dayInput = container.querySelector('[autocomplete="bday-day"]');
        const monthInput = container.querySelector('[autocomplete="bday-month"]');
        const yearInput = container.querySelector('[autocomplete="bday-year"]');
        expect(dayInput).toHaveClass('govuk-input--width-2')
        expect(monthInput).toHaveClass('govuk-input--width-2')
        expect(yearInput).toHaveClass('govuk-input--width-4')
    })
})
