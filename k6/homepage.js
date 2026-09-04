// k6/homepage.ts
import http from "k6/http";
import { check, sleep } from "k6";
var options = {
  vus: 100,
  duration: "30s",
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<2000"]
  }
};
function homepage_default() {
  const res = http.get("https://cuk-store.vercel.app/");
  check(res, {
    "status is 200": (r) => r.status === 200
  });
  sleep(1);
}
export {
  homepage_default as default,
  options
};
