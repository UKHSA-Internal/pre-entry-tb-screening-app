import { PetsClinicService } from "@services/PetsClinicService";
import { getPetsClinics } from "@functions/getPetsClinics";
import { HTTPError } from "@models/HTTPError";
import { HTTPResponse } from "@models/HTTPResponse";
import clinics from "../resources/pets-clinics.json";


jest.mock("../../src/services/PetsClinicService");

describe("getPetsClinics Handler", () => {
    describe("Service returns data", () => {
        it("returns data on successful query", async () => {
            PetsClinicService.prototype.getAllPetsClinic = jest
                .fn()
                .mockImplementation(() => {
                    return Promise.resolve(clinics);
                });
            const res: HTTPResponse | HTTPError = await getPetsClinics();
            expect(res).toBeInstanceOf(HTTPResponse);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(JSON.stringify(clinics));
        });
    });

    describe("Service throws error", () => {
        it("should return the thrown error", async () => {
            const errorMessage = "Error";
            PetsClinicService.prototype.getAllPetsClinic = jest
                .fn()
                .mockImplementation(() => {
                    return Promise.reject(new HTTPError(300, errorMessage));
                });
            const res: HTTPResponse | HTTPError = await getPetsClinics();
            expect(res).toBeInstanceOf(HTTPError);
            expect(res.statusCode).toEqual(300);
            expect(res.body).toEqual(errorMessage);
        });
    });
});