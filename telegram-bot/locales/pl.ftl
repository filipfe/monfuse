global =
    .income = Przychód
    .expense = Wydatek
    .unauthorized = Nie posiadam uprawnień do zidentyfikowania kim jesteś. Spróbuj zmienić ustawienia profilu Telegram
    .invalid-token = Podano nieprawidłowy klucz Telegram, spróbuj ponownie!
    .not-found = Nie znalazłem twojego konta! Zarejestruj się, aby zapisywać operacje. Wpisz komendę /start

start = Podaj swój unikalny klucz Telegram. Znajdziesz go tutaj: https://app.monfuse.com/automations
    .already-registered = Podaj swój unikalny klucz Telegram. Znajdziesz go tutaj: https://app.monfuse.com/automations
    .welcome =
        Cześć { $first_name }, twoja rejestracja przebiegła pomyślnie!

        Możesz teraz dodawać swoje płatności łatwiej za pomocą mojego interfejsu!

        Możesz również wysyłać mi zdjęcia paragonów i faktur, które przetworzę i zapiszę jako odpowiednie operacje lub wysyłać mi wiadomości głosowe z informacjami o operacjach.

error = Wystąpił nieznany błąd, spróbuj ponownie!
    .text-irrelevant-message = Nie mogłem przetworzyć wiadomości, spróbuj innego sformułowania
    .voice-too-long = Wybacz, twoja wiadomość jest za długa! Maksymalny czas trwania wiadomości głosowej to 30 sekund
    .photo-download = Nie udało mi się pobrać zdjęcia, spróbuj ponownie
    .undo-not-found = Nie znaleziono ostatnich operacji, spróbuj usunąć je poprzez aplikację

text =
    .success = 
        💸 Dodałem następujące operacje:
        { $operations }

graph = 
    .weekly = 📊 Oto twój wykres wydatków z przeszłego tygodnia na podstawie etykiet

add =
    .type = Wybierz typ operacji:

undo =
    .success = 
        🔄 Pomyślnie usunięto następujące operacje:
        { $operations }