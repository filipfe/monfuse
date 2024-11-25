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
    welcome: `Cześć { $first_name },
Twoja rejestracja przebiegła pomyślnie!

Możesz teraz pisać mi o swoich przychodach i wydatkach, a ja będę je zapisywać na twoim koncie!
    
Możesz również wysyłać mi zdjęcia paragonów i faktur, które przetworzę i zapiszę jako odpowiednie operacje lub wysyłać mi wiadomości głosowe z informacjami o operacjach

Aby zobaczyć dostępne komendy wpisz /pomoc

Wypróbuj dodawanie operacji wpisując komendę /dodaj`,
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
  },
  text: {
    success: `💸 Dodałem następujące operacje:
{ $operations }`,
  },
};

export default pl;
