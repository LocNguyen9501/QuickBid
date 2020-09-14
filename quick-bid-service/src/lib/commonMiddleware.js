import middy from '@middy/core';
import httpJsonParser from '@middy/http-json-body-parser';
import httpEvenNormalizer from '@middy/http-event-normalizer';
import httpErorHandler from '@middy/http-error-handler';

export default handler => middy(handler)
        .use([
            httpJsonParser(),
            httpEvenNormalizer(),
            httpErorHandler(),
        ]);