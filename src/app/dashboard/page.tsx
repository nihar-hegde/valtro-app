'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { createApiClient } from '@/lib/api';
import { Loader2 } from 'lucide-react';
import { ProjectEmptyState } from '@/components/dashboard/project-empty-state';

const DashboardPage = () => {
  const { getToken, isLoaded } = useAuth();
  const apiClient = useMemo(() => createApiClient(getToken), [getToken]);

  const { data: orgData, isLoading: orgLoading } = useQuery({
    queryKey: ['organization-with-projects'],
    queryFn: () => apiClient.getOrganizationWithProjects(),
    enabled: isLoaded && !!getToken,
    retry: 2,
  });

  // Loading state
  if (orgLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading project data...</p>
        </div>
      </div>
    );
  }

  // Find first project
  const selectedProject = orgData?.projects?.[0];

  if (!selectedProject) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-2">No Projects Found</h2>
          <p className="text-muted-foreground">
            Create your first project to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ProjectEmptyState 
      projectName={selectedProject.name}
      apiKey={selectedProject.api_key}
    />
  );
};

export default DashboardPage;
