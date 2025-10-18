import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ExternalLink } from 'lucide-react';
import type { Company } from '../types';

interface CompanyCardProps {
  company: Company;
}

export function CompanyCard({ company }: CompanyCardProps) {
  if (!company.name && !company.url && !company.snippet) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground">
          No company information available
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-start justify-between gap-2">
          <span>{company.name || 'Company'}</span>
          {company.url && (
            <a
              href={company.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 transition-colors shrink-0"
              aria-label="Visit company website"
            >
              <ExternalLink className="h-5 w-5" />
            </a>
          )}
        </CardTitle>
        {company.url && (
          <CardDescription className="truncate">{company.url}</CardDescription>
        )}
      </CardHeader>
      {company.snippet && (
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {company.snippet}
          </p>
        </CardContent>
      )}
    </Card>
  );
}
