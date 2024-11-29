const pl = {
  global: {
    unauthorized:
      "Nie posiadam uprawnień do zidentyfikowania kim jesteś. Spróbuj zmienić ustawienia profilu Telegram.",
    "invalid-token": "Podano nieprawidłowy klucz Telegram, spróbuj ponownie!",
    "not-found":
      "Nie znalazłem twojego konta! Zarejestruj się, aby zapisywać operacje. Wpisz komendę /start",
    error: "Wystąpił błąd, spróbuj ponownie!",
    income: "Przychód",
    expense: "Wydatek",
  },
  start: {
    registration:
      "Podaj swój unikalny klucz Telegram. Znajdziesz go tutaj: https://app.monfuse.com/automations",
    welcome:
      "Cześć { $first_name },\n\nTwoja rejestracja przebiegła pomyślnie!\n\nMożesz teraz pisać mi o swoich przychodach i wydatkach, a ja będę je zapisywać na twoim koncie!\n\nMożesz również wysyłać mi zdjęcia paragonów i faktur, które przetworzę i zapiszę jako odpowiednie operacje lub wysyłać mi wiadomości głosowe z informacjami o operacjach\n\nAby zobaczyć dostępne komendy wpisz /pomoc",
    "already-registered":
      "Cześć { $first_name }! Rejestracja została już wykonana.",
  },
  _error: {
    "text-irrelevant-message":
      "Nie mogłem przetworzyć wiadomości, spróbuj innego sformułowania",
    "voice-too-long":
      "Wybacz, twoja wiadomość jest za długa! Maksymalny czas trwania wiadomości głosowej to 30 sekund",
    "photo-download": "Nie udało mi się pobrać zdjęcia, spróbuj ponownie",
    "photo-unknown":
      "Wystąpił błąd przy przetwarzaniu twoich zdjęć, spróbuj ponownie",
    "undo-not-found":
      "Nie znaleziono ostatnich operacji, spróbuj usunąć je poprzez aplikację",
  },
  text: {
    success: `💸 Dodałem następujące operacje:
{ $operations }`,
  },
  graph: {
    weekly:
      "📊 Oto twój wykres wydatków z przeszłego tygodnia na podstawie etykiet",
  },
  undo: {
    success: "🔄 Pomyślnie usunięto następujące operacje:\n\n{ $operations }",
  },
};

export default pl;
