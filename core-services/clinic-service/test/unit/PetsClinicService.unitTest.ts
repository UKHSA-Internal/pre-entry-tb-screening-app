import { HTTPError } from "@models/HTTPError";
import { ERRORS } from "@utils/Enum";
import { IPetsClinic } from "@models/IPetsClinic";
import { PetsClinicService } from "@services/PetsClinicService";
import clinics from "../resources/pets-clinics.json";


describe("PetsClinicService", () => {
    beforeEach(() => {
        jest.resetModules();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe("getAllPetsClinic", () => {
        it("returns data on successful query", async () => {
            const PetsClinicDAOMock = getPetsClinicDAOMock(clinics, 4, 4);
            const petsClinicService = new PetsClinicService(
                new PetsClinicDAOMock()
            );
            return petsClinicService
                .getAllPetsClinic()
                .then((returnedRecords: any) => {
                    expect(returnedRecords.length).toEqual(4);
                });
        });
    
        it("returns 404 on empty clnics", async () => {
            const PetsClinicDAOMock = getPetsClinicDAOMock([], 0, 0);
            const petsClinicService = new PetsClinicService(
                new PetsClinicDAOMock()
            );
            return petsClinicService
                .getAllPetsClinic()
                .catch((errorResponse: any) => {
                    expect(errorResponse).toBeInstanceOf(HTTPError);
                    expect(errorResponse.statusCode).toEqual(404);
                    expect(errorResponse.body).toEqual(
                        ERRORS.RESOURCE_NOT_FOUND
                    );
                });
        });

        it("throws HTTP error on failed query", async () => {
            const PetsClinicDAOMock = getPetsClinicHttpErrorMock(400, "Bad Request");
            const petsClinicService = new PetsClinicService(
                new PetsClinicDAOMock()
            );
            return petsClinicService
                .getAllPetsClinic()
                .then(() => {
                    return;
                })
                .catch((errorResponse: any) => {
                    expect(errorResponse).toBeInstanceOf(HTTPError);
                    expect(errorResponse.statusCode).toEqual(400);
                    expect(errorResponse.body).toEqual("Bad Request");
                });
        });

        it("throws 500 on failed query", async () => {
            const PetsClinicDAOMock = getPetsClinicErrorMock();
            const petsClinicService = new PetsClinicService(
                new PetsClinicDAOMock()
            );
            return petsClinicService
                .getAllPetsClinic()
                .then(() => {
                    return;
                })
                .catch((errorResponse: any) => {
                    expect(errorResponse).toBeInstanceOf(HTTPError);
                    expect(errorResponse.statusCode).toEqual(500);
                    expect(errorResponse.body).toEqual("Internal Server Error");
                });
        });
    });

    describe("getPetsClinic", () => {
        it("returns data on successful query", async () => {
            const PetsClinicDAOMock = getPetsClinicDAOMock(clinics);
            const petsClinicService = new PetsClinicService(
                new PetsClinicDAOMock()
            );

            const returnedRecords: IPetsClinic =
            (await petsClinicService.getPetsClinic(
              "1"
            )) as IPetsClinic;
            expect(returnedRecords).not.toBeNull();
            expect(returnedRecords.petsClinicId).toEqual("1");
            expect(returnedRecords.petsClinicName).toEqual("Q-Life Family clinic");
        });
    
        it("returns 404 when clinic not found", async () => {
            const PetsClinicDAOMock = getPetsClinicHttpErrorMock(404, ERRORS.RESOURCE_NOT_FOUND);
            const petsClinicService = new PetsClinicService(
                new PetsClinicDAOMock()
            );

            try {
                await petsClinicService.getPetsClinic("1");
              } catch (errorResponse: any) {
                expect(errorResponse).toBeInstanceOf(HTTPError);
                expect(errorResponse.statusCode).toEqual(404);
                expect(errorResponse.body).toEqual(
                    ERRORS.RESOURCE_NOT_FOUND
                );
              }
        });
    });
})

const getPetsClinicDAOMock: any = (items: any, count: number, s_count: number) => {
    let items_val = [];
    items_val = items && [...items];

    const PetsClinicDAOMock = jest.fn().mockImplementation(() => {
        return {
            getAll: () => {
                return Promise.resolve({
                    Items: items_val,
                    Count: count,
                    ScannedCount: s_count,
                });
            },
            getItem: () => {
                return Promise.resolve({
                    ...items[0]
                })
            }
        };
    });

    return PetsClinicDAOMock;
}

const getPetsClinicErrorMock: any = () => {
    const PetsClinicDAOMock = jest.fn().mockImplementation(() => {
        return {
          getAll: () => {
            return Promise.reject(new Error());
          },
          getItem: () => {
            return Promise.reject(new Error());
          }
        };
    });
    
    return PetsClinicDAOMock
}

const getPetsClinicHttpErrorMock: any = (error_code: number, error_message: string) => {
    const PetsClinicDAOMock = jest.fn().mockImplementation(() => {
        return {
          getAll: () => {
            return Promise.reject(
                new HTTPError(error_code, error_message)
            );
          },
          getItem: () => {
            return Promise.reject(
                new HTTPError(error_code, error_message)
            )
          }
        };
    });
    
    return PetsClinicDAOMock
}
