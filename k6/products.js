// k6/products.ts
import http from "k6/http";
import { check, sleep } from "k6";
var options = {
  vus: 200,
  duration: "30s",
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<2000"]
  }
};
function products_default() {
  const res = http.get(
    "https://cuk-store.vercel.app/api/products?limit=12"
  );
  check(res, {
    "status is 200": (r) => r.status === 200,
    "response contains products": (r) => typeof r.body === "string" && r.body.includes('"products"')
  });
  sleep(1);
}
export {
  products_default as default,
  options
};
