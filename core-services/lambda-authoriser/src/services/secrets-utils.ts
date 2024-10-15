import { 
  SecretsManagerClient,
  GetSecretValueCommand,
  GetSecretValueCommandOutput
} from "@aws-sdk/client-secrets-manager";


const getSecrets = async (secretId: string): Promise<GetSecretValueCommandOutput> => {
  const client = new SecretsManagerClient({ region: "eu-west-2" });
  const command = new GetSecretValueCommand({ SecretId: secretId });

  try {
    const data = await client.send(command);
    return data;
  } catch (error) {
    // error handling.
    console.log(error);
  }

  return { $metadata: {} }
}

export default getSecrets;
