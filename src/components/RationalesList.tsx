import { Card, CardContent } from './ui/card';

interface RationalesListProps {
  rationales: string[];
}

export function RationalesList({ rationales }: RationalesListProps) {
  if (rationales.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        Причины не указаны
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {rationales.map((rationale, index) => (
        <Card
          key={index}
          className="rounded-3xl border border-white/60 bg-white/90 shadow-sm backdrop-blur"
        >
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-sky-600/10 text-sm font-semibold text-sky-700">
                {index + 1}
              </div>
              <p className="text-sm leading-relaxed text-slate-600">{rationale}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
