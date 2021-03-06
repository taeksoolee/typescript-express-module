import * as jsonwebtoken from 'jsonwebtoken';
import { Observable, Subject, Subscriber } from 'rxjs';
import { UserRoleType } from '../interface';

export interface Payload {
  iat?: number;
  exp?: number;
}

interface RefreshTokenPayload extends Payload {
  accessToken: string;
}

export default class Jwt<T extends Payload> {
  _secret: string;
  _prefix: string;

  constructor(secret: string, prefix: string='Bearer ') {
    this._secret = secret;
    this._prefix = prefix;
  }

  sign(payload: T): string {
    const accessToken = jsonwebtoken.sign(payload, this._secret, {
      algorithm: 'HS256',
      expiresIn: '1h',
    });

    return accessToken;
  }

  getPayoad(accessToken: string): T {
    try {
      const payload = jsonwebtoken.verify(accessToken, this._secret) as T;
      return payload;
    } catch(err) {
      return null;
    }
  }

  signRefreshToken(accessToken: string) {
    const refreshTokenPayload: RefreshTokenPayload = { accessToken };
    const refreshToken = jsonwebtoken.sign(refreshTokenPayload, this._secret, {
      algorithm: 'HS256',
      expiresIn: '14d',
    });

    return refreshToken;
  }

  getAccessToken(refreshToken: string): string {
    const decodedRefreshTokenPayload = jsonwebtoken.verify(refreshToken, this._secret) as RefreshTokenPayload;
    return decodedRefreshTokenPayload.accessToken;
  }

  verify(accessToken: string, data: T): boolean {
    const payload = this.getPayoad(accessToken);

    delete payload.exp;
    delete payload.iat;
    
    return JSON.stringify(payload) === JSON.stringify(data);
   }

  verifyRefreshToken(accessToken: string, refreshToken: string): boolean {
    return this.getAccessToken(refreshToken) === accessToken;
  }

  addPrefix(token: string): string {
    return this._prefix + token;
  }

  removePrefix(authentication: string): string {
    return authentication.startsWith(this._prefix)
      ? authentication.slice(this._prefix.length)
      : authentication;
  }
}

const jwt$ = new Subject();

export function initJwt<T extends Payload>(secret: string, prefix?: string): void {
  const jwt = new Jwt<T>(secret, prefix);
  jwt$.next(jwt);
}

export function getJwt() {
  return jwt$;
}