import mockContext, { Context } from "aws-lambda";
import { PetsApplicantService } from "@/service/PetsApplicantService";
import { postPetsApplicant } from "@/functions/postPetsApplicant";
import { HTTPResponse } from "@models/HTTPResponse";
import { HTTPError } from "@/models/HTTPError";
import { ERRORS } from "@utils/Enum";

const ctx = mockContext as Context;
jest.mock("../../src/service/PetsApplicantService");

describe("postPetsApplicant Handler", () => {
    describe("with a valid event", () => {
        it("returns data on successful query", async () => {
            const mockFunction = () => {
                return Promise.resolve("Data successfully posted");
            };

            PetsApplicantService.prototype.putPetsApplicant = jest
                .fn()
                .mockImplementation(mockFunction);

            const event = {
                body: {
                    "fullName": "Jonathon Doe",
                    "dateOfBirth": {
                        "day": "31",
                        "month": "12",
                        "year": "1901",
                    }
                }
            };
            const res: HTTPResponse = await postPetsApplicant(event, ctx, () => {
                return;
            });

            expect(res).toBeInstanceOf(HTTPResponse);
            expect(res.statusCode).toEqual(200);
        });
        it("throws http error on failed query", async () => {
            const errorMessage = "Bad thing happened";
            PetsApplicantService.prototype.putPetsApplicant = jest
                .fn()
                .mockImplementation(() => {
                    return Promise.reject(new HTTPError(418, errorMessage));
                });
            const event = { body: {"fullName": "Jonathon Doe"} };
            try {
                await postPetsApplicant(event, ctx, () => {
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
            PetsApplicantService.prototype.putPetsApplicant = jest
                .fn()
                .mockImplementation(() => {
                    return Promise.reject(new Error(errorMessage));
                });
            const event = { body: {"fullName": "Jonathon Doe"} };
            try {
                await postPetsApplicant(event, ctx, () => {
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
                await postPetsApplicant(event, ctx, () => {
                    return;
                });
            } catch (e) {
                expect(e).toBeInstanceOf(HTTPError);
                expect((e as HTTPError).statusCode).toEqual(400);
            }
        });
        it("triggers validation when request body is null", async () => {
            const event = { body: null };
            try {
                await postPetsApplicant(event, ctx, () => {
                    return;
                });
            } catch (e) {
                expect(e).toBeInstanceOf(HTTPError);
                expect((e as HTTPError).statusCode).toEqual(400);
            }
        });
        it("triggers validation when body.fullName is null", async () => {
            const event = { body: { fullName: null } };
            try {
                await postPetsApplicant(event, ctx, () => {
                    return;
                });
            } catch (e) {
                expect(e).toBeInstanceOf(HTTPError);
                expect((e as HTTPError).statusCode).toEqual(400);
            }
        });
        it("triggers validation when body.fullName is undefined", async () => {
            const event = { body: { fullName: undefined } };
            try {
                await postPetsApplicant(event, ctx, () => {
                    return;
                });
            } catch (e) {
                expect(e).toBeInstanceOf(HTTPError);
                expect((e as HTTPError).statusCode).toEqual(400);
            }
        });
        it("triggers validation when body.fullName is empty string", async () => {
            const event = { body: { fullName: " " } };
            try {
                await postPetsApplicant(event, ctx, () => {
                    return;
                });
            } catch (e) {
                expect(e).toBeInstanceOf(HTTPError);
                expect((e as HTTPError).statusCode).toEqual(400);
            }
        });
    })
})
