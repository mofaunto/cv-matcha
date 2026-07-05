import { Controller, All, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { auth } from '../../lib/auth';

@Controller('api/auth')
export class AuthController {
  @All('*')
  async handleAuth(@Req() req: Request, @Res() res: Response) {
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const url = `${protocol}://${req.headers.host}${req.url}`;

    const webRequest = new Request(url, {
      method: req.method,
      headers: new Headers(req.headers as Record<string, string>),
      body:
        req.method !== 'GET' && req.method !== 'HEAD'
          ? JSON.stringify(req.body)
          : undefined,
    });

    const response = await auth.handler(webRequest);

    // DEBUG: log all response headers to Render logs
    console.log('=== DEBUG AUTH RESPONSE ===');
    console.log('URL:', url);
    console.log('Status:', response.status);
    response.headers.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

    res.status(response.status);

    response.headers.forEach((value, key) => {
      if (key.toLowerCase() === 'set-cookie') return;
      res.setHeader(key, value);
    });

    const setCookie = response.headers.getSetCookie?.();
    if (setCookie && setCookie.length > 0) {
      console.log('Set-Cookie header count:', setCookie.length);
      setCookie.forEach((cookie, i) => {
        console.log(`  Cookie ${i}: ${cookie}`);
      });
      res.setHeader('Set-Cookie', setCookie);
    } else {
      console.log('No Set-Cookie header found!');
    }

    const body = await response.text();
    res.send(body);
  }
}
