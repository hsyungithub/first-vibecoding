/**
 * Sprint 3 Playwright 디버그 스크립트
 */
const { chromium } = require("@playwright/test");
const path = require('path');

const SCREENSHOT_DIR = path.resolve(__dirname);
const BASE_URL = 'http://localhost:3000';

async function debug() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // 콘솔 메시지 수집
  const consoleErrors = [];
  page.on('console', msg => {
    console.log(`[CONSOLE ${msg.type()}] ${msg.text()}`);
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    console.log('페이지 로드 완료');

    // 모든 버튼 텍스트 확인
    const buttons = await page.locator('button').allTextContents();
    console.log('버튼 목록:', buttons);

    // 드롭다운 옵션 확인
    const options = await page.locator('select option').allTextContents();
    console.log('드롭다운 옵션:', options);

    // 슬라이더 수 확인
    const sliders = await page.locator('input[type="range"]').count();
    console.log('슬라이더 수:', sliders);

    // 배열 크기를 작게 설정 (빠른 정렬을 위해)
    const sizeSlider = page.locator('input[type="range"]').first();
    await sizeSlider.fill('10');
    await page.waitForTimeout(500);
    console.log('배열 크기를 10으로 설정');

    // 속도 슬라이더를 최고속으로
    const allSliders = await page.locator('input[type="range"]').all();
    if (allSliders.length >= 2) {
      await allSliders[allSliders.length - 1].fill('10');
      console.log('속도 최고속 설정');
    }

    // 버블 정렬 선택
    const dropdown = page.locator('select').first();
    await dropdown.selectOption({ label: '버블 정렬' });
    console.log('버블 정렬 선택');

    // 정렬 시작
    const startBtn = page.getByText('정렬 시작');
    const startBtnExists = await startBtn.count();
    console.log('정렬 시작 버튼 수:', startBtnExists);

    await startBtn.click();
    console.log('정렬 시작 클릭');
    await page.waitForTimeout(500);

    // 버튼 상태 확인
    const btnTexts = await page.locator('button').allTextContents();
    console.log('클릭 후 버튼 텍스트:', btnTexts);

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'debug-after-click.png') });

    // 5초 대기 후 상태 확인
    await page.waitForTimeout(5000);
    const btnTexts2 = await page.locator('button').allTextContents();
    console.log('5초 후 버튼 텍스트:', btnTexts2);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'debug-5sec.png') });

    console.log('\n콘솔 에러:', consoleErrors.length === 0 ? '없음' : consoleErrors);

  } catch (err) {
    console.error('오류:', err.message);
  } finally {
    await browser.close();
  }
}

debug();
