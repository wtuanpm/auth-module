import * as jwt from 'jsonwebtoken';

export function verifyJwt(token: string) {
  const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
  return decoded;
}

export function parseJwt(token: string) {
  const result = JSON.parse(
    Buffer.from(token.split('.')[1], 'base64').toString(),
  );
  return result;
}

export function createKey(value: string) {
  return `bl_${value}`;
}
