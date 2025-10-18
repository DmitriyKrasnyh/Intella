import type { GenerateParams, GenerateResponse } from '../types';

const MOCK_MODE = import.meta.env.VITE_MOCK === '1';

const mockData: GenerateResponse = {
  ok: true,
  data: {
    lang: 'ru',
    now: new Date().toISOString(),
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    job_description: 'Senior Backend Developer with 5+ years of experience in Python and distributed systems. Strong knowledge of microservices architecture, Docker, Kubernetes. Experience with PostgreSQL, Redis, RabbitMQ. Understanding of CI/CD processes and cloud platforms (AWS/GCP).',
    candidates: [
      {
        name: 'Alex Petrov',
        title: 'Lead Backend Engineer at TechCorp',
        url: 'https://linkedin.com/in/alex-petrov',
        snippet: 'Experienced backend developer with 7 years in Python. Built scalable microservices handling 10M+ requests/day. Expert in PostgreSQL optimization and distributed systems design.'
      },
      {
        name: 'Maria Ivanova',
        title: 'Senior Software Engineer at DataSystems',
        url: 'https://linkedin.com/in/maria-ivanova',
        snippet: 'Full-stack engineer specializing in backend development. 6 years of experience with Python, Django, FastAPI. Proficient in cloud infrastructure and container orchestration with Kubernetes.'
      },
      {
        name: 'Dmitry Sokolov',
        title: 'Backend Architect at CloudServices',
        url: 'https://linkedin.com/in/dmitry-sokolov',
        snippet: 'Backend architect with strong focus on scalability and performance. 8 years building distributed systems. Deep expertise in message queues, caching strategies, and database design.'
      }
    ],
    rationales: [
      'Alex Petrov demonstrates strong technical leadership and hands-on experience with the exact tech stack required. His proven track record of building high-performance systems aligns perfectly with our needs.',
      'Maria Ivanova brings versatile expertise across modern Python frameworks and cloud-native technologies. Her experience with Kubernetes and infrastructure as code makes her valuable for our DevOps culture.',
      'Dmitry Sokolov\'s architectural background and focus on distributed systems design provides strategic value. His experience scaling complex systems can help avoid common pitfalls in our growth phase.'
    ],
    company: {
      name: 'TechVentures Inc.',
      url: 'https://techventures.example.com',
      snippet: 'Leading technology company specializing in SaaS solutions for enterprise clients. Founded in 2015, now serving 500+ customers worldwide with a team of 200+ professionals.'
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
        error: data.error || 'Failed to generate report'
      };
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return {
          ok: false,
          error: 'Request cancelled'
        };
      }
      return {
        ok: false,
        error: error.message
      };
    }
    return {
      ok: false,
      error: 'Unknown error occurred'
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
    console.error('Download failed:', error);
    throw error;
  }
}
