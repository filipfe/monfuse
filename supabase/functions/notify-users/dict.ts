import { Locale } from "../_shared/types.ts";

type Dict = {
  graph: string;
};

const dict: Record<Locale, Dict> = {
  pl: {
    graph:
      "Cześć ${first_name}!\n📊 Oto twój wykres wydatków z poprzedniego tygodnia na podstawie etykiet. Tak trzymaj!",
  },
  en: {
    graph:
      "Hi ${first_name}!\n📊 Here's your expense chart from the previous week based on labels. Keep it up!",
  },
  es: {
    graph:
      "¡Hola ${first_name}!\n📊 Aquí está tu gráfico de gastos de la semana pasada basado en etiquetas. ¡Sigue así!",
  },
};

export default dict;
