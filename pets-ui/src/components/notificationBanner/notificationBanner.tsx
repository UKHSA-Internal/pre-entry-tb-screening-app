import { ReactNode } from "react";

import List from "../list/list";

interface NotificationBannerProps {
  bannerTitle: string;
  bannerText?: string;
  list?: string[];
  children?: ReactNode;
}

export default function NotificationBanner({
  bannerTitle,
  bannerText,
  list,
  children,
}: Readonly<NotificationBannerProps>) {
  return (
    <section
      className="govuk-notification-banner"
      aria-labelledby="govuk-notification-banner-title"
      data-module="govuk-notification-banner"
    >
      <div className="govuk-notification-banner__header">
        <h2 className="govuk-notification-banner__title" id="govuk-notification-banner-title">
          {bannerTitle}
        </h2>
      </div>
      <div className="govuk-notification-banner__content">
        {(bannerText || list) && (
          <>
            {bannerText && (
              <p className="govuk-body" style={{ display: "inline" }}>
                {bannerText}
              </p>
            )}
            {list && <List items={list} style={{ marginBottom: 0 }} />}
          </>
        )}
        {children}
      </div>
    </section>
  );
}
