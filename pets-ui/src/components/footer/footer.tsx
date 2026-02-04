import Heading from "../heading/heading";
import LinkLabel from "../linkLabel/LinkLabel";

export default function Footer() {
  return (
    <footer className="govuk-footer">
      <div className="govuk-width-container">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          focusable="false"
          viewBox="0 0 64 60"
          height="30"
          width="32"
          fill="currentcolor"
          className="govuk-footer__crown"
        >
          <g>
            <circle cx="20" cy="17.6" r="3.7"></circle>
            <circle cx="10.2" cy="23.5" r="3.7"></circle>
            <circle cx="3.7" cy="33.2" r="3.7"></circle>
            <circle cx="31.7" cy="30.6" r="3.7"></circle>
            <circle cx="43.3" cy="17.6" r="3.7"></circle>
            <circle cx="53.2" cy="23.5" r="3.7"></circle>
            <circle cx="59.7" cy="33.2" r="3.7"></circle>
            <circle cx="31.7" cy="30.6" r="3.7"></circle>
            <path d="M33.1,9.8c.2-.1.3-.3.5-.5l4.6,2.4v-6.8l-4.6,1.5c-.1-.2-.3-.3-.5-.5l1.9-5.9h-6.7l1.9,5.9c-.2.1-.3.3-.5.5l-4.6-1.5v6.8l4.6-2.4c.1.2.3.3.5.5l-2.6,8c-.9,2.8,1.2,5.7,4.1,5.7h0c3,0,5.1-2.9,4.1-5.7l-2.6-8ZM37,37.9s-3.4,3.8-4.1,6.1c2.2,0,4.2-.5,6.4-2.8l-.7,8.5c-2-2.8-4.4-4.1-5.7-3.8.1,3.1.5,6.7,5.8,7.2,3.7.3,6.7-1.5,7-3.8.4-2.6-2-4.3-3.7-1.6-1.4-4.5,2.4-6.1,4.9-3.2-1.9-4.5-1.8-7.7,2.4-10.9,3,4,2.6,7.3-1.2,11.1,2.4-1.3,6.2,0,4,4.6-1.2-2.8-3.7-2.2-4.2.2-.3,1.7.7,3.7,3,4.2,1.9.3,4.7-.9,7-5.9-1.3,0-2.4.7-3.9,1.7l2.4-8c.6,2.3,1.4,3.7,2.2,4.5.6-1.6.5-2.8,0-5.3l5,1.8c-2.6,3.6-5.2,8.7-7.3,17.5-7.4-1.1-15.7-1.7-24.5-1.7h0c-8.8,0-17.1.6-24.5,1.7-2.1-8.9-4.7-13.9-7.3-17.5l5-1.8c-.5,2.5-.6,3.7,0,5.3.8-.8,1.6-2.3,2.2-4.5l2.4,8c-1.5-1-2.6-1.7-3.9-1.7,2.3,5,5.2,6.2,7,5.9,2.3-.4,3.3-2.4,3-4.2-.5-2.4-3-3.1-4.2-.2-2.2-4.6,1.6-6,4-4.6-3.7-3.7-4.2-7.1-1.2-11.1,4.2,3.2,4.3,6.4,2.4,10.9,2.5-2.8,6.3-1.3,4.9,3.2-1.8-2.7-4.1-1-3.7,1.6.3,2.3,3.3,4.1,7,3.8,5.4-.5,5.7-4.2,5.8-7.2-1.3-.2-3.7,1-5.7,3.8l-.7-8.5c2.2,2.3,4.2,2.7,6.4,2.8-.7-2.3-4.1-6.1-4.1-6.1h10.6,0Z"></path>
          </g>
        </svg>
        <Heading title="More information" size="m" level={2} />
        <hr style={{ border: "none", borderTop: "1px solid #bbb", margin: "15px 0" }} />
        <div style={{ marginTop: "30px", marginBottom: "60px" }}>
          <LinkLabel
            title="UK tuberculosis technical instructions (opens in new tab)"
            className="govuk-footer__link"
            to="https://www.gov.uk/government/publications/uk-tuberculosis-technical-instructions"
            externalLink
            openInNewTab
          />
        </div>
        <hr style={{ border: "none", borderTop: "1px solid #bbb", margin: "15px 0" }} />
        <div className="govuk-footer__meta">
          <div className="govuk-footer__meta-item govuk-footer__meta-item--grow">
            <h2 className="govuk-visually-hidden">Support links</h2>
            <ul className="govuk-footer__inline-list">
              <li className="govuk-footer__inline-list-item">
                <LinkLabel
                  title="Privacy"
                  className="govuk-footer__link"
                  to="/privacy-notice"
                  externalLink={false}
                />
              </li>
              <li className="govuk-footer__inline-list-item">
                <LinkLabel
                  title="Cookies"
                  className="govuk-footer__link"
                  to="/cookies"
                  externalLink={false}
                />
              </li>
              <li className="govuk-footer__inline-list-item">
                <LinkLabel
                  title="Accessibility statement"
                  className="govuk-footer__link"
                  to="/accessibility-statement"
                  externalLink={false}
                />
              </li>
            </ul>
            <div style={{ marginTop: "20px" }}>
              Built by{" "}
              <LinkLabel
                title="UK Health Security Agency"
                className="govuk-footer__link"
                to="https://www.gov.uk/government/organisations/uk-health-security-agency"
                externalLink
              />
            </div>
            <div style={{ marginTop: "20px" }}>
              <img
                aria-hidden="true"
                alt=""
                src="assets/images/open-license.svg"
                className="govuk-footer__licence-logo"
                style={{ display: "block", marginBottom: "10px" }}
              ></img>
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
