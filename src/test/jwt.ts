import * as jwt from 'jsonwebtoken';
import { UserRoleType } from '../interface';

const secret: string = 'abcdefghi';

interface JwtPayload {
  id: string;
  role: UserRoleType;
  lat?: number;
  exp?: number;
}

interface RefreshTokenPayload {
  accessToken: string;
  lat?: number;
  exp?: number;
}

const payload: JwtPayload = {id: 'lee', role: 'admin'};

const accessToken = jwt.sign(payload, secret, {
  algorithm: 'HS256',
  expiresIn: '1h',
});
console.log('==============');
console.log('accessToken : ', accessToken);

// token 검증
const decoded = jwt.verify(accessToken, secret) as JwtPayload;
console.log('==============');
console.log('decoded, ', decoded);


const refreshTokenPayload: RefreshTokenPayload = { accessToken };
const refreshToken = jwt.sign(refreshTokenPayload, secret, {
  algorithm: 'HS256',
  expiresIn: '14d',
});
console.log('==============');
console.log('refreshToken, ', refreshToken);

const decodedRefreshTokenPayload = jwt.verify(refreshToken, secret) as RefreshTokenPayload;
console.log('==============');
console.log('diff, ', decodedRefreshTokenPayload.accessToken === accessToken);