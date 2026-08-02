/**
 * Comprehensive Feature Screenshot Automation
 * 
 * Captures screenshots of all major features in the app for visual verification.
 * Saves to snapshots/ folder organized by feature area.
 */

import { chromium, Browser, Page } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const BASE_URL = process.env.BASE_URL || 'http://localhost:4173';
const SNAPSHOTS_DIR = path.join(process.cwd(), 'snapshots');

interface Screenshot {
  name: string;
  url: string;
  waitFor?: string;
  action?: (page: Page) => Promise<void>;
  mobile?: boolean;
}

const FEATURES: { category: string; screenshots: Screenshot[] }[] = [
  {
    category: '01-landing',
    screenshots: [
      { name: 'home-desktop', url: '/' },
      { name: 'home-mobile', url: '/', mobile: true },
      { name: 'about-us', url: '/about' },
      { name: 'privacy-policy', url: '/privacy' },
      { name: 'terms-of-service', url: '/terms' },
    ],
  },
  {
    category: '02-auth',
    screenshots: [
      { name: 'login-page', url: '/login' },
      { name: 'register-user', url: '/register-user' },
      { name: 'register-institution', url: '/register-institution' },
      { name: 'forgot-password', url: '/forgot-password' },
    ],
  },
  {
    category: '03-knowledge',
    screenshots: [
      { name: 'knowledge-hub', url: '/knowledge' },
      { name: 'fatwa-center', url: '/fatwa' },
      { name: 'fatwa-archive', url: '/fatwa-archive' },
      { name: 'deen-101', url: '/deen101' },
      { name: 'seerah-timeline', url: '/seerah-timeline' },
      { name: 'qawmi-system', url: '/qawmi' },
    ],
  },
  {
    category: '04-community',
    screenshots: [
      { name: 'community-feed', url: '/community' },
      { name: 'events-hub', url: '/events' },
      { name: 'competitions', url: '/competitions' },
      { name: 'leaderboard', url: '/leaderboard' },
    ],
  },
  {
    category: '05-professional',
    screenshots: [
      { name: 'professional-hub', url: '/professional' },
      { name: 'institution-directory', url: '/institutions' },
      { name: 'scholar-directory', url: '/scholars' },
      { name: 'marketplace', url: '/marketplace' },
    ],
  },
  {
    category: '06-sadaqah',
    screenshots: [
      { name: 'sadaqah-hub', url: '/sadaqah' },
    ],
  },
  {
    category: '07-tools',
    screenshots: [
      { name: 'tools-page', url: '/tools' },
      { name: 'calligraphy-gallery', url: '/calligraphy' },
      { name: 'audio-library', url: '/audio' },
    ],
  },
  {
    category: '08-help',
    screenshots: [
      { name: 'faq', url: '/faq' },
      { name: 'instructional-help', url: '/help' },
      { name: 'accessibility', url: '/accessibility' },
    ],
  },
];

async function takeScreenshot(
  page: Page,
  screenshot: Screenshot,
  category: string
): Promise<void> {
  try {
    // Set viewport based on device
    if (screenshot.mobile) {
      await page.setViewportSize({ width: 375, height: 812 });
    } else {
      await page.setViewportSize({ width: 1920, height: 1080 });
    }

    // Navigate to URL
    await page.goto(`${BASE_URL}${screenshot.url}`, {
      waitUntil: 'networkidle',
      timeout: 10000,
    });

    // Wait for specific element if provided
    if (screenshot.waitFor) {
      await page.waitForSelector(screenshot.waitFor, { timeout: 5000 });
    }

    // Execute custom action if provided
    if (screenshot.action) {
      await screenshot.action(page);
    }

    // Wait a bit for animations
    await page.waitForTimeout(1000);

    // Take screenshot
    const categoryDir = path.join(SNAPSHOTS_DIR, category);
    if (!fs.existsSync(categoryDir)) {
      fs.mkdirSync(categoryDir, { recursive: true });
    }

    const screenshotPath = path.join(categoryDir, `${screenshot.name}.png`);
    await page.screenshot({
      path: screenshotPath,
      fullPage: true,
    });

    console.log(`✅ ${category}/${screenshot.name}.png`);
  } catch (error) {
    console.error(`❌ Failed: ${category}/${screenshot.name}`, error.message);
  }
}

async function main() {
  console.log('🚀 Starting comprehensive screenshot automation...\n');
  console.log(`📍 Base URL: ${BASE_URL}`);
  console.log(`📁 Snapshots directory: ${SNAPSHOTS_DIR}\n`);

  const browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
  });

  const page = await context.newPage();

  let totalScreenshots = 0;
  let successCount = 0;

  for (const feature of FEATURES) {
    console.log(`\n📸 Category: ${feature.category}`);
    
    for (const screenshot of feature.screenshots) {
      totalScreenshots++;
      await takeScreenshot(page, screenshot, feature.category);
      successCount++;
    }
  }

  await browser.close();

  console.log(`\n\n✅ Screenshot automation complete!`);
  console.log(`📊 Captured: ${successCount}/${totalScreenshots} screenshots`);
  console.log(`📁 Saved to: ${SNAPSHOTS_DIR}`);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
