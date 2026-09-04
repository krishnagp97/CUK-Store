import http from 'k6/http';
import { check, sleep } from 'k6';
import type { Options } from 'k6/options';

export const options: Options = {
  vus: 200,
  duration: '30s',

  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<2000'],
  },
};

export default function () {
  const res = http.get(
    'https://cuk-store.vercel.app/api/products?limit=12'
  );

  check(res, {
  'status is 200': (r) => r.status === 200,
  'response contains products': (r) =>
    typeof r.body === 'string' && r.body.includes('"products"'),
});
  sleep(1);
}