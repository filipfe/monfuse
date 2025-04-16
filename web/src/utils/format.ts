export function formatPrice(
  price?: number | string | null,
  currency = "USD",
  language = "en-US",
) {
  if (typeof price === "string") {
    price = parseFloat(price);
  }
  if (typeof price !== "number") return "-";
  return new Intl.NumberFormat(language, {
    style: "currency",
    currency,
  }).format(price);
}

export function formatNumber(
  value?: number | string | null,
  language = "en-US",
) {
  let validatedValue = value;
  if (validatedValue === null || validatedValue === undefined) return "-";
  if (typeof validatedValue === "string") {
    validatedValue = parseFloat(validatedValue);
  }
  if (isNaN(validatedValue)) return "-";
  return new Intl.NumberFormat(language).format(validatedValue);
}
