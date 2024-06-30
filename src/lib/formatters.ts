const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency",
  minimumFractionDigits: 0,
})

/**
 * Formats a given amount as a currency string.
 *
 * @param {number} amount - The amount of money to be formatted.
 * @returns {string} - The formatted currency string.
 */
export function formatCurrency(amount: number) {
  return CURRENCY_FORMATTER.format(amount)
}

const NUMBER_FORMATTER = new Intl.NumberFormat("en-US")

/**
 * Formats a given number as a number string.
 *
 * @param {number} number - The number to be formatted.
 * @returns {string} - The formatted number string.
 */
export function formatNumber(number: number) {
  return NUMBER_FORMATTER.format(number)
}
