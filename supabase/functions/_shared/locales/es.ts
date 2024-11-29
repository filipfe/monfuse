const es = {
  global: {
    unauthorized:
      "No tengo permisos para identificar quién eres. Intenta cambiar la configuración de tu perfil de Telegram.",
    "invalid-token":
      "La clave de Telegram proporcionada no es válida, ¡inténtalo de nuevo!",
    "not-found":
      "¡No encontré tu cuenta! Regístrate para comenzar a guardar operaciones. Escribe el comando /start",
    error: "Ocurrió un error, por favor intenta de nuevo",
    income: "Ingreso",
    expense: "Gasto",
  },
  start: {
    registration:
      "Proporciona tu clave única de Telegram. La puedes encontrar aquí: https://app.monfuse.com/automations",
    welcome:
      "Hola { $first_name },\n\n¡Tu registro fue exitoso!\n\n¡Ahora puedes decirme sobre tus ingresos y gastos, y los guardaré en tu cuenta!\n\nTambién puedes enviarme fotos de recibos y facturas, que procesaré y guardaré como las operaciones correspondientes, o enviarme mensajes de voz con los detalles de las operaciones.\n\nPara ver los comandos disponibles, escribe /ayuda",
    "already-registered":
      "¡Hola { $first_name }! El registro ya se ha completado.",
  },
  _error: {
    "text-irrelevant-message":
      "No pude procesar el mensaje, por favor intenta con otra formulación",
    "voice-too-long":
      "¡Perdón, tu mensaje es demasiado largo! La duración máxima de un mensaje de voz es de 30 segundos",
    "photo-download": "No pude recuperar la imagen, por favor intenta de nuevo",
    "photo-unknown":
      "Ocurrió un error al procesar tus fotos, por favor intenta de nuevo.",
    "undo-not-found":
      "No se encontraron operaciones recientes, intenta eliminarlas a través de la aplicación",
  },
  text: {
    success: `💸 He añadido las siguientes operaciones:
{ $operations }`,
  },
  graph: {
    weekly:
      "📊 Aquí tienes tu gráfico de gastos de la semana pasada basado en las etiquetas",
  },
  undo: {
    success:
      "🔄 Se eliminaron con éxito las siguientes operaciones:\n\n{ $operations }",
  },
};

export default es;
