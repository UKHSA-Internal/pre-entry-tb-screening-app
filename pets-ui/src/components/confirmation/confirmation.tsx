import React from "react";
import { useNavigate } from "react-router-dom";

import Button from "@/components/button/button";
import { ButtonClass } from "@/utils/enums";

import Heading from "../heading/heading";
import LinkLabel from "../linkLabel/LinkLabel";

export interface ConfirmationProps {
  confirmationText: string;
  furtherInfo: Array<string | React.JSX.Element>;
  buttonText?: string;
  buttonLink?: string;
  whatHappensNext?: boolean;
  isSuccess?: boolean;
  showApplicationNumber?: boolean;
  applicationNumber?: string;
  preWhatHappensNextText?: string;
  postWhatHappensNextText?: string;
  showSearchForAnotherVisaApplicantLink?: boolean;
  actionButton?: {
    text: string;
    onClick: () => void;
  };
  secondaryButton?: {
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
  secondaryButton,
  showSearchForAnotherVisaApplicantLink = true,
  ...props
}: Readonly<ConfirmationProps>) {
  const navigate = useNavigate();

  return (
    <div>
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
            Your reference number
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
            class={ButtonClass.DEFAULT}
            text={actionButton.text}
            handleClick={actionButton.onClick}
          />
        </div>
      )}

      {secondaryButton && (
        <div className="confirmation-secondary-button">
          <Button
            id="secondary-button"
            class={ButtonClass.SECONDARY}
            text={secondaryButton.text}
            handleClick={secondaryButton.onClick}
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
          class={ButtonClass.DEFAULT}
          text={props.buttonText}
          handleClick={() => {
            navigate(props.buttonLink!);
          }}
        />
      )}
      <br />
      {showSearchForAnotherVisaApplicantLink && (
        <LinkLabel
          title="Search for another visa applicant"
          to="/search-for-visa-applicant"
          style={{ fontSize: "19px" }}
          externalLink={false}
        />
      )}
    </div>
  );
}
