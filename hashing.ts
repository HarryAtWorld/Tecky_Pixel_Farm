import * as bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export async function hashingPassword(password: string) {
  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  return hash;
}

export async function checkPassword(password: string, hashPassword: string) {
  const match = await bcrypt.compare(password, hashPassword);
  return match;
}
