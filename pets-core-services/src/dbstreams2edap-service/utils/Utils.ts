/**
 * Utils functions
 */
export class Utils {
  /**
   * Filter records to be sent to SQS
   * @param records
   */
  public static filterCertificateGenerationRecords(records: any[]) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return records
      .filter((record: any) => {
        // Filter by testStatus
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        return record.testStatus === "submitted";
      })
      .filter((record: any) => {
        // Filter by testResult (abandoned tests are not allowed)
        return (
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          record.testTypes.testResult === "pass" ||
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          record.testTypes.testResult === "fail" ||
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          record.testTypes.testResult === "prs"
        );
      })
      .filter((record: any) => {
        // Filter by testTypeClassification or testTypeClassification, testResult and requiredStandards present and populated
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const { testTypeClassification, testResult, requiredStandards } = record.testTypes;
        const isTestResultFail = testResult === "fail";
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const hasNonEmptyRequiredStandards = !!requiredStandards?.length;

        const isAnnualWithCertificate = testTypeClassification === "Annual With Certificate";
        const isIvaWithCertificate =
          testTypeClassification === "IVA With Certificate" &&
          isTestResultFail &&
          hasNonEmptyRequiredStandards;
        const isMsvaWithCertificate =
          testTypeClassification === "MSVA With Certificate" &&
          isTestResultFail &&
          hasNonEmptyRequiredStandards;

        return isAnnualWithCertificate || isIvaWithCertificate || isMsvaWithCertificate;
      });
  }
}
