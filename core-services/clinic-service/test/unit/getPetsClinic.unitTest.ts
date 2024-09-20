import mockContext, { Context } from "aws-lambda";
import { PetsClinicService } from "@services/PetsClinicService";
import { getPetsClinic } from '@functions/getPetsClinic'
import { HTTPResponse } from "@models/HTTPResponse";
import { ERRORS, HTTP_RESPONSE } from "@utils/Enum";
import { Validator } from "@utils/Validator";
import clinics from "../resources/pets-clinics.json";

const ctx = mockContext as Context;
jest.mock("../../src/services/PetsClinicService");

describe("getPetsClinic Handler", () => {
    describe("with a valid event", () => {
        it("returns data on successful query", async () => {
            const clinic = clinics[0];
            const testPetsClinicId = "1";
            const mockFunction = (input: string) => {
                expect(input).toEqual(testPetsClinicId);
                return Promise.resolve(clinic);
            };

            PetsClinicService.prototype.getPetsClinic = jest
                .fn()
                .mockImplementation(mockFunction);

            const event = { pathParameters: { petsClinicId: testPetsClinicId } };
            const res: HTTPResponse = await getPetsClinic(event, ctx, () => {
                return;
            });

            expect(res).toBeInstanceOf(HTTPResponse);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(JSON.stringify(clinic));
        });
    
        it("throws http error on failed query", async () => {
            const errorMessage = "Bad thing happened";
            PetsClinicService.prototype.getPetsClinic = jest
                .fn()
                .mockImplementation(() => {
                    return Promise.reject(new HTTPError(418, errorMessage));
                });
            const event = { pathParameters: { petsClinicId: "1" } };
            try {
                await getPetsClinic(event, ctx, () => {
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
            PetsClinicService.prototype.getPetsClinic = jest
                .fn()
                .mockImplementation(() => {
                    return Promise.reject(new Error(errorMessage));
                });
            const event = { pathParameters: { petsClinicId: "1" } };
            try {
                await getPetsClinic(event, ctx, () => {
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
                await getPetsClinic(event, ctx, () => {
                    return;
                });
            } catch (e) {
                expect(e).toBeInstanceOf(HTTPError);
                expect((e as HTTPError).statusCode).toEqual(400);
            }
        });
        it("triggers validation when path parameters is null", async () => {
            const event = { pathParameters: null };
            try {
                await getPetsClinic(event, ctx, () => {
                    return;
                });
            } catch (e) {
                expect(e).toBeInstanceOf(HTTPError);
                expect((e as HTTPError).statusCode).toEqual(400);
            }
        });
        it("triggers validation when path parameters petsClinicId is null", async () => {
            const event = { pathParameters: { petsClinicId: null } };
            try {
                await getPetsClinic(event, ctx, () => {
                    return;
                });
            } catch (e) {
                expect(e).toBeInstanceOf(HTTPError);
                expect((e as HTTPError).statusCode).toEqual(400);
            }
        });
        it("triggers validation when path parameters petsClinicId is undefined", async () => {
            const event = { pathParameters: { petsClinicId: undefined } };
            try {
                await getPetsClinic(event, ctx, () => {
                    return;
                });
            } catch (e) {
                expect(e).toBeInstanceOf(HTTPError);
                expect((e as HTTPError).statusCode).toEqual(400);
            }
        });
        it("triggers validation when path parameters petsClinicId is empty string", async () => {
            const event = { pathParameters: { petsClinicId: " " } };
            try {
                await getPetsClinic(event, ctx, () => {
                    return;
                });
            } catch (e) {
                expect(e).toBeInstanceOf(HTTPError);
                expect((e as HTTPError).statusCode).toEqual(400);
            }
        });
    })
})
