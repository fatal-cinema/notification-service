import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { NodeSDK } from '@opentelemetry/sdk-node'
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions'

import { SERVICE_NAME } from '@shared/constants'

const sdk = new NodeSDK({
	traceExporter: new OTLPTraceExporter({
		url: 'http://jaeger:4317',
	}),
	resource: resourceFromAttributes({
		[ATTR_SERVICE_NAME]: SERVICE_NAME,
	}),
	instrumentations: [
		getNodeAutoInstrumentations({
			'@opentelemetry/instrumentation-http': { enabled: true },
			'@opentelemetry/instrumentation-nestjs-core': { enabled: true },
		}),
	],
})

sdk.start()
