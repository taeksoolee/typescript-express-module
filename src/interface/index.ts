import { Payload } from "../utils/jwt";

export const userRoleTypes = ['admin', 'normal', 'guest'];
export type UserRoleType = 'admin' | 'normal' | 'guest';


export interface JwtPayload extends Payload {
  name: string;
}