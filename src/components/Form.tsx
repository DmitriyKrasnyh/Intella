import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import type { Language } from '../types';

interface FormProps {
  lang: Language;
  deadlineDays: number;
  query: string;
  maxResults: number;
  isRunning: boolean;
  onLangChange: (lang: Language) => void;
  onDeadlineDaysChange: (days: number) => void;
  onQueryChange: (query: string) => void;
  onMaxResultsChange: (max: number) => void;
  onGenerate: () => void;
  onReset: () => void;
  onRegenerate: () => void;
  hasResults: boolean;
}

export function Form({
  lang,
  deadlineDays,
  query,
  maxResults,
  isRunning,
  onLangChange,
  onDeadlineDaysChange,
  onQueryChange,
  onMaxResultsChange,
  onGenerate,
  onReset,
  onRegenerate,
  hasResults
}: FormProps) {
  return (
    <div className="space-y-6 rounded-3xl border border-white/60 bg-white/80 p-6 shadow-xl backdrop-blur">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">Настройки отчёта</h2>
        <p className="text-sm text-slate-600">
          Уточните параметры поиска, чтобы получить максимально релевантную выдачу.
        </p>
      </div>

      <div>
        <Label className="text-base font-semibold text-slate-900">Язык отчёта</Label>
        <p className="text-xs text-slate-500">От выбранного языка зависят формулировки и текст итогового отчёта.</p>
        <RadioGroup
          value={lang}
          onValueChange={(value) => onLangChange(value as Language)}
          className="mt-3 flex flex-col gap-3 sm:flex-row"
        >
          <div className="flex items-center space-x-2 rounded-2xl border border-slate-200/60 bg-white/70 px-4 py-2 shadow-sm transition hover:border-sky-200">
            <RadioGroupItem value="ru" id="lang-ru" />
            <Label htmlFor="lang-ru" className="cursor-pointer font-medium">
              Русский
            </Label>
          </div>
          <div className="flex items-center space-x-2 rounded-2xl border border-slate-200/60 bg-white/70 px-4 py-2 shadow-sm transition hover:border-sky-200">
            <RadioGroupItem value="en" id="lang-en" />
            <Label htmlFor="lang-en" className="cursor-pointer font-medium">
              Английский
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="deadline" className="text-slate-900">
            Срок в днях
          </Label>
          <Input
            id="deadline"
            type="number"
            min={1}
            value={deadlineDays}
            onChange={(e) => onDeadlineDaysChange(Math.max(1, parseInt(e.target.value) || 1))}
          />
          <p className="text-xs text-slate-500">Укажите, когда отчёт должен быть готов.</p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="maxResults" className="text-slate-900">
            Максимум результатов
          </Label>
          <Input
            id="maxResults"
            type="number"
            min={10}
            step={10}
            value={maxResults}
            onChange={(e) => onMaxResultsChange(Math.max(10, parseInt(e.target.value) || 10))}
          />
          <p className="text-xs text-slate-500">Контролируйте глубину выборки кандидатов.</p>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="query" className="text-slate-900">
          Поисковый запрос (опционально)
        </Label>
        <Input
          id="query"
          type="text"
          placeholder="Например: финтех, Москва, Python senior"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
        <p className="text-xs text-slate-500">Добавьте ключевые слова, чтобы сфокусировать поиск.</p>
      </div>

      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        <Button
          onClick={onGenerate}
          disabled={isRunning}
          className="flex-1 gap-2 sm:flex-initial"
        >
          {isRunning ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Формирование...
            </>
          ) : (
            'Сформировать отчёт'
          )}
        </Button>

        {hasResults && (
          <Button
            onClick={onRegenerate}
            disabled={isRunning}
            variant="secondary"
            className="flex-1 sm:flex-initial"
          >
            Пересоздать
          </Button>
        )}

        <Button
          onClick={onReset}
          disabled={isRunning}
          variant="outline"
          className="flex-1 sm:flex-initial"
        >
          Сбросить
        </Button>
      </div>
    </div>
  );
}
