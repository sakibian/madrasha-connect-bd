// Madrasa Connect BD — Load Test Script (k6)
// Run: k6 run docs/load-test.js
// Install k6: https://k6.io/docs/getting-started/installation/

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const errorRate = new Rate('errors');
const latency = new Trend('latency');

const BASE_URL = __ENV.BASE_URL || 'https://madrasaconnectbd.com';
const SUPABASE_URL = __ENV.SUPABASE_URL || 'https://qazcxnldkrklxdmunfgj.supabase.co';
const SUPABASE_ANON_KEY = __ENV.SUPABASE_ANON_KEY || '';

export const options = {
  stages: [
    { duration: '30s', target: 20 },   // ramp up
    { duration: '1m', target: 50 },    // sustain
    { duration: '30s', target: 100 },  // peak
    { duration: '2m', target: 100 },   // sustained peak
    { duration: '30s', target: 0 },    // ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],  // 95% of requests < 2s
    errors: ['rate<0.1'],               // Error rate < 10%
  },
};

export default function () {
  // Test 1: Homepage
  const homeRes = http.get(`${BASE_URL}`);
  check(homeRes, {
    'homepage status 200': (r) => r.status === 200,
    'homepage load < 2s': (r) => r.timings.duration < 2000,
  });
  errorRate.add(homeRes.status !== 200);
  latency.add(homeRes.timings.duration);

  sleep(1);

  // Test 2: Jobs API (Supabase)
  if (SUPABASE_ANON_KEY) {
    const jobsRes = http.get(
      `${SUPABASE_URL}/rest/v1/jobs?select=*&limit=20&order=created_at.desc`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );
    check(jobsRes, {
      'jobs API status 200': (r) => r.status === 200,
      'jobs API < 1s': (r) => r.timings.duration < 1000,
    });
    errorRate.add(jobsRes.status !== 200);
    latency.add(jobsRes.timings.duration);

    sleep(0.5);
  }

  // Test 3: Institutions API
  if (SUPABASE_ANON_KEY) {
    const instRes = http.get(
      `${SUPABASE_URL}/rest/v1/institutions?select=*&limit=20`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );
    check(instRes, {
      'institutions API status 200': (r) => r.status === 200,
    });
    errorRate.add(instRes.status !== 200);
    latency.add(instRes.timings.duration);

    sleep(0.5);
  }

  // Test 4: Fatwas API
  if (SUPABASE_ANON_KEY) {
    const fatwaRes = http.get(
      `${SUPABASE_URL}/rest/v1/fatwas?select=*&limit=20&order=created_at.desc`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );
    check(fatwaRes, {
      'fatwas API status 200': (r) => r.status === 200,
    });
    errorRate.add(fatwaRes.status !== 200);
    latency.add(fatwaRes.timings.duration);
  }

  sleep(2);
}

export function handleSummary(data) {
  return {
    stdout: JSON.stringify(data.metrics, null, 2),
    'docs/load-test-results.json': JSON.stringify(data.metrics, null, 2),
  };
}
