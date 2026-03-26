import { Sparkles } from "lucide-react";

interface NewBadgeProps {
  date: string;
}

export function NewBadge({ date }: NewBadgeProps) {
  const isNew = () => {
    const articleDate = new Date(date);
    const now = new Date();
    const hoursDiff = (now.getTime() - articleDate.getTime()) / (1000 * 60 * 60);
    return hoursDiff <= 24;
  };

  if (!isNew()) return null;

  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full animate-pulse">
      <Sparkles className="size-3" />
      NEW
    </span>
  );
}
