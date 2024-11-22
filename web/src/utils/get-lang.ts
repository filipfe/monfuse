export default function getLang(locale: Locale) {
  const [lang] = locale.split("-");
  return lang as Lang;
}
