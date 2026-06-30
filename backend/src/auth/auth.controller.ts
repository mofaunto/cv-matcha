import { Controller, All, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { auth } from '../../lib/auth';

@Controller('api/auth')
export class AuthController {
  @All('*')
  async handleAuth(@Req() req: Request, @Res() res: Response) {
    const url = `http://${req.headers.host ?? 'localhost'}${req.url}`;
    const webRequest = new Request(url, {
      method: req.method,
      headers: new Headers(req.headers as Record<string, string>),
      body:
        req.method !== 'GET' && req.method !== 'HEAD'
          ? JSON.stringify(req.body)
          : undefined,
    });
    const response = await auth.handler(webRequest);
    res.status(response.status);
    response.headers.forEach((value, key) => res.setHeader(key, value));
    res.send(await response.text());
  }
}
