import { useNavigate } from "react-router-dom";

import Button from "@/components/button/button";
import { ButtonType } from "@/utils/enums";

import Heading from "../heading/heading";

export interface ConfirmationProps {
  confirmationText: string;
  furtherInfo: Array<string | JSX.Element>;
  buttonText: string;
  buttonLink: string;
  whatHappensNext?: boolean;
}

export default function Confirmation({
  whatHappensNext = false,
  ...props
}: Readonly<ConfirmationProps>) {
  const navigate = useNavigate();
  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <div className="govuk-panel govuk-panel--confirmation" style={{ marginBottom: 40 }}>
          <h1 className="govuk-panel__title" style={{ marginBlock: 30, marginInline: 20 }}>
            {props.confirmationText}
          </h1>
        </div>
        {whatHappensNext === true && <Heading level={2} size="m" title="What happens next" />}
        {props.furtherInfo.map((info, i) => {
          return (
            <p className="govuk-body" key={i}>
              {info}
            </p>
          );
        })}
        <Button
          id="continue"
          type={ButtonType.DEFAULT}
          text={props.buttonText}
          href={props.buttonLink}
          handleClick={() => {
            navigate(props.buttonLink);
          }}
        />
      </div>
    </div>
  );
}
