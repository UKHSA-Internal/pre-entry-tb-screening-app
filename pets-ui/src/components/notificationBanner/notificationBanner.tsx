import List from "../list/list";

interface NotificationBannerProps {
  bannerTitle: string;
  bannerText?: string;
  list?: string[];
}

export default function NotificationBanner({
  bannerTitle,
  bannerText,
  list,
}: NotificationBannerProps) {
  return (
    <div
      className="govuk-notification-banner"
      role="region"
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
          <div className="govuk-body">
            {bannerText && <span>{bannerText}</span>}
            {list && <List items={list} />}
          </div>
        )}
      </div>
    </div>
  );
}
