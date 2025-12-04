import {
    Controller,
    Get,
    Param,
    ParseIntPipe,
    UseGuards,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { JwtPayload } from '../auth/jwt-payload.type';

@Controller('members')
export class MembersController {
    constructor(
        private readonly membersService: MembersService,
    ) {}

    @Get(':mid')
    async findOne(
        @Param('mid', ParseIntPipe) mid: number,
    ) {
        return this.membersService.getProfile(mid);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async me(@CurrentUser() user: JwtPayload) {
        return this.membersService.getProfile(user.sub);
    }
}