import { driverManager } from './driver-manager';

function parseQuery(search: string): { [key: string]: string } {
  const params: { [key: string]: string } = {};
  if (typeof search !== 'string') {
    return params;
  }
  const decode = (s: string) => {
    return decodeURIComponent((s || '').trim());
  };
  const sea = search.trim();
  (sea.charAt(0) === '?' ? sea.substr(1) : sea)
    .split('&')
    .forEach((str: string) => {
      const [p, v] = str.split('=');
      params[decode(p)] = decode(v);
    });
  return params;
}

const regexPath = /^\/exec(\?.+)?$/;
export function middleware(request: any, response: any, next: () => void) {
  if (regexPath.test(request.url)) {
    const query = parseQuery(request.url.substr(request.url.indexOf('?')));
    driverManager
      .execCommand(query.id, query.payload)
      .catch((err: Error) => {
        console.error('>>> err', err);
      })
      .then(() => {
        response.end('ok');
      });
    return;
  }
  next();
}
