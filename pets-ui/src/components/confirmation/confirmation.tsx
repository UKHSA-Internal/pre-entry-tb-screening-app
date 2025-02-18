import Button from "@/components/button/button";
import { ButtonType } from "@/utils/enums";
import { useNavigate } from "react-router-dom";

export interface ConfirmationProps {
  confirmationText: string;
  furtherInfo: Array<string | JSX.Element>;
  buttonText: string;
  buttonLink: string;
}

export default function Confirmation(props: Readonly<ConfirmationProps>) {
  const navigate = useNavigate();
  return (
    <main className="govuk-main-wrapper govuk-main-wrapper--l" id="main-content" role="main">
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <div className="govuk-panel govuk-panel--confirmation">
            <h1 className="govuk-panel__title">{props.confirmationText}</h1>
          </div>
          <h2 className="govuk-heading-m">What happens next</h2>
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
    </main>
  );
}
