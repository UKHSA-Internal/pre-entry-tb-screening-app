import { HttpVerb } from "../services/http-verbs";
export type NonEmptyArray<T> = [T, ...T[]];
export interface IApiAccess {
  verbs: HttpVerb[];
  path: string;
}

export const functionConfig: { [key: string]: NonEmptyArray<IApiAccess> } = {
  "Clinics.ReadAll": [
    {
        verbs: ["GET", "OPTIONS"],
        path: "clinics",
    }
  ],
  "Clinics.ReadOwn": [
    {
        verbs: ["GET", "OPTIONS"],
        path: "clinics/?*",
    }
  ],
  "Clinics.WriteAll": [
    {
        verbs: ["POST"],
        path: "clinics",
    }
  ]
};
