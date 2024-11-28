import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Button from './button'
import { ButtonType } from '@/utils/enums'

const handleClick = () => {}

describe('Button component', () => {
    it('renders correctly when button type is DEFAULT', () => {
        render(<Button id='test-id' text='test-text-default' href='/test-href' type={ButtonType.DEFAULT} handleClick={handleClick}/>)
        expect(screen.getByText('test-text-default')).toBeTruthy()

        const {container} = render(<Button id='test-id' text='test-text-default' href='/test-href' type={ButtonType.DEFAULT} handleClick={handleClick}/>)
        expect(container.getElementsByClassName('govuk-button')).toHaveLength(1)
        expect(container.getElementsByClassName('govuk-button--secondary')).toHaveLength(0)
        expect(container.getElementsByClassName('govuk-button--warning')).toHaveLength(0)
    })

    it('renders correctly when button type is SECONDARY', () => {
        render(<Button id='test-id' text='test-text-secondary' href='/test-href' type={ButtonType.SECONDARY} handleClick={handleClick}/>)
        expect(screen.getByText('test-text-secondary')).toBeTruthy()

        const {container} = render(<Button id='test-id' text='test-text-secondary' href='/test-href' type={ButtonType.SECONDARY} handleClick={handleClick}/>)
        expect(container.getElementsByClassName('govuk-button')).toHaveLength(1)
        expect(container.getElementsByClassName('govuk-button--secondary')).toHaveLength(1)
        expect(container.getElementsByClassName('govuk-button--warning')).toHaveLength(0)
    })

    it('renders correctly when button type is WARNING', () => {
        render(<Button id='test-id' text='test-text-warning' href='/test-href' type={ButtonType.WARNING} handleClick={handleClick}/>)
        expect(screen.getByText('test-text-warning')).toBeTruthy()

        const {container} = render(<Button id='test-id' text='test-text-warning' href='/test-href' type={ButtonType.WARNING} handleClick={handleClick}/>)
        expect(container.getElementsByClassName('govuk-button')).toHaveLength(1)
        expect(container.getElementsByClassName('govuk-button--secondary')).toHaveLength(0)
        expect(container.getElementsByClassName('govuk-button--warning')).toHaveLength(1)
    })
})