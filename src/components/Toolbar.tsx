import { Button } from './ui/button';
import { Download, FileJson } from 'lucide-react';
import { downloadFile } from '../lib/api';
import { toast } from 'sonner';

interface ToolbarProps {
  pdfUrl?: string;
  jsonUrl?: string;
  enabled: boolean;
}

export function Toolbar({ pdfUrl, jsonUrl, enabled }: ToolbarProps) {
  const handleDownloadPdf = async () => {
    if (!pdfUrl) return;

    try {
      await downloadFile(pdfUrl, 'whale-hunter-report.pdf');
      toast.success('PDF успешно скачан');
    } catch {
      toast.error('Не удалось скачать PDF');
    }
  };

  const handleDownloadJson = async () => {
    if (!jsonUrl) return;

    try {
      await downloadFile(jsonUrl, 'whale-hunter-report.json');
      toast.success('JSON успешно скачан');
    } catch {
      toast.error('Не удалось скачать JSON');
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        onClick={handleDownloadPdf}
        disabled={!enabled || !pdfUrl}
        variant="outline"
        className="flex-1 sm:flex-initial"
      >
        <Download className="mr-2 h-4 w-4" />
        Скачать PDF
      </Button>

      <Button
        onClick={handleDownloadJson}
        disabled={!enabled || !jsonUrl}
        variant="outline"
        className="flex-1 sm:flex-initial"
      >
        <FileJson className="mr-2 h-4 w-4" />
        Скачать JSON
      </Button>
    </div>
  );
}
