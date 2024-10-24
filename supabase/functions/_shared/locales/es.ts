const es = {
  global: {
    unauthorized:
      "No tengo permisos para identificar quién eres. Intenta cambiar la configuración de tu perfil de Telegram.",
    "invalid-token":
      "La clave de Telegram proporcionada no es válida, ¡inténtalo de nuevo!",
    "not-found":
      "¡No encontré tu cuenta! Regístrate para comenzar a guardar operaciones. Escribe el comando /start",
  },
  start: {
    registration:
      "Proporciona tu clave única de Telegram. La puedes encontrar aquí: https://app.monfuse.com/automations",
    welcome: `Hola { $first_name },
  ¡Tu registro fue exitoso!
  
  ¡Ahora puedes decirme sobre tus ingresos y gastos, y los guardaré en tu cuenta!
  
  También puedes enviarme fotos de recibos y facturas, que procesaré y guardaré como las operaciones correspondientes, o enviarme mensajes de voz con los detalles de las operaciones.
  
  Para ver los comandos disponibles, escribe /ayuda
  
  Prueba a añadir una operación escribiendo el comando /añadir`,
    "already-registered":
      "¡Hola { $first_name }! El registro ya se ha completado.",
  },
};

export default es;
