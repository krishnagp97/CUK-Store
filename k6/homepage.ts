import http from 'k6/http';
import { check, sleep } from 'k6';
import type { Options } from 'k6/options';

export const options: Options = {
  vus: 100,
  duration: '30s',

  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<2000'],
  },
};

export default function () {
  const res = http.get('https://cuk-store.vercel.app/');

  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(1);
}