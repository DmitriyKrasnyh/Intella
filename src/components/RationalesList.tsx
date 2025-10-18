import { Card, CardContent } from './ui/card';

interface RationalesListProps {
  rationales: string[];
}

export function RationalesList({ rationales }: RationalesListProps) {
  if (rationales.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No rationales available
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {rationales.map((rationale, index) => (
        <Card key={index}>
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                {index + 1}
              </div>
              <p className="text-sm leading-relaxed">{rationale}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
