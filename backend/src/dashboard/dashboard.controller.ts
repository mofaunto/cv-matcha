import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { DashboardService } from './dashboard.service';

@Controller('api/dashboard')
@UseGuards(AuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  async getDashboard() {
    return this.dashboardService.getDashboard();
  }
}
