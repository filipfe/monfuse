import Block from "@/components/ui/block";
import Ref from "./ref";
import { getTimeline } from "@/lib/recurring-payments/actions";

// const CustomTooltip = ({
//   dict,
//   active,
//   payload,
//   labelFormatter,
//   currency,
// }: TooltipProps<ValueType, NameType> & {
//   dict: Dict["private"]["general"]["incomes"] &
//     Dict["private"]["general"]["expenses"];
//   labelFormatter: (
//     label: any,
//     payload: Payload<ValueType, NameType>[]
//   ) => ReactNode;
//   currency: string;
// }) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="rounded-md bg-white text-font border-font/10 border min-w-44 shadow-lg shadow-font/5">
//         <div className="py-2 px-4 border-b border-font/10">
//           <p className="text-sm">
//             {labelFormatter(payload[0].payload.date, payload[0].payload)}
//           </p>
//         </div>
//         {payload.map((record, k) => (
//           <div className="py-2 px-4 flex items-center justify-between gap-6">
//             <div className="flex items-center gap-2">
//               {record.color && (
//                 <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center shadow">
//                   <div
//                     style={{
//                       backgroundColor: record.color,
//                       opacity: k === 0 ? 1 : 0.5,
//                     }}
//                     className="w-2 h-2 rounded-full"
//                   />
//                 </div>
//               )}
//               <span className="text-sm">
//                 {record.dataKey === "total_expenses"
//                   ? recordLabels.expenses
//                   : recordLabels.incomes}
//               </span>
//             </div>
//             <strong className="font-medium text-sm">
//               <NumberFormat
//                 currency={currency}
//                 amount={record.value ? parseFloat(record.value.toString()) : 0}
//               />
//             </strong>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   return null;
// };

export default async function Timeline() {
  //   dict,
  // }: {
  //   dict: {
  //     general: {
  //       incomes: Dict["private"]["general"]["incomes"];
  //       expenses: Dict["private"]["general"]["expenses"];
  //     };
  //   } & Dict["private"]["stats"]["balance-by-month"];
  //   const { data: results, isLoading } = useBalanceHistory(
  //     "Europe/Warsaw",
  //     "PLN",
  //     10,
  //     2024
  //   );
  const { results } = await getTimeline();

  return (
    <Block className="xl:row-start-1 xl:row-end-4 col-span-2" title="Timeline">
      <div className="flex justify-between items-end h-[127px]">
        {results.map(({ date, incomes, expenses }, index) => (
          <Ref
            key={date}
            date={date}
            isToday={index === 7}
            incomes={incomes}
            expenses={expenses}
          />
        ))}
      </div>
    </Block>
  );
}
