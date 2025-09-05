const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://scarcely-artistic-monarch.ngrok-free.app';

// Request timeout in milliseconds
const REQUEST_TIMEOUT = 15000;

export interface Organization {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  organization_id: string;
  api_key: string;
  created_at: string;
  updated_at: string;
}

// API wrapper response structure
export interface ApiOnboardingResponse {
  message: string;
  data: {
    organization: Organization;
    project: Project;
  };
}

// API wrapper for check status
export interface ApiCheckResponse {
  message: string;
  data: {
    has_organization: boolean;
    organization?: Organization;
  };
}

// API wrapper for organizations list
export interface ApiOrganizationsResponse {
  message: string;
  data: Organization[];
}

// API wrapper for organization with projects
export interface ApiOrganizationWithProjectsResponse {
  message: string;
  data: {
    id: string;
    name: string;
    owner_id: string;
    projects: Project[];
    created_at: string;
    updated_at: string;
  };
}

// API wrapper for projects list
export interface ApiProjectsResponse {
  message: string;
  data: Project[];
}

// API wrapper for single project
export interface ApiProjectResponse {
  message: string;
  data: Project;
}

// The actual data we use in components
export interface OnboardingResponse {
  organization: Organization;
  project: Project;
}

// API Error types for better error handling
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string,
    public response?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Client-side API functions that can be used with React Query
export const createApiClient = (getToken: () => Promise<string | null>) => {
  const makeRequest = async <T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> => {
    const token = await getToken();
    
    if (!token) {
      throw new ApiError('Authentication token not available', 401, 'Unauthorized');
    }

    const url = `${BASE_URL}${endpoint}`;
    
    // Create timeout controller
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-User-ID': token, // Using token as user ID for now - adjust if needed
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new ApiError(
          `Request failed: ${response.status} ${response.statusText}`,
          response.status,
          response.statusText,
          errorText
        );
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new ApiError('Invalid response format', response.status, response.statusText);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408, 'Request Timeout');
      }
      
      throw new ApiError(
        error instanceof Error ? error.message : 'Network error',
        0,
        'Network Error'
      );
    }
  };

  return {
    checkOnboardingStatus: async (): Promise<{ hasOrganization: boolean }> => {
      const response = await makeRequest<ApiCheckResponse>('/api/v1/organizations/check');
      // Extract and transform the data from API wrapper
      return { hasOrganization: response.data.has_organization };
    },
    completeOnboarding: async (organization_name: string, project_name: string): Promise<OnboardingResponse> => {
      const response = await makeRequest<ApiOnboardingResponse>('/api/v1/onboarding', {
        method: 'POST',
        body: JSON.stringify({ organization_name, project_name })
      });
      // Extract the data from the API wrapper
      return response.data;
    },
    getOrganizations: async (): Promise<Organization[]> => {
      const response = await makeRequest<ApiOrganizationsResponse>('/api/v1/organizations');
      return response.data;
    },
    getOrganizationWithProjects: async () => {
      const response = await makeRequest<ApiOrganizationWithProjectsResponse>('/api/v1/organizations/with-projects');
      return response.data;
    },
    createOrganization: async (name: string): Promise<Organization> => {
      const response = await makeRequest<{ message: string; data: Organization }>('/api/v1/organizations', {
        method: 'POST',
        body: JSON.stringify({ name })
      });
      return response.data;
    },
    getOrganization: async (id: string): Promise<Organization> => {
      const response = await makeRequest<{ message: string; data: Organization }>(`/api/v1/organizations/${id}`);
      return response.data;
    },
    updateOrganization: async (id: string, name: string): Promise<Organization> => {
      const response = await makeRequest<{ message: string; data: Organization }>(`/api/v1/organizations/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ name })
      });
      return response.data;
    },
    patchOrganization: async (id: string, updates: Partial<Pick<Organization, 'name'>>): Promise<Organization> => {
      const response = await makeRequest<{ message: string; data: Organization }>(`/api/v1/organizations/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates)
      });
      return response.data;
    },
    deleteOrganization: async (id: string): Promise<void> => {
      await makeRequest(`/api/v1/organizations/${id}`, {
        method: 'DELETE'
      });
    },
    createProject: async (organization_id: string, name: string): Promise<Project> => {
      const response = await makeRequest<ApiProjectResponse>('/api/v1/projects', {
        method: 'POST',
        body: JSON.stringify({ organization_id, name })
      });
      return response.data;
    },
    getProjectsByOrganization: async (organizationId: string): Promise<Project[]> => {
      const response = await makeRequest<ApiProjectsResponse>(`/api/v1/projects/organization/${organizationId}`);
      return response.data;
    },
    regenerateApiKey: async (projectId: string, organizationId: string): Promise<Project> => {
      const response = await makeRequest<ApiProjectResponse>(`/api/v1/projects/${projectId}/regenerate-api-key`, {
        method: 'POST',
        headers: {
          'X-Organization-ID': organizationId
        }
      });
      return response.data;
    },
    updateProject: async (projectId: string, organizationId: string, name: string): Promise<Project> => {
      const response = await makeRequest<ApiProjectResponse>(`/api/v1/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'X-Organization-ID': organizationId
        },
        body: JSON.stringify({ name })
      });
      return response.data;
    },
    deleteProject: async (projectId: string, organizationId: string): Promise<void> => {
      await makeRequest(`/api/v1/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'X-Organization-ID': organizationId
        }
      });
    }
  };
};
