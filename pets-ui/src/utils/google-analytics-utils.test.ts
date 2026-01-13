import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  sendGoogleAnalyticsFormErrorEvent,
  sendGoogleAnalyticsHttpError,
  sendGoogleAnalyticsJourneyEvent,
  setGoogleAnalyticsParams,
  updateGoogleAnalyticsConsent,
} from "./google-analytics-utils";

describe("Google Analytics utilities", () => {
  let gtagMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    gtagMock = vi.fn();
    globalThis.gtag = gtagMock as unknown as (...args: unknown[]) => void;
  });

  describe("updateGoogleAnalyticsConsent", () => {
    it("calls gtag with granted values when consent is true", () => {
      updateGoogleAnalyticsConsent(true);

      expect(gtagMock).toHaveBeenCalledWith("consent", "update", {
        ad_storage: "granted",
        analytics_storage: "granted",
        functionality_storage: "granted",
        personalization_storage: "granted",
      });
    });

    it("calls gtag with denied values when consent is false", () => {
      updateGoogleAnalyticsConsent(false);

      expect(gtagMock).toHaveBeenCalledWith("consent", "update", {
        ad_storage: "denied",
        analytics_storage: "denied",
        functionality_storage: "denied",
        personalization_storage: "denied",
      });
    });

    it("does nothing when gtag is not a function", () => {
      globalThis.gtag = undefined as never;

      updateGoogleAnalyticsConsent(true);

      expect(gtagMock).not.toHaveBeenCalled();
    });
  });

  describe("sendGoogleAnalyticsJourneyEvent", () => {
    it("sends the correct journey event", () => {
      sendGoogleAnalyticsJourneyEvent("applicant_details", "123", "Visa Applicant Details");

      expect(gtagMock).toHaveBeenCalledWith("event", "applicant_details", {
        journey_id: "123",
        journey_type: "Visa Applicant Details",
      });
    });

    it("does nothing when gtag is missing", () => {
      globalThis.gtag = undefined as never;

      sendGoogleAnalyticsJourneyEvent("applicant_details", "123", "Visa Applicant Details");

      expect(gtagMock).not.toHaveBeenCalled();
    });
  });

  describe("sendGoogleAnalyticsFormErrorEvent", () => {
    it("sends a form validation error event", () => {
      sendGoogleAnalyticsFormErrorEvent("applicant_details", ["name", "dateOfBirth"]);

      expect(gtagMock).toHaveBeenCalledWith("event", "form_validation_error", {
        page: "applicant_details",
        validation_failures: ["name", "dateOfBirth"],
      });
    });

    it("does nothing if gtag is missing", () => {
      globalThis.gtag = undefined as never;

      sendGoogleAnalyticsFormErrorEvent("applicant_details", ["name", "dateOfBirth"]);

      expect(gtagMock).not.toHaveBeenCalled();
    });
  });

  describe("sendGoogleAnalyticsHttpError", () => {
    it("sends a http error event", () => {
      sendGoogleAnalyticsHttpError(501, "/error-url");

      expect(gtagMock).toHaveBeenCalledWith("event", "http_error", {
        request_url: "/error-url",
        status_code: 501,
      });
    });

    it("does nothing if gtag is missing", () => {
      globalThis.gtag = undefined as never;

      sendGoogleAnalyticsHttpError(501, "/error-url");

      expect(gtagMock).not.toHaveBeenCalled();
    });
  });

  describe("setGoogleAnalyticsParams", () => {
    it("sets the param with provided value", () => {
      setGoogleAnalyticsParams("user_role", "admin");

      expect(gtagMock).toHaveBeenCalledWith("set", "user_role", "admin");
    });

    it("sets the param with undefined when params not provided", () => {
      setGoogleAnalyticsParams("theme");

      expect(gtagMock).toHaveBeenCalledWith("set", "theme", undefined);
    });

    it("does nothing when gtag is not a function", () => {
      globalThis.gtag = undefined as never;

      setGoogleAnalyticsParams("x", "y");

      expect(gtagMock).not.toHaveBeenCalled();
    });
  });
});
