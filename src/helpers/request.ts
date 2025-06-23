import https from 'https';

let cookieVal: string | undefined;

function rereq(options: https.RequestOptions, body?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      const chunks: Buffer[] = [];
      res.on('data', (data) => {
        chunks.push(data);
      });
      res.on('end', () => resolve(Buffer.concat(chunks).toString()));
    });

    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

export const request = async (
  url: string,
  options: {
    method?: string;
    qs?: Record<string, any>;
    body?: string | Record<string, any>;
    headers?: Record<string, string>;
    contentType?: 'json' | 'form';
  },
): Promise<{ text: () => Promise<string> }> => {
  const parsedUrl = new URL(url);
  const method = options.method || 'POST';

  // Prepare body
  let bodyString = '';
  const contentType = options.contentType || 'json';

  if (typeof options.body === 'string') {
    bodyString = options.body;
  } else if (contentType === 'form') {
    bodyString = new URLSearchParams((options.body as Record<string, string>) || {}).toString();
  } else if (options.body) {
    bodyString = JSON.stringify(options.body);
  }

  const requestOptions: https.RequestOptions = {
    hostname: parsedUrl.hostname,
    port: parsedUrl.port || 443,
    path: `${parsedUrl.pathname}${
      options.qs ? `?${new URLSearchParams(options.qs as Record<string, string>).toString()}` : ''
    }`,
    method,
    headers: {
      ...(options.headers || {}),
      ...(contentType === 'form'
        ? { 'Content-Type': 'application/x-www-form-urlencoded' }
        : { 'Content-Type': 'application/json' }),
      ...(bodyString ? { 'Content-Length': Buffer.byteLength(bodyString).toString() } : {}),
      ...(cookieVal ? { cookie: cookieVal } : {}),
    },
  };

  const response = await new Promise<string>((resolve, reject) => {
    const req = https.request(requestOptions, (res) => {
      const chunks: Buffer[] = [];

      res.on('data', (data) => {
        chunks.push(data);
      });

      res.on('end', async () => {
        if (res.statusCode === 429 && res.headers['set-cookie']) {
          cookieVal = res.headers['set-cookie'][0].split(';')[0];
          if (requestOptions.headers) {
            requestOptions.headers['cookie'] = cookieVal;
          }
          try {
            const retryResponse = await rereq(requestOptions, bodyString);
            resolve(retryResponse);
          } catch (err) {
            reject(err);
          }
        } else {
          resolve(Buffer.concat(chunks).toString());
        }
      });
    });

    req.on('error', reject);
    if (bodyString) req.write(bodyString);
    req.end();
  });

  return {
    text: () => Promise.resolve(response),
  };
};
