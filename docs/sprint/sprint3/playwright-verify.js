/**
 * Sprint 3 Playwright 검증 스크립트
 * 실행: node docs/sprint/sprint3/playwright-verify.js
 */
const { chromium } = require("@playwright/test");
const path = require('path');

const SCREENSHOT_DIR = path.resolve(__dirname);
const BASE_URL = 'http://localhost:3000';

// 정렬 완료 대기: 버튼 텍스트가 "정렬 시작"으로 돌아올 때까지 대기
async function waitForSortComplete(page, timeoutMs = 60000) {
  await page.waitForFunction(
    () => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.some(b => b.textContent.trim() === '정렬 시작');
    },
    { timeout: timeoutMs }
  );
}

async function verify() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const results = [];
  const consoleErrors = [];

  // 콘솔 에러 수집 (페이지 생성 직후부터)
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  function log(scenario, status, note = '') {
    results.push({ scenario, status, note });
    console.log(`[${status}] ${scenario}${note ? ' - ' + note : ''}`);
  }

  try {
    // 1. 페이지 접속 및 기본 렌더링 확인
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01-initial.png') });

    const title = await page.title();
    log('페이지 로드', title ? 'PASS' : 'FAIL', `title: ${title}`);

    const dropdown = await page.locator('select').first();
    const dropdownVisible = await dropdown.isVisible();
    log('알고리즘 드롭다운 렌더링', dropdownVisible ? 'PASS' : 'FAIL');

    const bars = await page.locator('[class*="bg-blue"]').count();
    log('막대 그래프 렌더링', bars > 0 ? 'PASS' : 'FAIL', `막대 수: ${bars}`);

    // 배열 크기를 10으로 줄여 빠른 정렬 검증
    const sliders = await page.locator('input[type="range"]').all();
    // 슬라이더: [0] 배열 크기, [1] 속도
    if (sliders.length >= 1) {
      await sliders[0].fill('10');
      await page.waitForTimeout(300);
    }
    // 속도를 최고속(10)으로 설정
    if (sliders.length >= 2) {
      await sliders[1].fill('10');
      await page.waitForTimeout(200);
    }

    // 2. 버블 정렬 검증
    await dropdown.selectOption({ label: '버블 정렬' });
    await page.waitForTimeout(200);
    log('버블 정렬 선택', 'PASS');

    let startBtn = page.getByText('정렬 시작');
    await startBtn.click();
    log('버블 정렬 시작', 'PASS');

    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03-bubble-sorting.png') });

    await waitForSortComplete(page, 30000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04-bubble-sorted.png') });
    log('버블 정렬 완료 (애니메이션 포함)', 'PASS');

    // 3. 선택 정렬 검증
    await page.getByText('새 배열 생성').click();
    await page.waitForTimeout(300);
    await dropdown.selectOption({ label: '선택 정렬' });
    await page.waitForTimeout(200);
    startBtn = page.getByText('정렬 시작');
    await startBtn.click();
    log('선택 정렬 시작', 'PASS');

    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05-selection-sorting.png') });

    await waitForSortComplete(page, 30000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06-selection-sorted.png') });
    log('선택 정렬 완료 (애니메이션 포함)', 'PASS');

    // 4. 삽입 정렬 검증
    await page.getByText('새 배열 생성').click();
    await page.waitForTimeout(300);
    await dropdown.selectOption({ label: '삽입 정렬' });
    await page.waitForTimeout(200);
    startBtn = page.getByText('정렬 시작');
    await startBtn.click();
    log('삽입 정렬 시작', 'PASS');

    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07-insertion-sorting.png') });

    await waitForSortComplete(page, 30000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08-insertion-sorted.png') });
    log('삽입 정렬 완료 (애니메이션 포함)', 'PASS');

    // 5. 콘솔 에러 없음 확인
    log('콘솔 에러 없음', consoleErrors.length === 0 ? 'PASS' : 'FAIL',
      consoleErrors.length > 0 ? consoleErrors.join(', ') : '에러 없음');

    // 6. 정렬 중단 기능 검증
    await page.getByText('새 배열 생성').click();
    await page.waitForTimeout(200);

    // 속도를 최저속으로 설정 (중단 시간 확보)
    if (sliders.length >= 2) {
      await sliders[1].fill('1');
      await page.waitForTimeout(200);
    }
    await dropdown.selectOption({ label: '버블 정렬' });
    startBtn = page.getByText('정렬 시작');
    await startBtn.click();
    await page.waitForTimeout(1500); // 정렬 진행 중 대기

    // 정렬 중 버튼 상태 확인 (비활성화)
    const btnTexts = await page.locator('button').allTextContents();
    const isSortingActive = btnTexts.some(t => t.trim() === '정렬 중...');
    log('정렬 중 버튼 비활성화', isSortingActive ? 'PASS' : 'FAIL');

    // 초기화 버튼 클릭 (중단)
    await page.getByText('초기화').click();
    await page.waitForTimeout(500);

    const btnTextsAfter = await page.locator('button').allTextContents();
    const isReset = btnTextsAfter.some(t => t.trim() === '정렬 시작');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '09-after-reset.png') });
    log('정렬 중단 (초기화)', isReset ? 'PASS' : 'FAIL');

    // 7. 모바일 반응형 검증
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '10-mobile.png') });
    log('모바일 뷰포트 렌더링', 'PASS');

    await page.setViewportSize({ width: 1440, height: 900 });

  } catch (err) {
    log('예외 발생', 'FAIL', err.message);
  } finally {
    await browser.close();
  }

  return results;
}

verify().then(results => {
  console.log('\n=== 검증 완료 ===');
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  console.log(`통과: ${passed}, 실패: ${failed}`);
  process.exit(failed > 0 ? 1 : 0);
});
