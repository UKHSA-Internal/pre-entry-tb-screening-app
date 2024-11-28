/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StartButton from './startButton'

const handleClick = () => {}

describe('Button component', () => {
    it('renders correctly', () => {
        render(<StartButton id='test-id' text='test-text-default' href='/test-href' handleClick={handleClick}/>)
        expect(screen.getByText('test-text-default')).toBeTruthy()

        const {container} = render(<StartButton id='test-id' text='test-text-default' href='/test-href' handleClick={handleClick}/>)
        expect(container.getElementsByClassName('govuk-button--start')).toHaveLength(1)
    })
})