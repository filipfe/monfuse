import { satoshi } from "@/assets/font/satoshi";
import { useCallback, useEffect, useRef, useState } from "react";
import { YAxisProps } from "recharts";

const checkWidth = (label: string): number => {
  const tempElement = document.createElement("p");
  tempElement.classList.add(satoshi.className);
  tempElement.style.visibility = "hidden";
  tempElement.style.position = "absolute";
  tempElement.style.width = "max-content";
  tempElement.style.fontSize = "12px";

  tempElement.textContent = label;

  document.body.appendChild(tempElement);

  const width = tempElement.offsetWidth;

  document.body.removeChild(tempElement);
  return width;
};

export default function useYAxisWidth(
  currency?: string,
  language?: Lang,
  formatter?: (value: number) => string
): YAxisProps {
  const [longestTick, setLongestTick] = useState(0);
  const longestTickRef = useRef(0);

  const tickFormatter = useCallback(
    (val: number): string => {
      const formattedTick = formatter
        ? formatter(val)
        : currency
        ? new Intl.NumberFormat(language, {
            style: "currency",
            currency,
            notation: "compact",
          }).format(val)
        : val.toString();
      const width = checkWidth(formattedTick);
      if (width > longestTick) {
        longestTickRef.current = width;
      }
      return formattedTick;
    },
    [currency, formatter, longestTick]
  );

  return {
    width: longestTick + 8.2 * 1,
    tickFormatter,
  };
}
