global =
    .income = Income
    .expense = Expense
    .unauthorized = I don't have permission to identify who you are. Try changing your Telegram profile settings.
    .invalid-token = Invalid Telegram key provided, please try again!
    .not-found = I couldn't find your account! Register to start saving operations. Use the /start command

start = Enter your unique Telegram key. You can find it here: https://app.monfuse.com/automations
    .already-registered = Hi { $first_name }! You’re already registered.
    .welcome =
        Hi { $first_name }, your registration was successful!

        You can now add your payments more easily using my interface!

        You can also send me photos of receipts and invoices, which I’ll process and save as appropriate operations, or send me voice messages with information about transactions.

error = An unknown error occurred, please try again!
    .text-irrelevant-message = I couldn't process the message, try phrasing it differently
    .voice-too-long = Sorry, your message is too long! The maximum voice message duration is 30 seconds
    .photo-download = I couldn't download the photo, please try again
    .undo-not-found = No recent operations found, try deleting them through the app

graph = 
    .weekly = 📊 Here's your expense chart from the past week based on labels

add =
    .type = Choose the type of operation:
    .title = New { $type }! What's the title?
    .amount = Alright! Enter the amount.
    .invalid-amount = Invalid amount, please try again!
    .success = 
        💸 I’ve added the following operations:
        { $operations }

undo =
    .success = 
        🔄 Successfully removed the following operations:
        { $operations }
