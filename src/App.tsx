import { useState } from 'react';
import { Toaster, toast } from 'sonner';
import { Search } from 'lucide-react';
import { Form } from './components/Form';
import { StatusBar } from './components/StatusBar';
import { CandidatesList } from './components/CandidatesList';
import { RationalesList } from './components/RationalesList';
import { CompanyCard } from './components/CompanyCard';
import { Toolbar } from './components/Toolbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Separator } from './components/ui/separator';
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
        toast.success('Report generated successfully!');
      } else {
        setError(response.error || 'Failed to generate report');
        setStatus('error');
        toast.error(response.error || 'Failed to generate report');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
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
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Toaster position="top-right" />

      <div className="container max-w-5xl mx-auto px-4 py-8 md:py-12">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Search className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Whale Hunter Report
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Generate comprehensive candidate research reports with intelligent analysis
          </p>
        </header>

        <div className="space-y-6">
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
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4">
                <h2 className="text-2xl font-semibold">Report Preview</h2>
                <Toolbar
                  pdfUrl={files?.pdfUrl}
                  jsonUrl={files?.jsonUrl}
                  enabled={status === 'completed'}
                />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Job Description</CardTitle>
                  <CardDescription>
                    Generated: {formatDate(reportData.now)} • Deadline:{' '}
                    {formatDate(reportData.deadline)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="leading-relaxed">{reportData.job_description}</p>
                </CardContent>
              </Card>

              <div>
                <h3 className="text-xl font-semibold mb-4">
                  Candidates ({reportData.candidates.length})
                </h3>
                <CandidatesList candidates={reportData.candidates} />
              </div>

              <Separator />

              <div>
                <h3 className="text-xl font-semibold mb-4">
                  Selection Rationales
                </h3>
                <RationalesList rationales={reportData.rationales} />
              </div>

              <Separator />

              <div>
                <h3 className="text-xl font-semibold mb-4">Company Information</h3>
                <CompanyCard company={reportData.company} />
              </div>
            </>
          )}

          {!reportData && status === 'idle' && (
            <Card className="border-dashed">
              <CardContent className="pt-12 pb-12 text-center">
                <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Configure your search parameters and click Generate to create a report
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <footer className="mt-12 pt-6 border-t text-center text-sm text-muted-foreground">
          Data via public search. Verify manually.
        </footer>
      </div>
    </div>
  );
}

export default App;
