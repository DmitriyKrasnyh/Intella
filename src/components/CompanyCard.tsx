import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ExternalLink } from 'lucide-react';
import type { Company } from '../types';

interface CompanyCardProps {
  company: Company;
}

export function CompanyCard({ company }: CompanyCardProps) {
  if (!company.name && !company.url && !company.snippet) {
    return (
      <Card className="rounded-3xl border border-white/60 bg-white/90 shadow-sm">
        <CardContent className="pt-6 text-center text-muted-foreground">
          Информация о компании отсутствует
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-3xl border border-white/60 bg-white/90 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-start justify-between gap-2 text-slate-900">
          <span>{company.name || 'Компания'}</span>
          {company.url && (
            <a
              href={company.url}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-sky-600 transition-colors hover:text-sky-700"
              aria-label="Перейти на сайт компании"
            >
              <ExternalLink className="h-5 w-5" />
            </a>
          )}
        </CardTitle>
        {company.url && (
          <CardDescription className="truncate text-slate-600">{company.url}</CardDescription>
        )}
      </CardHeader>
      {company.snippet && (
        <CardContent>
          <p className="text-sm leading-relaxed text-slate-600">
            {company.snippet}
          </p>
        </CardContent>
      )}
    </Card>
  );
}
