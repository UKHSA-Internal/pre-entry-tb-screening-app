import { JwtVerifier } from "aws-jwt-verify";
import { JwtPayload } from "aws-jwt-verify/jwt-model";

import { assertEnvExists } from "../shared/config";
import { logger } from "../shared/logger";

const TENANT_ID = assertEnvExists(process.env.VITE_MSAL_TENANT_ID);
const CLIENT_ID = assertEnvExists(process.env.VITE_MSAL_CLIENT_ID);

export const verifier = JwtVerifier.create({
  issuer: `https://${TENANT_ID}.ciamlogin.com/${TENANT_ID}/v2.0`,
  audience: CLIENT_ID,
  jwksUri: `https://login.microsoftonline.com/${TENANT_ID}/discovery/keys`,
  cacheMaxAge: 60, // Keep this low
  fetchJwksOnKidMiss: true, // Retry JWKS fetch on unknown kid
  jwksRequestsPerMinute: 10, // Allow burst of requests during issues
});

export async function verifyJwtToken(token: string): Promise<JwtPayload> {
  try {
    return await verifier.verify(token);
  } catch (err: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (err.type === "KidNotFoundInJwksError") {
      logger.warn("JWKS miss — retrying JWKS fetch due to unknown kid...");
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        await (verifier as any)._fetchJwks(true); //  Private API, works for now
        return await verifier.verify(token); // Retry after forced refresh
      } catch (retryErr) {
        logger.error(retryErr, "Retry failed: still can't verify token");
        throw retryErr;
      }
    }
    // Unexpected verification failure
    logger.error(err, "Token verification failed");
    throw err;
  }
}
