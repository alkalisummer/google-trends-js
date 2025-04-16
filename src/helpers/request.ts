import https from 'https';
import querystring from 'querystring';

let cookieVal: string | undefined;

function rereq(options: https.RequestOptions): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let chunk = '';
      res.on('data', (data) => {
        chunk += data;
      });
      res.on('end', () => {
        resolve(chunk.toString()); 
      });
    });
    req.on('error', (e) => {
      reject(e);
    });
    req.end();
  });
}

export const request = async (url: string, options: {
  method?: string;
  qs?: Record<string, any>;
  body?: string;
}): Promise<Response> => {
  const parsedUrl = new URL(url);
  
  const requestOptions: https.RequestOptions = {
    host: parsedUrl.host,
    method: options.method || 'POST',
    path: `${parsedUrl.pathname}${options.qs ? '?' + querystring.stringify(options.qs) : ''}`,
    headers: {}
  };

  if (cookieVal) {
    requestOptions.headers = { 'cookie': cookieVal };
  }


    const response = await new Promise<string>((resolve, reject) => {
      const req = https.request(requestOptions, (res) => {
        let chunk = '';
        
        res.on('data', (data) => {
          chunk += data;
        });

        res.on('end', async () => {
          if (res.statusCode === 429 && res.headers['set-cookie']) {
            cookieVal = res.headers['set-cookie'][0].split(';')[0];
            requestOptions.headers = { 'cookie': cookieVal };
            try {
              const retryResponse = await rereq(requestOptions);
              resolve(retryResponse);
            } catch (err) {
              reject(err);
            }
          } else {
            resolve(chunk.toString());
          }
        });
      });

      if (options.body) {
        req.write(options.body);
      }

      req.on('error', (e) => {
        reject(e);
      });

      req.end();
    });

    return {
      text: () => Promise.resolve(response)
    } as Response;
};
