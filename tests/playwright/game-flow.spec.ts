import { test, expect, type Page } from '@playwright/test'

// Answers match the mock questions defined in app/api/mock-opentdb/[...slug]/route.ts
const CORRECT_ANSWERS = ['Paris', '4', 'Blue', '7', 'Jupiter']
const WRONG_ANSWERS = ['Madrid', '3', 'Red', '5', 'Saturn']

async function startGame(page: Page) {
  await page.goto('/')
  // General Knowledge is pre-selected (first slide in the carousel)
  await page.getByLabel('Easy').click()
  await page.getByRole('button', { name: 'Play!' }).click()
  await page.waitForURL('**/game/**')
  // Wait for the game content to finish streaming from the server component.
  // The Next button is the last element rendered — if it's present, everything
  // else (question counter, question text, answer buttons) is also in the DOM.
  await page.getByRole('button', { name: 'Next', exact: true }).waitFor()
}

async function completeGame(page: Page, answers: string[]) {
  for (let i = 0; i < answers.length - 1; i++) {
    await page.getByRole('button', { name: answers[i] }).click()
    await page.getByRole('button', { name: 'Next', exact: true }).click()
  }
  // Last question: select answer, then 1-second timer auto-advances
  await page.getByRole('button', { name: answers[answers.length - 1] }).click()
  await page.waitForURL('**/result**')
  // Wait for result content — sessionStorage read + render is async on the client
  await page.getByRole('button', { name: 'Restart' }).waitFor()
}

test.describe('Trivia game flow', () => {

  test('setup page shows category carousel and difficulty options', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByAltText('General Knowledge')).toBeVisible()
    await expect(page.getByLabel('Easy')).toBeVisible()
    await expect(page.getByLabel('Medium')).toBeVisible()
    await expect(page.getByLabel('Hard')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Play!' })).toBeVisible()
  })

  test('redirects to /game/[sessionId] after submitting setup', async ({ page }) => {
    await startGame(page)

    expect(page.url()).toContain('/game/')
    expect(page.url()).toContain('categoryId=9')
    expect(page.url()).toContain('difficulty=easy')
  })

  test('shows first question and answer options', async ({ page }) => {
    await startGame(page)

    await expect(page.getByText('Question 1/5')).toBeVisible()
    await expect(page.getByText('What is the capital of France?')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Paris' })).toBeVisible()
  })

  test('Next button is disabled before answering', async ({ page }) => {
    await startGame(page)

    await expect(page.getByRole('button', { name: 'Next', exact: true })).toBeDisabled()
  })

  test('Next button is enabled after selecting an answer', async ({ page }) => {
    await startGame(page)

    await page.getByRole('button', { name: 'Paris' }).click()
    await expect(page.getByRole('button', { name: 'Next', exact: true })).toBeEnabled()
  })

  test('advances to next question after clicking Next', async ({ page }) => {
    await startGame(page)

    await page.getByRole('button', { name: 'Paris' }).click()
    await page.getByRole('button', { name: 'Next', exact: true }).click()

    await expect(page.getByText('Question 2/5')).toBeVisible()
    await expect(page.getByText('How much is 2 + 2?')).toBeVisible()
  })

  test('Next button is hidden on the last question', async ({ page }) => {
    await startGame(page)

    for (let i = 0; i < CORRECT_ANSWERS.length - 1; i++) {
      await page.getByRole('button', { name: CORRECT_ANSWERS[i] }).click()
      await page.getByRole('button', { name: 'Next', exact: true }).click()
    }

    await expect(page.getByRole('button', { name: 'Next', exact: true })).not.toBeVisible()
  })

  test('redirects to result page after finishing the game', async ({ page }) => {
    await startGame(page)
    await completeGame(page, CORRECT_ANSWERS)

    expect(page.url()).toContain('/result')
  })

  test('shows correct score when all answers are correct (100 points)', async ({ page }) => {
    await startGame(page)
    await completeGame(page, CORRECT_ANSWERS)

    await expect(page.getByText('100 pts')).toBeVisible()
  })

  test('shows correct score when no answers are correct (0 points)', async ({ page }) => {
    await startGame(page)
    await completeGame(page, WRONG_ANSWERS)

    await expect(page.getByText('0 pts')).toBeVisible()
  })

  test('Restart button replays with same config', async ({ page }) => {
    await startGame(page)
    await completeGame(page, CORRECT_ANSWERS)

    await page.getByRole('button', { name: 'Restart' }).click()

    await page.waitForURL('**/game/**')
    expect(page.url()).toContain('categoryId=9')
    expect(page.url()).toContain('difficulty=easy')
  })

  test('Exit button redirects to setup page', async ({ page }) => {
    await startGame(page)
    await completeGame(page, CORRECT_ANSWERS)

    await page.getByRole('link', { name: 'Exit' }).click()

    await page.waitForURL('/')
    expect(page.url()).toBe('http://localhost:3001/')
  })
})
