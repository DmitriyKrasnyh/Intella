import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ExternalLink } from 'lucide-react';
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
      <div className="text-center py-8 text-muted-foreground">
        No candidates found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {candidates.map((candidate, index) => {
        const isExpanded = expandedCards.has(index);
        const hasLongSnippet = candidate.snippet && candidate.snippet.length > 150;

        return (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-start justify-between gap-2">
                <span>{candidate.name}</span>
                <a
                  href={candidate.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 transition-colors shrink-0"
                  aria-label={`View ${candidate.name}'s profile`}
                >
                  <ExternalLink className="h-5 w-5" />
                </a>
              </CardTitle>
              <CardDescription>{candidate.title}</CardDescription>
            </CardHeader>
            {candidate.snippet && (
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {isExpanded || !hasLongSnippet
                    ? candidate.snippet
                    : `${candidate.snippet.substring(0, 150)}...`}
                </p>
                {hasLongSnippet && (
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => toggleCard(index)}
                    className="px-0 mt-1"
                  >
                    {isExpanded ? 'Show less' : 'Show more'}
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
