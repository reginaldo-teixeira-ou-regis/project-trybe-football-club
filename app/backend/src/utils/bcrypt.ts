import * as bcrypt from 'bcryptjs';

async function comparePassword(plaintextPassword: string, hash: string) {
  const result = await bcrypt.compare(plaintextPassword, hash);
  return result;
}

export default comparePassword;
