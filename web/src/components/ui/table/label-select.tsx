import { useLabels } from "@/lib/operations/queries";
import { Dict } from "@/const/dict";
import { CURRENCIES } from "@/const";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface Props extends State {
  dict: {
    label: string;
    default: string;
    description: string;
  };
}

export default function LabelSelect({ dict, value, onChange }: Props) {
  const { data: labels, isLoading } = useLabels();

  return (
    <Select disabled={isLoading} value={value} onValueChange={onChange}>
      <SelectTrigger label={dict.label}>
        {labels?.find((label) => label.name === value)?.name || dict.default}
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="*">{dict.default}</SelectItem>
        {labels &&
          labels.map((label) => (
            <SelectItem value={label.name} key={label.name}>
              {label.name}
              <p className="text-xs text-muted-foreground">
                {label.count} {dict.description}
              </p>
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
}
