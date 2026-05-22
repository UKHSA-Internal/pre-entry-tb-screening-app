import { getClinicById } from "@/api/api";
import { AppDispatch } from "@/redux/store";
import { setClinic } from "@/redux/tbCertificateSlice";

import { getUserProperties } from "./userProperties";

export const fetchClinic = async (
  dispatch: AppDispatch,
  applicationClinicId?: string,
): Promise<void> => {
  let clinicId: string | null = null;
  clinicId = (applicationClinicId || (await getUserProperties())?.clinicId) ?? "unknown Clinic Id";
  if (!clinicId) return;
  void getClinicById(clinicId).then(({ data }) => {
    dispatch(setClinic(data.clinic));
  });
};
