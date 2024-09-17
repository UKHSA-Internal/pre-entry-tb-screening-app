describe("getPetsClinics", () => {
    beforeEach(() => {
        jest.resetModules();
    });

    afterEach(() => {
        jest.resetAllMocks().restoreAllMocks();
    });

    describe("call getAllPetsClinic in PetsClinicService", () => {
        it("returns data on successful query", async () => {
            // expect 200 & data
        });
    
        it("throw error on failed query", async () => {
            // expect error
        });
    });
})