const BASE_URL = 'http://localhost:8000/api/v1';

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // If payload is FormData, do not set Content-Type header (browser sets boundary)
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errMessage = `Error ${response.status}: ${response.statusText}`;
    try {
      const errData = await response.json();
      if (errData.detail) errMessage = errData.detail;
      else if (errData.error?.message) errMessage = errData.error.message;
    } catch {}
    throw new Error(errMessage);
  }

  // Handle blob downloads
  const contentType = response.headers.get('content-type');
  if (contentType && (contentType.includes('text/') || contentType.includes('application/json') || contentType.includes('application/octet-stream'))) {
    if (options.headers && (options.headers as any)['Accept'] === 'text/plain') {
      return (await response.text()) as unknown as T;
    }
  }

  return response.json();
}

// API Service Functions
export const api = {
  // User & Auth
  getCurrentUser: () => apiRequest<any>('/users/me'),
  login: (data: any) => apiRequest<any>('/users/login', { method: 'POST', body: JSON.stringify(data) }),

  // Workspaces & Projects
  getWorkspaces: () => apiRequest<any[]>('/workspaces/'),
  getProjects: () => apiRequest<any[]>('/projects/'),
  createProject: (data: any) => apiRequest<any>('/projects/', { method: 'POST', body: JSON.stringify(data) }),
  getProjectDetail: (id: number) => apiRequest<any>(`/projects/${id}`),

  // Sources & Ingestion
  getSources: (projectId?: number) => apiRequest<any[]>(`/sources/${projectId ? `?project_id=${projectId}` : ''}`),
  getSourceDetail: (id: number) => apiRequest<any>(`/sources/${id}`),
  createSourceText: (data: any) => apiRequest<any>('/sources/text', { method: 'POST', body: JSON.stringify(data) }),
  createSourceUrl: (data: any) => apiRequest<any>('/sources/url', { method: 'POST', body: JSON.stringify(data) }),
  uploadSourceFile: (formData: FormData) => apiRequest<any>('/sources/upload', { method: 'POST', body: formData }),
  getSourceBlocks: (id: number) => apiRequest<any[]>(`/sources/${id}/blocks`),
  getSourceChunks: (id: number) => apiRequest<any[]>(`/sources/${id}/chunks`),
  getSourceClaims: (id: number) => apiRequest<any[]>(`/sources/${id}/claims`),
  deleteSource: (id: number) => apiRequest<any>(`/sources/${id}`, { method: 'DELETE' }),

  // Transformations
  createTransformation: (sourceId: number, data: any) => 
    apiRequest<any>(`/sources/${sourceId}/transformations`, { method: 'POST', body: JSON.stringify(data) }),
  getOutputDetail: (id: number) => apiRequest<any>(`/outputs/${id}`),
  getOutputVersions: (id: number) => apiRequest<any[]>(`/outputs/${id}/versions`),
  getOutputVersionDetail: (outputId: number, versionId: number) => apiRequest<any>(`/outputs/${outputId}/versions/${versionId}`),
  createUserEditedVersion: (outputId: number, data: any) => 
    apiRequest<any>(`/outputs/${outputId}/versions`, { method: 'POST', body: JSON.stringify(data) }),
  regenerateOutput: (outputId: number, data: any) => 
    apiRequest<any>(`/outputs/${outputId}/regenerate`, { method: 'POST', body: JSON.stringify(data) }),

  // Review & Approval
  getReviewQueue: () => apiRequest<any[]>('/queue'),
  submitReview: (versionId: number, data: any) => 
    apiRequest<any>(`/output-versions/${versionId}/reviews`, { method: 'POST', body: JSON.stringify(data) }),
  getComments: (outputId: number) => apiRequest<any[]>(`/outputs/${outputId}/comments`),
  createComment: (data: any) => apiRequest<any>('/comments', { method: 'POST', body: JSON.stringify(data) }),

  // Delivery & Export
  downloadOutputVersionUrl: (versionId: number, format: string) => `${BASE_URL}/output-versions/${versionId}/download?format=${format}`,

  // Brands & Prompts
  getBrandProfiles: () => apiRequest<any[]>('/brand-profiles/'),
  createBrandProfile: (data: any) => apiRequest<any>('/brand-profiles/', { method: 'POST', body: JSON.stringify(data) }),
  getPromptTemplates: () => apiRequest<any[]>('/prompt-management/templates'),
  createPromptTemplate: (data: any) => apiRequest<any>('/prompt-management/templates', { method: 'POST', body: JSON.stringify(data) }),

  // Webhooks
  getWebhooks: () => apiRequest<any[]>('/webhooks/'),
  createWebhook: (data: any) => apiRequest<any>('/webhooks/', { method: 'POST', body: JSON.stringify(data) }),
  getDeliveryAttempts: () => apiRequest<any[]>('/webhooks/attempts'),

  // Audit & Usage
  getAuditEvents: () => apiRequest<any[]>('/audit-events/'),
  getUsageRecords: () => apiRequest<any[]>('/usage/'),
  getUsageSummary: () => apiRequest<any>('/usage/summary'),
};
