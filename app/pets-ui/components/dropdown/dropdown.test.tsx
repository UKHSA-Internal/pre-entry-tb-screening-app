import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Dropdown from './dropdown'


const testOptions = [
    {
        label: "test1",
        value: "testval1"
    },
    {
        label: "test2",
        value: "testval2"
    }
]
describe('Dropdown component', () => {
    it('renders correctly when all optional props are specified', () => {
        render(<Dropdown id="test-id" name="test-name" options={testOptions} label="Test label" hint="test hint"/>)
        expect(screen.getAllByRole('option')).toBeTruthy();
        expect(screen.getByText('test1')).toBeTruthy();
        expect(screen.getByText('test2')).toBeTruthy();
        expect(screen.getByText('Test label')).toBeTruthy();
    })

    it('renders correctly when all optional props are omitted', () => {
        render(<Dropdown id="test-id" name="test-name" options={testOptions}/>)
        expect(screen.getAllByRole('option')).toBeTruthy();
        expect(screen.getByText('test1')).toBeTruthy();
        expect(screen.getByText('test2')).toBeTruthy();
    })

    it('renders with default value and only updates selected value on change event', () => {
        const {container} = render(<Dropdown id="test-id" name="test-name" options={testOptions} label="Test label" hint="test hint"/>)
        const select = screen.getAllByRole('combobox')[0]
        
        let selectedValue = (container.getElementsByClassName('govuk-select')[0] as HTMLSelectElement).value
        expect(selectedValue).toBe('choose')
        
        fireEvent.change(select, {
            target: { value: "testval1"}
        })
        selectedValue = (container.getElementsByClassName('govuk-select')[0] as HTMLSelectElement).value
        expect(selectedValue).toBe('testval1')

        fireEvent.change(select, {
            target: { value: "testval2"}
        })
        selectedValue = (container.getElementsByClassName('govuk-select')[0] as HTMLSelectElement).value
        expect(selectedValue).toBe('testval2')
    })
})
