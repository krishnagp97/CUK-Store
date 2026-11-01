import http from "k6/http";
import { check, sleep } from "k6";
export const options = {
  scenarios: {
    uncached_products: {
      executor: "constant-vus",
      vus: 25,
      duration: "1m",
    },
  },
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<2000"],
  },
};
const BASE_URL = "https://cuk-store.vercel.app";
export default function () {
  const response = http.get(`${BASE_URL}/api/products?limit=12`, {
    headers: {
      "x-benchmark-secret": __ENV.BENCHMARK_SECRET,
    },
    tags: {
      endpoint: "products-baseline",
    },
  });
  check(response, {
    "status is 200": (r) => r.status === 200,
    "cache is bypassed": (r) =>
      r.headers["X-Product-Cache"] === "BYPASS",
  });
  sleep(1);
}
