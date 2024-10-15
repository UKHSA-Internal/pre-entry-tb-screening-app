import React from 'react'
import { render, screen } from '@testing-library/react'
import Button, { ButtonType } from './button'

describe('Button component', () => {
    it('renders correctly when button type is DEFAULT', () => {
        render(<Button id='test-id' text='test-text-default' href='/test-href' type={ButtonType.DEFAULT}/>)
        expect(screen.getByText('test-text-default')).toBeTruthy()

        const {container} = render(<Button id='test-id' text='test-text-default' href='/test-href' type={ButtonType.DEFAULT}/>)
        expect(container.getElementsByClassName('govuk-button')).toHaveLength(1)
        expect(container.getElementsByClassName('govuk-button--secondary')).toHaveLength(0)
        expect(container.getElementsByClassName('govuk-button--warning')).toHaveLength(0)
    })

    it('renders correctly when button type is SECONDARY', () => {
        render(<Button id='test-id' text='test-text-secondary' href='/test-href' type={ButtonType.SECONDARY}/>)
        expect(screen.getByText('test-text-secondary')).toBeTruthy()

        const {container} = render(<Button id='test-id' text='test-text-secondary' href='/test-href' type={ButtonType.SECONDARY}/>)
        expect(container.getElementsByClassName('govuk-button')).toHaveLength(1)
        expect(container.getElementsByClassName('govuk-button--secondary')).toHaveLength(1)
        expect(container.getElementsByClassName('govuk-button--warning')).toHaveLength(0)
    })

    it('renders correctly when button type is WARNING', () => {
        render(<Button id='test-id' text='test-text-warning' href='/test-href' type={ButtonType.WARNING}/>)
        expect(screen.getByText('test-text-warning')).toBeTruthy()

        const {container} = render(<Button id='test-id' text='test-text-warning' href='/test-href' type={ButtonType.WARNING}/>)
        expect(container.getElementsByClassName('govuk-button')).toHaveLength(1)
        expect(container.getElementsByClassName('govuk-button--secondary')).toHaveLength(0)
        expect(container.getElementsByClassName('govuk-button--warning')).toHaveLength(1)
    })
})