import { PetsClinicService } from "@services/PetsClinicService";
import PetsClinicDAO from "@models/dao/PetsClinicDAO";
import { getPetsClinic } from '@functions/getPetsClinic'
import { HTTPResponse } from "@models/HTTPResponse";
import { ERRORS, HTTP_RESPONSE } from "@utils/Enum";
import { Validator } from "@utils/Validator";

describe("getPetsClinic", () => {
    beforeEach(() => {
        jest.resetModules();
    });

    afterEach(() => {
        jest.resetAllMocks().restoreAllMocks();
    });

    describe("path parameters", () => {
        it("are missing", async () => {
            const myError = new HTTPResponse(400, HTTP_RESPONSE.MISSING_PARAMETERS);
            const output = await new getPetsClinic({})
            expect(output).toEqual(myError);
        });

        it("are not valid", async () => {
            const myError = new HTTPResponse(400, HTTP_RESPONSE.MISSING_PARAMETERS);
            const output = await new getPetsClinic({"key": "undefined"})
            expect(output).toEqual(myError);
        });
    })

    describe("call getPetsClinic in PetsClinicService", () => {
        it("returns data on successful query", async () => {
            // expect 200 & data
            // let dao = new PetsClinicDAO()
            // let service = new PetsClinicService(dao)
            // let validator = new Validator()
            // const check: Validator = new Validator()
            // jest.spyOn(service, 'getPetsClinic').mockImplementation(() => 'blah')
            // jest.spyOn(PetsClinicService, 'getPetsClinic').mockImplementation(() => 'blah')
            // jest.spyOn(validator, 'parametersAreValid').mockImplementation(() => true)
            // jest.spyOn(check, 'parametersAreValid').mockImplementation(() => true)
            // jest.spyOn(Validator, 'parametersAreValid').mockImplementation(() => true)
            const output = await new getPetsClinic({"pathParameters": {"petsClinicId": "12345"}})
            console.log(output)


        });
    
        it("throw error on failed query", async () => {
            // expect 500 & INTERNAL_SERVER_ERROR
        });
    });
    
    
})