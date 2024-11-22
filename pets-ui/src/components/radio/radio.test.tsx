/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { describe, it, expect } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import Radio, { RadioIsInline } from './radio'

const handleChange = () => {}

describe('Radio component', () => {
    it('renders correctly when all optional props are specified', () => {
        render(<Radio id='test-id' title='test-title' legend='test-legend' hint='test-hint' isInline={RadioIsInline.FALSE} answerOptions={['zzz Answer One', 'aaa Answer Two']} sortAnswersAlphabetically={false} handleChange={handleChange} errorMessage=''/>)
        expect(screen.getAllByRole('radio')).toBeTruthy()
        expect(screen.getByText('test-title')).toBeTruthy()
        expect(screen.getByText('test-legend')).toBeTruthy()
        expect(screen.getByText('test-hint')).toBeTruthy()
    })

    it('renders correctly when all optional props are omitted', () => {
        render(<Radio id='test-id' isInline={RadioIsInline.FALSE} answerOptions={['zzz Answer One', 'aaa Answer Two']} sortAnswersAlphabetically={false} handleChange={handleChange} errorMessage=''/>)
        expect(screen.getAllByRole('radio')).toBeTruthy()
        expect(screen.queryByText('test-title')).toBeNull()
        expect(screen.queryByText('test-legend')).toBeNull()
        expect(screen.queryByText('test-hint')).toBeNull()
    })

    it('renders correctly when in an errored state', () => {
        render(<Radio id='test-id' isInline={RadioIsInline.FALSE} answerOptions={['zzz Answer One', 'aaa Answer Two']} sortAnswersAlphabetically={false} handleChange={handleChange} errorMessage='test error'/>)
        expect(screen.getAllByRole('radio')).toBeTruthy()
        expect(screen.queryByText('test-title')).toBeNull()
        expect(screen.queryByText('test-legend')).toBeNull()
        expect(screen.queryByText('test-hint')).toBeNull()
        expect(screen.queryByText('test error')).toBeTruthy()
    })

    it('is not inline when props.isInline is FALSE', () => {
        const {container} = render(<Radio id='test-id' isInline={RadioIsInline.FALSE} answerOptions={['zzz Answer One', 'aaa Answer Two']} sortAnswersAlphabetically={false} handleChange={handleChange} errorMessage=''/>)
        expect(container.getElementsByClassName('govuk-radios')).toHaveLength(1)
        expect(container.getElementsByClassName('govuk-radios--inline')).toHaveLength(0)
    })
    
    it('is inline when props.isInline is TRUE', () => {
        const {container} = render(<Radio id='test-id' isInline={RadioIsInline.TRUE} answerOptions={['zzz Answer One', 'aaa Answer Two']} sortAnswersAlphabetically={false} handleChange={handleChange} errorMessage=''/>)
        expect(container.getElementsByClassName('govuk-radios')).toHaveLength(1)
        expect(container.getElementsByClassName('govuk-radios--inline')).toHaveLength(1)
    })

    it('orders answers in the order specified when props.sortAnswersAlphabetically is false', () => {
        const {container} = render(<Radio id='test-id' isInline={RadioIsInline.FALSE} answerOptions={['zzz Answer One', 'aaa Answer Two']} sortAnswersAlphabetically={false} handleChange={handleChange} errorMessage=''/>)
        const labels = container.getElementsByClassName('govuk-label govuk-radios__label')
        expect(labels[0].innerHTML).toEqual(expect.stringContaining('zzz Answer One'))
        expect(labels[1].innerHTML).toEqual(expect.stringContaining('aaa Answer Two'))
    })

    it('orders answers alphabetically when props.sortAnswersAlphabetically is true', () => {
        const {container} = render(<Radio id='test-id' isInline={RadioIsInline.FALSE} answerOptions={['zzz Answer One', 'aaa Answer Two']} sortAnswersAlphabetically={true} handleChange={handleChange} errorMessage=''/>)
        const labels = container.getElementsByClassName('govuk-label govuk-radios__label')
        expect(labels[0].innerHTML).toEqual(expect.stringContaining('aaa Answer Two'))
        expect(labels[1].innerHTML).toEqual(expect.stringContaining('zzz Answer One'))
    })

    it('renders with no answer selected and only selects a single answer at a time', () => {
        render(<Radio id='test-id' isInline={RadioIsInline.FALSE} answerOptions={['zzz Answer One', 'aaa Answer Two']} sortAnswersAlphabetically={false} handleChange={handleChange} errorMessage=''/>)
        const radioOne = screen.getAllByRole('radio')[0]
        const radioTwo = screen.getAllByRole('radio')[1]
        
        expect(radioOne).not.toBeChecked()
        expect(radioTwo).not.toBeChecked()
        
        fireEvent.click(radioOne)
        expect(radioOne).toBeChecked()
        expect(radioTwo).not.toBeChecked()

        fireEvent.click(radioTwo)
        expect(radioOne).not.toBeChecked()
        expect(radioTwo).toBeChecked()

        fireEvent.click(radioOne)
        expect(radioOne).toBeChecked()
        expect(radioTwo).not.toBeChecked()
    })
})