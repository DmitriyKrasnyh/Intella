import { useState } from 'react';
import { Toaster, toast } from 'sonner';
import { Clock, FileText, Search, Sparkles } from 'lucide-react';
import { Form } from './components/Form';
import { StatusBar } from './components/StatusBar';
import { CandidatesList } from './components/CandidatesList';
import { RationalesList } from './components/RationalesList';
import { CompanyCard } from './components/CompanyCard';
import { Toolbar } from './components/Toolbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Separator } from './components/ui/separator';
import { Badge } from './components/ui/badge';
import { generateReport } from './lib/api';
import type { Language, JobStatus, ReportData } from './types';

function App() {
  const [lang, setLang] = useState<Language>('ru');
  const [deadlineDays, setDeadlineDays] = useState(2);
  const [query, setQuery] = useState('');
  const [maxResults, setMaxResults] = useState(40);
  const [status, setStatus] = useState<JobStatus>('idle');
  const [error, setError] = useState<string>();
  const [reportData, setReportData] = useState<ReportData>();
  const [files, setFiles] = useState<{ pdfUrl: string; jsonUrl: string }>();

  const handleGenerate = async () => {
    setStatus('running');
    setError(undefined);

    try {
      const response = await generateReport({
        lang,
        deadlineDays,
        query: query.trim() || undefined,
        maxResults
      });

      if (response.ok && response.data) {
        setReportData(response.data);
        setFiles(response.files);
        setStatus('completed');
        toast.success('Отчёт успешно сформирован!');
      } else {
        setError(response.error || 'Не удалось сформировать отчёт');
        setStatus('error');
        toast.error(response.error || 'Не удалось сформировать отчёт');
      }
    } catch (err) {
      const errorMessage = err instanceof Error
        ? err.message === 'Failed to fetch'
          ? 'Не удалось установить соединение с сервером'
          : err.message
        : 'Произошла непредвиденная ошибка';
      setError(errorMessage);
      setStatus('error');
      toast.error(errorMessage);
    }
  };

  const handleReset = () => {
    setLang('ru');
    setDeadlineDays(2);
    setQuery('');
    setMaxResults(40);
    setStatus('idle');
    setError(undefined);
    setReportData(undefined);
    setFiles(undefined);
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-white to-blue-100">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -right-32 h-72 w-72 rounded-full bg-sky-200 blur-3xl opacity-60" />
        <div className="absolute top-1/2 -left-32 h-80 w-80 rounded-full bg-blue-300 blur-3xl opacity-40" />
        <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-cyan-200 blur-3xl opacity-40" />
      </div>

      <Toaster position="top-right" richColors />

      <div className="container relative z-10 mx-auto max-w-5xl px-4 py-10 md:py-16">
        <header className="mb-12 space-y-6 text-center">
          <Badge className="mx-auto w-fit rounded-full border border-sky-200/60 bg-sky-600/10 px-4 py-1 text-sky-700 backdrop-blur">
            AI-помощник ресёрчера
          </Badge>
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center justify-center gap-3">
              <Search className="h-10 w-10 text-sky-600" />
              <h1 className="text-balance text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
                Whale Hunter — аналитический отчёт по кандидатам
              </h1>
            </div>
            <p className="text-muted-foreground text-balance mx-auto max-w-2xl">
              Получайте структурированные инсайты о рынке талантов, объединяющие поиск, аналитику и удобный экспорт, — всё на русском языке.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 text-left md:grid-cols-3">
            <div className="flex gap-4 rounded-3xl border border-white/60 bg-white/80 p-5 shadow-lg backdrop-blur">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-white">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900">Глубокий анализ</h3>
                <p className="text-sm text-slate-600">Алгоритм выделяет ключевые факторы и формирует понятные выводы.</p>
              </div>
            </div>
            <div className="flex gap-4 rounded-3xl border border-white/60 bg-white/80 p-5 shadow-lg backdrop-blur">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900">Сроки под контролем</h3>
                <p className="text-sm text-slate-600">Настройте дедлайн и объём выборки под конкретный запрос.</p>
              </div>
            </div>
            <div className="flex gap-4 rounded-3xl border border-white/60 bg-white/80 p-5 shadow-lg backdrop-blur">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-sky-600 text-white">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900">Готовый экспорт</h3>
                <p className="text-sm text-slate-600">Скачайте PDF или JSON, чтобы делиться отчётом с командой.</p>
              </div>
            </div>
          </div>
        </header>

        <div className="space-y-8">
          <Form
            lang={lang}
            deadlineDays={deadlineDays}
            query={query}
            maxResults={maxResults}
            isRunning={status === 'running'}
            onLangChange={setLang}
            onDeadlineDaysChange={setDeadlineDays}
            onQueryChange={setQuery}
            onMaxResultsChange={setMaxResults}
            onGenerate={handleGenerate}
            onReset={handleReset}
            onRegenerate={handleRegenerate}
            hasResults={!!reportData}
          />

          <StatusBar status={status} error={error} />

          {reportData && (
            <>
              <div className="flex flex-col items-start justify-between gap-4 pt-4 sm:flex-row sm:items-center">
                <h2 className="text-2xl font-semibold text-slate-900">Предпросмотр отчёта</h2>
                <Toolbar
                  pdfUrl={files?.pdfUrl}
                  jsonUrl={files?.jsonUrl}
                  enabled={status === 'completed'}
                />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Описание вакансии</CardTitle>
                  <CardDescription>
                    Сформировано: {formatDate(reportData.now)} • Дедлайн {formatDate(reportData.deadline)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="leading-relaxed">{reportData.job_description}</p>
                </CardContent>
              </Card>

              <div>
                <h3 className="mb-4 text-xl font-semibold text-slate-900">
                  Кандидаты ({reportData.candidates.length})
                </h3>
                <CandidatesList candidates={reportData.candidates} />
              </div>

              <Separator />

              <div>
                <h3 className="mb-4 text-xl font-semibold text-slate-900">Причины выбора</h3>
                <RationalesList rationales={reportData.rationales} />
              </div>

              <Separator />

              <div>
                <h3 className="mb-4 text-xl font-semibold text-slate-900">Информация о компании</h3>
                <CompanyCard company={reportData.company} />
              </div>
            </>
          )}

          {!reportData && status === 'idle' && (
            <Card className="border-dashed bg-white/70 shadow-inner backdrop-blur">
              <CardContent className="pb-12 pt-12 text-center">
                <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Настройте параметры поиска и нажмите «Сформировать отчёт», чтобы получить результат
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <footer className="mt-16 border-t pt-6 text-center text-sm text-muted-foreground">
          Данные собираются из открытых источников. Проверяйте ключевые факты перед использованием.
        </footer>
      </div>
    </div>
  );
}

export default App;
