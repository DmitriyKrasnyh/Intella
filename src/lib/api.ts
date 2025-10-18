import type { GenerateParams, GenerateResponse } from '../types';

const MOCK_MODE = import.meta.env.VITE_MOCK === '1';

const mockData: GenerateResponse = {
  ok: true,
  data: {
    lang: 'ru',
    now: new Date().toISOString(),
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    job_description:
      'Ищем старшего backend-разработчика (Python) с опытом от 5 лет и экспертизой в проектировании распределённых систем. Важно глубокое понимание микросервисной архитектуры, Docker и Kubernetes, а также практический опыт работы с PostgreSQL, Redis и очередями сообщений.',
    candidates: [
      {
        name: 'Алексей Петров',
        title: 'Ведущий backend-инженер, TechCorp',
        url: 'https://linkedin.com/in/alex-petrov',
        snippet:
          '7 лет развивает Python-бэкенды и проектирует микросервисы, выдерживающие 10M+ запросов в сутки. Сильен в оптимизации PostgreSQL, проектировании распределённых систем и менторстве команды.'
      },
      {
        name: 'Мария Иванова',
        title: 'Старший инженер-программист, DataSystems',
        url: 'https://linkedin.com/in/maria-ivanova',
        snippet:
          'Full-stack инженер с фокусом на серверной части. 6 лет работает с Python, Django и FastAPI, разворачивает облачную инфраструктуру и управляет кластерами Kubernetes в продакшене.'
      },
      {
        name: 'Дмитрий Соколов',
        title: 'Архитектор бэкенда, CloudServices',
        url: 'https://linkedin.com/in/dmitry-sokolov',
        snippet:
          'Архитектор бэкенда с 8-летним опытом построения высоконагруженных систем. Глубоко разбирается в очередях сообщений, стратегиях кеширования и проектировании баз данных.'
      }
    ],
    rationales: [
      'Алексей Петров сочетает техническое лидерство и практический опыт в стеке проекта. Его кейсы масштабирования микросервисов напрямую коррелируют с нашими задачами роста.',
      'Мария Иванова закрывает потребность в современном Python-стеке и облачной инфраструктуре. Уверенно работает с Kubernetes и практиками IaC, что усиливает взаимодействие с DevOps-командой.',
      'Архитектурный опыт Дмитрия Соколова и фокус на распределённых системах добавляют стратегическую ценность. Он поможет выстроить устойчивую платформу без типичных ошибок масштабирования.'
    ],
    company: {
      name: 'TechVentures Inc.',
      url: 'https://techventures.example.com',
      snippet:
        'Развивающаяся продуктовая IT-компания, создающая SaaS-решения для enterprise-сегмента. Основана в 2015 году, обслуживает более 500 клиентов по всему миру и насчитывает 200+ сотрудников.'
    }
  },
  files: {
    pdfUrl: '/mock/report.pdf',
    jsonUrl: '/mock/report.json'
  }
};

let abortController: AbortController | null = null;

export async function generateReport(params: GenerateParams): Promise<GenerateResponse> {
  if (abortController) {
    abortController.abort();
  }

  abortController = new AbortController();

  if (MOCK_MODE) {
    await new Promise(resolve => setTimeout(resolve, 2000));

    return {
      ...mockData,
      data: mockData.data ? {
        ...mockData.data,
        lang: params.lang,
        now: new Date().toISOString(),
        deadline: new Date(Date.now() + params.deadlineDays * 24 * 60 * 60 * 1000).toISOString()
      } : undefined
    };
  }

  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params),
      signal: abortController.signal
    });

    const data: GenerateResponse = await response.json();

    if (!response.ok) {
      return {
        ok: false,
        error: data.error || 'Не удалось сформировать отчёт'
      };
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return {
          ok: false,
          error: 'Запрос отменён'
        };
      }
      return {
        ok: false,
        error: error.message === 'Failed to fetch'
          ? 'Не удалось установить соединение с сервером'
          : error.message
      };
    }
    return {
      ok: false,
      error: 'Произошла неизвестная ошибка'
    };
  }
}

export function abortRequest() {
  if (abortController) {
    abortController.abort();
    abortController = null;
  }
}

export async function downloadFile(url: string, filename: string) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error('Не удалось скачать файл:', error);
    throw error;
  }
}
