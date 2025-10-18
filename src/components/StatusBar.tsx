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
      <Alert variant="destructive" className="rounded-2xl border border-red-200 bg-red-50 text-red-900">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (status === 'running') {
    return (
      <Alert className="rounded-2xl border border-sky-200 bg-sky-50 text-sky-900">
        <Loader2 className="h-4 w-4 animate-spin" />
        <AlertDescription className="flex flex-col gap-2">
          <span className="font-medium">Идёт формирование отчёта…</span>
          <span className="text-xs text-sky-700">
            Пожалуйста, подождите — система собирает открытые источники и структурирует аналитику.
          </span>
          <Progress className="w-full h-2" />
        </AlertDescription>
      </Alert>
    );
  }

  if (status === 'completed') {
    return (
      <Alert className="rounded-2xl border border-green-200 bg-green-50 text-green-900">
        <CheckCircle2 className="h-4 w-4" />
        <AlertDescription className="flex flex-col gap-1">
          <span className="font-medium">Отчёт готов — можно изучать результаты.</span>
          <span className="text-xs text-green-700">
            Используйте кнопки выше, чтобы скачать PDF или JSON и поделиться с командой.
          </span>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}
