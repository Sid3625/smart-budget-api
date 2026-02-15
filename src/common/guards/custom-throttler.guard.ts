import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerException, ThrottlerLimitDetail } from '@nestjs/throttler';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
    protected async throwThrottlingException(context: ExecutionContext, throttlerLimitDetail: ThrottlerLimitDetail): Promise<void> {
        const handler = context.getHandler();
        if (handler.name === 'login') {
            throw new ThrottlerException('your limit is exceed please try again after 15min');
        }
        await super.throwThrottlingException(context, throttlerLimitDetail);
    }
}
