import { Injectable } from '@nestjs/common';
import * as jsforce from 'jsforce';
import * as jwt from 'jsonwebtoken';
import env from 'lib/utils/env';
import * as fs from 'fs';
import * as path from 'path';

export interface SalesforceCreateDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  title?: string;
  company?: string;
  location?: string;
  imageUrl?: string;
}

@Injectable()
export class SalesforceService {
  private conn: jsforce.Connection;

  constructor() {
    this.conn = new jsforce.Connection({
      oauth2: new jsforce.OAuth2({
        clientId: env.SF_CLIENT_ID,
        loginUrl: 'https://login.salesforce.com',
      }),
    });
  }

  private async login() {
    if (!this.conn.accessToken) {
      const privateKey = fs.readFileSync(
        path.join(process.cwd(), 'salesforce.key'),
        'utf-8',
      );

      const assertion = jwt.sign(
        {
          iss: env.SF_CLIENT_ID,
          sub: env.SF_USERNAME,
          aud: 'https://login.salesforce.com',
          exp: Math.floor(Date.now() / 1000) + 300,
        },
        privateKey,
        { algorithm: 'RS256' },
      );

      await this.conn.authorize({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion,
      });
    }
  }

  async syncUser(data: SalesforceCreateDto) {
    await this.login();

    const account = await this.conn.sobject('Account').create({
      Name: `${data.firstName} ${data.lastName}`,
      Phone: data.phone,
      Description: `User from CV Matcha: ${data.email}`,
    });

    if (!account.success) throw new Error('Failed to create Account');

    const contact = await this.conn.sobject('Contact').create({
      FirstName: data.firstName,
      LastName: data.lastName,
      Email: data.email,
      Phone: data.phone,
      Title: data.title,
      AccountId: account.id,
      Description: `Location: ${data.location || ''}`,
    });

    if (!contact.success) throw new Error('Failed to create Contact');

    return { accountId: account.id, contactId: contact.id };
  }
}
