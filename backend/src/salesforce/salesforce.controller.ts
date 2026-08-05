import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import type { AuthenticatedRequest } from '../auth/auth.guard';
import { SalesforceService } from './salesforce.service';
import type { SalesforceCreateDto } from './salesforce.service';

@Controller('api/salesforce')
@UseGuards(AuthGuard)
export class SalesforceController {
  constructor(private readonly sfService: SalesforceService) {}

  @Post('sync')
  async sync(
    @Req() req: AuthenticatedRequest,
    @Body() body: SalesforceCreateDto,
  ) {
    const { name, email } = req.user!;
    const firstName = name?.split(' ')[0] ?? 'Unknown';
    let lastName = name?.split(' ')[1];
    if (!lastName || lastName.trim() === '') {
      lastName = '.';
    }
    return this.sfService.syncUser({
      firstName,
      lastName,
      email,
      phone: body.phone,
      title: body.title,
      company: body.company,
      location: body.location,
      imageUrl: body.imageUrl,
    });
  }
}
