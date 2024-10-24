import mockContext, { Context } from "aws-lambda";
import { PetsApplicantService } from "@/service/PetsApplicantService";
import { getPetsApplicant } from "@/functions/getPetsApplicant";
import { HTTPResponse } from "@models/HTTPResponse";
import { HTTPError } from "@/models/HTTPError";
import { ERRORS } from "@utils/Enum";
import applicants from "../resources/pets-applicant-test.json"

const ctx = mockContext as Context;
jest.mock("../../src/service/PetsApplicantService");

describe("getPetsApplicant Handler", () => {
    describe("with a valid event", () => {
        it("returns data on successful query", async () => {
            const mockFunction = () => {
                return Promise.resolve(applicants[0]);
            };

            PetsApplicantService.prototype.getPetsApplicant = jest
                .fn()
                .mockImplementation(mockFunction);

            const event = { queryStringParameters: {passportNumber: "123", countryOfIssue: "India"} };
            const res: HTTPResponse = await getPetsApplicant(event, ctx, () => {
                return;
            });

            expect(res).toBeInstanceOf(HTTPResponse);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(JSON.stringify(applicants[0]));
        });
        it("throws http error on failed query", async () => {
            const errorMessage = "Bad thing happened";
            PetsApplicantService.prototype.getPetsApplicant = jest
                .fn()
                .mockImplementation(() => {
                    return Promise.reject(new HTTPError(418, errorMessage));
                });
            const event = { queryStringParameters: {passportNumber: "123", countryOfIssue: "India"} };
            try {
                await getPetsApplicant(event, ctx, () => {
                    return;
                });
            } catch (e) {
                expect(e).toBeInstanceOf(HTTPError);
                expect((e as HTTPError).statusCode).toEqual(418);
                expect((e as HTTPError).body).toEqual(errorMessage);
            }
        });
        it("throws 500 error", async () => {
            const errorMessage = "Random Error";
            PetsApplicantService.prototype.getPetsApplicant = jest
                .fn()
                .mockImplementation(() => {
                    return Promise.reject(new Error(errorMessage));
                });
            const event = { queryStringParameters: {passportNumber: "123", countryOfIssue: "India"} };
            try {
                await getPetsApplicant(event, ctx, () => {
                    return;
                });
            } catch (e) {
                expect(e).toBeInstanceOf(HTTPError);
                expect((e as HTTPError).statusCode).toEqual(500);
                expect((e as HTTPError).body).toEqual(ERRORS.INTERNAL_SERVER_ERROR);
            }
        });
    });

    describe("with an invalid event", () => {
        it("returns an error without invoking the service", async () => {
            const event = { invalid: true };
            try {
                await getPetsApplicant(event, ctx, () => {
                    return;
                });
            } catch (e) {
                expect(e).toBeInstanceOf(HTTPError);
                expect((e as HTTPError).statusCode).toEqual(400);
            }
        });
        it("triggers validation when query parameters are null", async () => {
            const event = { queryStringParameters: null };
            try {
                await getPetsApplicant(event, ctx, () => {
                    return;
                });
            } catch (e) {
                expect(e).toBeInstanceOf(HTTPError);
                expect((e as HTTPError).statusCode).toEqual(400);
            }
        });
        it("triggers validation when query parameters are null", async () => {
            const event = { queryStringParameters: {passportNumber: null, countryOfIssue: null} };
            try {
                await getPetsApplicant(event, ctx, () => {
                    return;
                });
            } catch (e) {
                expect(e).toBeInstanceOf(HTTPError);
                expect((e as HTTPError).statusCode).toEqual(400);
            }
        });
        it("triggers validation when query parameters are undefined", async () => {
            const event = { queryStringParameters: {passportNumber: undefined, countryOfIssue: undefined} };
            try {
                await getPetsApplicant(event, ctx, () => {
                    return;
                });
            } catch (e) {
                expect(e).toBeInstanceOf(HTTPError);
                expect((e as HTTPError).statusCode).toEqual(400);
            }
        });
        it("triggers validation when query parameters are empty string", async () => {
            const event = { queryStringParameters: {passportNumber: " ", countryOfIssue: " "} };
            try {
                await getPetsApplicant(event, ctx, () => {
                    return;
                });
            } catch (e) {
                expect(e).toBeInstanceOf(HTTPError);
                expect((e as HTTPError).statusCode).toEqual(400);
            }
        });
    })
})
