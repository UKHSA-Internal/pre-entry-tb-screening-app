import { HTTPError } from "@models/HTTPError";
import { ERRORS } from "@utils/Enum";
import { IPetsApplicant } from "@models/IPetsApplicant";
import { PetsApplicantService } from "@/service/PetsApplicantService";
import applicants from "../resources/pets-applicant-test.json";


describe("PetsApplicantService", () => {
    beforeEach(() => {
        jest.resetModules();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe("putPetsApplicant", () => {
        it("returns data on successful query", async () => {
            const PetsClinicDAOMock = getPetsClinicDAOMock(applicants[0]);
            const petsApplicantService = new PetsApplicantService(
                new PetsClinicDAOMock()
            );
            return petsApplicantService
                .putPetsApplicant(applicants[0])
                .then((returnValue: any) => {
                    expect(returnValue).toEqual("Data successfully posted");
                });
        });
    
        it("throws HTTP error on failed query", async () => {
            const PetsClinicDAOMock = getPetsClinicHttpErrorMock(400, "Bad Request");
            const petsApplicantService = new PetsApplicantService(
                new PetsClinicDAOMock()
            );
            return petsApplicantService
                .putPetsApplicant(applicants[0])
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
            const petsApplicantService = new PetsApplicantService(
                new PetsClinicDAOMock()
            );
            return petsApplicantService
                .putPetsApplicant(applicants[0])
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
})

const getPetsClinicDAOMock: any = (items: any) => {
    const PetsClinicDAOMock = jest.fn().mockImplementation(() => {
        return {
            putItem: () => {
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
          putItem: () => {
            return Promise.reject(new Error());
          }
        };
    });
    
    return PetsClinicDAOMock
}

const getPetsClinicHttpErrorMock: any = (error_code: number, error_message: string) => {
    const PetsClinicDAOMock = jest.fn().mockImplementation(() => {
        return {
          putItem: () => {
            return Promise.reject(
                new HTTPError(error_code, error_message)
            )
          }
        };
    });
    
    return PetsClinicDAOMock
}
