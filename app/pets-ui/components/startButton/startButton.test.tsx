import React from 'react'
import { render, screen } from '@testing-library/react'
import StartButton from './startButton'

describe('Button component', () => {
    it('renders correctly', () => {
        render(<StartButton id='test-id' text='test-text-default' href='/test-href'/>)
        expect(screen.getByText('test-text-default')).toBeTruthy()

        const {container} = render(<StartButton id='test-id' text='test-text-default' href='/test-href'/>)
        expect(container.getElementsByClassName('govuk-button--start')).toHaveLength(1)
    })
})