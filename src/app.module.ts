import { Module } from '@nestjs/common'

import { CoreModule } from '@core/core.module'
import { ObservabilityModule } from '@observability/observability.module'
import { ApiModule } from '@api/api.module'

@Module({
	imports: [CoreModule, ObservabilityModule, ApiModule],
})
export class AppModule {}
