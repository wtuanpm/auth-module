import * as jwt from 'jsonwebtoken';

export function verifyJwt(token: string) {
  console.log(
    ' process.env.JWT_ACCESS_TOKEN_SECRET',
    process.env.JWT_ACCESS_TOKEN_SECRET,
  );
  const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
  return decoded;
}
