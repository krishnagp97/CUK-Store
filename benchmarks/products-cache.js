import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  scenarios: {
    cached_products: {
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
    tags: {
      endpoint: "products-cache",
    },
  });

  check(response, {
    "status is 200": (r) => r.status === 200,
    "product cache is HIT": (r) =>
      r.headers["X-Product-Cache"] === "HIT",
  });

  sleep(1);
}