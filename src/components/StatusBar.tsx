import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import type { JobStatus } from '../types';

interface StatusBarProps {
  status: JobStatus;
  error?: string;
}

export function StatusBar({ status, error }: StatusBarProps) {
  if (status === 'idle') {
    return null;
  }

  if (status === 'error' && error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (status === 'running') {
    return (
      <Alert className="border-blue-200 bg-blue-50 text-blue-900">
        <Loader2 className="h-4 w-4 animate-spin" />
        <AlertDescription className="flex flex-col gap-2">
          <span>Generating report...</span>
          <Progress className="w-full h-2" />
        </AlertDescription>
      </Alert>
    );
  }

  if (status === 'completed') {
    return (
      <Alert className="border-green-200 bg-green-50 text-green-900">
        <CheckCircle2 className="h-4 w-4" />
        <AlertDescription>Report generated successfully!</AlertDescription>
      </Alert>
    );
  }

  return null;
}
