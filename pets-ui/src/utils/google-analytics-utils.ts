const updateGoogleAnalyticsConsent = (consentGranted: boolean) => {
  if (typeof globalThis.gtag === "function") {
    globalThis.gtag("consent", "update", {
      ad_storage: consentGranted ? "granted" : "denied",
      analytics_storage: consentGranted ? "granted" : "denied",
      functionality_storage: consentGranted ? "granted" : "denied",
      personalization_storage: consentGranted ? "granted" : "denied",
    });
  }
};

const sendGoogleAnalyticsJourneyEvent = (
  pageTitle: string,
  journeyId: string,
  journeyType: string,
) => {
  if (typeof globalThis.gtag === "function") {
    globalThis.gtag("event", pageTitle, {
      journey_id: journeyId,
      journey_type: journeyType,
    });
  }
};

const sendGoogleAnalyticsFormErrorEvent = (pageTitle: string, errorList: string[]) => {
  if (typeof globalThis.gtag === "function") {
    globalThis.gtag("event", "form_validation_error", {
      page: pageTitle,
      validation_failures: errorList,
    });
  }
};

const setGoogleAnalyticsParams = (paramName: string, params?: unknown) => {
  if (typeof globalThis.gtag === "function") {
    globalThis.gtag("set", paramName, params);
  }
};

export {
  sendGoogleAnalyticsFormErrorEvent,
  sendGoogleAnalyticsJourneyEvent,
  setGoogleAnalyticsParams,
  updateGoogleAnalyticsConsent,
};
