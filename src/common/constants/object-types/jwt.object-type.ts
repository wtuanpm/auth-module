export interface JwtPayload {
  jti: string;
  username: string;
  nameIdentifier: string;
  activeProfileId: string;
  exp: number;
  iss: string;
  aud: string;
}
