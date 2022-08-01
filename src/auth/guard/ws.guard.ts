import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { verifyJwt } from 'src/util/jwt';

@Injectable()
export class WsGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const args = context.getArgs();
      const authorizationToken = args[0].handshake.headers['authorization'];
      const decodedToken = verifyJwt(authorizationToken);
      return true;
    } catch (err) {
      console.log('err', err);
      return false;
    }
  }
}
