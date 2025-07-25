import React from "react";
import { useNavigate } from "react-router-dom";

import Button from "@/components/button/button";
import { ButtonType } from "@/utils/enums";

import Heading from "../heading/heading";

export interface ConfirmationProps {
  confirmationText: string;
  furtherInfo: Array<string | JSX.Element>;
  buttonText?: string;
  buttonLink?: string;
  whatHappensNext?: boolean;
  isSuccess?: boolean;
  showApplicationNumber?: boolean;
  applicationNumber?: string;
  preWhatHappensNextText?: string;
  postWhatHappensNextText?: string;
  actionButton?: {
    text: string;
    onClick: () => void;
  };
}

export default function Confirmation({
  whatHappensNext = false,
  isSuccess = true,
  showApplicationNumber = false,
  preWhatHappensNextText,
  postWhatHappensNextText,
  actionButton,
  ...props
}: Readonly<ConfirmationProps>) {
  const navigate = useNavigate();

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <div
          className={`govuk-panel confirmation-panel ${
            isSuccess
              ? "govuk-panel--confirmation"
              : "govuk-panel--warning confirmation-panel--warning"
          }`}
        >
          <h1 className="govuk-panel__title confirmation-panel__title">
            {props.confirmationText.split("\n").map((line, index) => (
              <React.Fragment key={line}>
                {line}
                {index < props.confirmationText.split("\n").length - 1 && <br />}
              </React.Fragment>
            ))}
          </h1>
          {showApplicationNumber && props.applicationNumber && (
            <div className="govuk-panel__body confirmation-panel__body">
              Certificate reference number
              <br />
              <strong className="confirmation-panel__reference-number">
                {props.applicationNumber}
              </strong>
            </div>
          )}
        </div>

        {preWhatHappensNextText && <p className="govuk-body">{preWhatHappensNextText}</p>}

        {whatHappensNext === true && <Heading level={2} size="m" title="What happens next" />}

        {postWhatHappensNextText && <p className="govuk-body">{postWhatHappensNextText}</p>}

        {actionButton && (
          <div className="confirmation-action-button">
            <Button
              id="action-button"
              type={ButtonType.DEFAULT}
              text={actionButton.text}
              handleClick={actionButton.onClick}
            />
          </div>
        )}

        {props.furtherInfo.map((info, i) => {
          return (
            <p className="govuk-body" key={"info" + i}>
              {info}
            </p>
          );
        })}
        {props.buttonText && props.buttonLink && (
          <Button
            id="continue"
            type={ButtonType.DEFAULT}
            text={props.buttonText}
            handleClick={() => {
              navigate(props.buttonLink!);
            }}
          />
        )}
      </div>
    </div>
  );
}
