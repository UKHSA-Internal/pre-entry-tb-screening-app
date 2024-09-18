describe("PetsClinicService", () => {
    beforeEach(() => {
        jest.resetModules();
    });

    afterEach(() => {
        jest.resetAllMocks().restoreAllMocks();
    });

    //follow vtm structure

    describe("getPetsClinic", () => {
        it("returns data on successful query", async () => {
            // expect 200 & data
        });
    
        it("throws error on failed query", async () => {
            // expect error
        });
    });

    describe("getAllPetsClinic", () => {
        it("returns data on successful query", async () => {
            // expect 200 & data
        });
    
        it("throws error on empty query", async () => {
            // expect error
        });

        it("throws error on failed query", async () => {
            // expect error
        });
    });
})