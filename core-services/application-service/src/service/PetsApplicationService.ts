export class PetsApplicationService {


  /**
   * Fetch application details using passport number & country of issue.
   * @param petsApplicantPassport (PetsApplicantPassport)
   */
  public async getPetsApplication(arg: any) {
    // TODO: create the function logic here (unrelated to this task)
    if (!arg) {
      return "no query args"
    } else {
      return arg
    }
  }
}
