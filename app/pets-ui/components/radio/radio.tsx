'use client'

export enum RadioIsInline {
    TRUE = "govuk-radios govuk-radios--inline",
    FALSE = "govuk-radios",
}

export interface RadioProps {
    id: string;
    title?: string;
    legend?: string;
    hint?: string;
    isInline: RadioIsInline;
    answerOptions: string[];
    sortAnswersAlphabetically: boolean;
}

export default function Radio(props: Readonly<RadioProps>) {
    
    const stringToJsxAttribute = (input: string) => {
        return input.toLowerCase().replaceAll(" ", "-").replace(/[^a-z 0-9-]/g, "")
    }
    
    let radioInputName: string = "undefined";
    if (props.title) {radioInputName = stringToJsxAttribute(props.title)}
    else if (props.legend) {radioInputName = stringToJsxAttribute(props.legend)}

    let answerOptions: string[] = []
    if (!props.sortAnswersAlphabetically) {
        answerOptions = props.answerOptions
    } else {
        props.answerOptions.sort((a, b) => a.localeCompare(b))
    }
    
    return (
        <div id={props.id} className="govuk-form-group">
            <fieldset className="govuk-fieldset">
                {props.title && 
                    <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                        <h1 className="govuk-fieldset__heading">
                            {props.title}
                        </h1>
                    </legend>
                }
                {props.legend && 
                    <legend className="govuk-fieldset__legend">
                        {props.legend}
                    </legend>
                }
                {props.hint &&
                    <div id="changedName-hint" className="govuk-hint">
                        {props.hint}
                    </div>
                }
                <div className={props.isInline} data-module="govuk-radios">
                    {answerOptions.map((answerOption: string, index: number) => (
                        <div className="govuk-radios__item" key={`answer-option-${index + 1}`}>
                            <input
                                className="govuk-radios__input"
                                name={radioInputName}
                                type="radio"
                                value={stringToJsxAttribute(answerOption)}
                            />
                            <label className="govuk-label govuk-radios__label" htmlFor={props.id}>
                                {answerOption}
                            </label>
                        </div>
                    ))}
                </div>
            </fieldset>
        </div>
    )
}