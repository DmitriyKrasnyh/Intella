import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ExternalLink } from 'lucide-react';
import { Badge } from './ui/badge';
import type { Candidate } from '../types';

interface CandidatesListProps {
  candidates: Candidate[];
}

export function CandidatesList({ candidates }: CandidatesListProps) {
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());

  const toggleCard = (index: number) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedCards(newExpanded);
  };

  if (candidates.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        Кандидаты не найдены
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {candidates.map((candidate, index) => {
        const isExpanded = expandedCards.has(index);
        const hasLongSnippet = candidate.snippet && candidate.snippet.length > 150;

        return (
          <Card
            key={index}
            className="rounded-3xl border border-white/60 bg-white/90 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <CardHeader className="space-y-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Badge className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-600/10 p-0 text-sm font-semibold text-sky-700">
                    {index + 1}
                  </Badge>
                  <div>
                    <CardTitle className="text-lg text-slate-900">{candidate.name}</CardTitle>
                    <CardDescription className="text-slate-600">{candidate.title}</CardDescription>
                  </div>
                </div>
                <a
                  href={candidate.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-sky-600 transition-colors hover:text-sky-700"
                  aria-label={`Открыть профиль ${candidate.name}`}
                >
                  <ExternalLink className="h-5 w-5" />
                </a>
              </div>
            </CardHeader>
            {candidate.snippet && (
              <CardContent>
                <p className="text-sm leading-relaxed text-slate-600">
                  {isExpanded || !hasLongSnippet
                    ? candidate.snippet
                    : `${candidate.snippet.substring(0, 150)}…`}
                </p>
                {hasLongSnippet && (
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => toggleCard(index)}
                    className="mt-2 px-0"
                  >
                    {isExpanded ? 'Свернуть текст' : 'Показать полностью'}
                  </Button>
                )}
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}
