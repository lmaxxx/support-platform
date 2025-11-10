import {
  CreateSecretCommand,
  GetSecretValueCommand, GetSecretValueCommandOutput, PutSecretValueCommand,
  ResourceExistsException,
  SecretsManagerClient
} from "@aws-sdk/client-secrets-manager";
import {requireEnv} from "./env";

export function createSecretManagerClient () {
  return new SecretsManagerClient({
    region: requireEnv("AWS_REGION"),
    credentials: {
      accessKeyId: requireEnv("AWS_ACCESS_KEY_ID"),
      secretAccessKey: requireEnv("AWS_SECRET_ACCESS_KEY"),
    }
  })
}

export async function getSecretValue(secretName: string) {
  const client = createSecretManagerClient();
  return await client.send(new GetSecretValueCommand({ SecretId: secretName}))
}

export async function upsertSecret(secretName: string, secretValue: Record<string, unknown>) {
  const client = createSecretManagerClient();

  try {
    await client.send(
      new CreateSecretCommand({
        Name: secretName,
        SecretString: JSON.stringify(secretValue)
      })
    )
  } catch (error) {
    if(error instanceof ResourceExistsException) {
      await client.send(
        new PutSecretValueCommand({
          SecretId: secretName,
          SecretString: JSON.stringify(secretValue)
        })
      )
    } else {
      throw error;
    }
  }
}

export function parseSecretString<T = Record<string, unknown>>(secret: GetSecretValueCommandOutput, secretName?: string) {
  if(!secret.SecretString) {
    return null;
  }

  try {
    return JSON.parse(secret.SecretString) as T;
  } catch (error) {
    // Log parse failure for debugging (never log actual secret value)
    console.error("Failed to parse secret string", {
      secretName: secretName || "unknown",
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}