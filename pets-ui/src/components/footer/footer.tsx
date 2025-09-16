import { useLocation } from "react-router-dom";

import { useAppDispatch } from "@/redux/hooks";
import {
  setAccessibilityStatementPreviousPage,
  setPrivacyNoticePreviousPage,
} from "@/redux/navigationSlice";

import LinkLabel from "../linkLabel/LinkLabel";

export default function Footer() {
  const location = useLocation();
  const dispatch = useAppDispatch();

  const handleAccessibilityStatementPreviousPage: React.MouseEventHandler<
    HTMLAnchorElement
  > = () => {
    dispatch(setAccessibilityStatementPreviousPage(location.pathname));
  };
  const handlePrivacyNoticePreviousPage: React.MouseEventHandler<HTMLAnchorElement> = () => {
    dispatch(setPrivacyNoticePreviousPage(location.pathname));
  };

  return (
    <footer className="govuk-footer">
      <div className="govuk-width-container">
        <div className="govuk-footer__meta">
          <div className="govuk-footer__meta-item govuk-footer__meta-item--grow">
            <h3 className="govuk-visually-hidden">Support links</h3>
            <ul className="govuk-footer__inline-list">
              <li className="govuk-footer__inline-list-item">
                <LinkLabel
                  title="Privacy"
                  className="govuk-footer__link"
                  to="/privacy-notice"
                  externalLink={false}
                  onClick={handlePrivacyNoticePreviousPage}
                />
              </li>
              <li className="govuk-footer__inline-list-item">
                <LinkLabel
                  title="Accessibility statement"
                  className="govuk-footer__link"
                  to="/accessibility-statement"
                  externalLink={false}
                  onClick={handleAccessibilityStatementPreviousPage}
                />
              </li>
            </ul>
            <span className="govuk-footer__licence-description">
              All content is available under the{" "}
              <LinkLabel
                title="Open Government Licence v3.0"
                className="govuk-footer__link"
                to="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
                externalLink
              />
              , except where otherwise stated
            </span>
          </div>
          <div className="footer-meta govuk-footer__meta-item">
            <img
              aria-hidden="true"
              alt=""
              src="assets/images/govuk-crest.svg"
              className="govuk-footer__licence-logo"
            ></img>
            <LinkLabel
              title="© Crown copyright"
              className="govuk-footer__link footer-copyright-logo"
              to="https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/"
              externalLink
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
