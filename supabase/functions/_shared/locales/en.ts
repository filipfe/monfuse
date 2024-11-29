const en = {
  global: {
    unauthorized:
      "I don't have permission to identify who you are. Try changing your Telegram profile settings.",
    "invalid-token": "The provided Telegram key is invalid, please try again!",
    "not-found":
      "I couldn't find your account! Register to start saving operations. Type the command /start",
    error: "An error occurred, please try again!",
    income: "Income",
    expense: "Expense",
  },
  start: {
    registration:
      "Provide your unique Telegram key. You can find it here: https://app.monfuse.com/automations",
    welcome:
      "Hi { $first_name },\n\nYour registration was successful!\n\nYou can now tell me about your income and expenses, and I will save them to your account!\n\nYou can also send me photos of receipts and invoices, which I will process and save as the corresponding operations, or send me voice messages with operation details.\n\nTo see available commands, type /help",
    "already-registered":
      "Hi { $first_name }! Registration has already been completed.",
  },
  _error: {
    "text-irrelevant-message":
      "I couldn't process the message, please try a different phrasing",
    "voice-too-long":
      "Sorry, your message is too long! The maximum duration for a voice message is 30 seconds",
    "photo-download": "I couldn't retrive the image, please try again",
    "photo-unknown":
      "An error occurred while processing the photos, please try again.",
    "undo-not-found":
      "No recent operations found, try removing them via the application",
  },
  text: {
    success: `💸 I added the following operations:
{ $operations }`,
  },
  graph: {
    weekly: "📊 Here is your expense chart from last week based on labels",
  },
  undo: {
    success:
      "🔄 Successfully deleted the following operations:\n\n{ $operations }",
  },
};

export default en;
