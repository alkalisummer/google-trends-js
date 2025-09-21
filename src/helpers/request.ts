import https from 'https';

let cookieVal: string | undefined;

function rereq(options: https.RequestOptions, body?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      const chunks: Uint8Array[] = [];
      res.on('data', (data: Uint8Array) => {
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
    qs?: Record<string, string>;
    body?: string | Record<string, string>;
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

  // Build query string (standard URL encoding for all keys, including 'req')
  const buildQueryString = (params: Record<string, string>): string => {
    return Object.entries(params)
      .map(([key, value]) => {
        return `${key}=${encodeURIComponent(value)}`;
      })
      .join('&');
  };

  const requestOptions: https.RequestOptions = {
    hostname: parsedUrl.hostname,
    port: parsedUrl.port || 443,
    path: `${parsedUrl.pathname}${options.qs ? `?${buildQueryString(options.qs)}` : ''}`,
    method,
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
      ...(options.headers || {}),
      ...(contentType === 'form'
        ? { 'Content-Type': 'application/x-www-form-urlencoded' }
        : { 'Content-Type': 'application/json' }),
      ...(bodyString ? { 'Content-Length': Buffer.byteLength(bodyString).toString() } : {}),
      ...(cookieVal ? { cookie: cookieVal } : {}),
      referer: 'https://trends.google.com/',
    },
  };
  const response = await new Promise<string>((resolve, reject) => {
    const req = https.request(requestOptions, (res) => {
      const chunks: Uint8Array[] = [];

      res.on('data', (data: Uint8Array) => {
        chunks.push(data);
      });

      res.on('end', async () => {
        // Persist cookies from any response
        if (res.headers['set-cookie'] && res.headers['set-cookie'].length > 0) {
          const receivedCookies = res.headers['set-cookie'].map((cookieStr) => cookieStr.split(';')[0]).filter(Boolean);
          if (receivedCookies.length > 0) {
            cookieVal = receivedCookies.join('; ');
          }
        }

        if (res.statusCode === 429) {
          if (requestOptions.headers && cookieVal) {
            requestOptions.headers['cookie'] = cookieVal;
          }
          try {
            const retryResponse = await rereq(requestOptions, bodyString);
            resolve(retryResponse);
          } catch (err) {
            reject(err);
          }
          return;
        }

        resolve(Buffer.concat(chunks).toString());
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
