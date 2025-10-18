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
    <div className="space-y-6 p-6 border rounded-lg bg-card">
      <div>
        <Label className="text-base font-semibold">Language</Label>
        <RadioGroup
          value={lang}
          onValueChange={(value) => onLangChange(value as Language)}
          className="flex gap-4 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="ru" id="lang-ru" />
            <Label htmlFor="lang-ru" className="font-normal cursor-pointer">
              Russian
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="en" id="lang-en" />
            <Label htmlFor="lang-en" className="font-normal cursor-pointer">
              English
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="deadline">Deadline (days)</Label>
          <Input
            id="deadline"
            type="number"
            min={1}
            value={deadlineDays}
            onChange={(e) => onDeadlineDaysChange(Math.max(1, parseInt(e.target.value) || 1))}
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="maxResults">Max results</Label>
          <Input
            id="maxResults"
            type="number"
            min={10}
            step={10}
            value={maxResults}
            onChange={(e) => onMaxResultsChange(Math.max(10, parseInt(e.target.value) || 10))}
            className="mt-1.5"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="query">Search query (optional)</Label>
        <Input
          id="query"
          type="text"
          placeholder="Enter specific search terms..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="mt-1.5"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          onClick={onGenerate}
          disabled={isRunning}
          className="flex-1 md:flex-initial"
        >
          {isRunning ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Generating...
            </>
          ) : (
            'Generate'
          )}
        </Button>

        {hasResults && (
          <Button
            onClick={onRegenerate}
            disabled={isRunning}
            variant="outline"
          >
            Regenerate
          </Button>
        )}

        <Button
          onClick={onReset}
          disabled={isRunning}
          variant="outline"
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
