'use client';

import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { createApiClient, ApiError } from '@/lib/api';
import { Loader2 } from 'lucide-react';
import { OnboardingFlow } from './onboarding-flow';
import { Header } from '@/components/dashboard/header';
import { Sidebar } from '@/components/dashboard/sidebar';

export default function DashboardLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const { getToken, isLoaded } = useAuth();
  const apiClient = useMemo(() => createApiClient(getToken), [getToken]);

  // State for selected organization and project
  const [selectedOrgId, setSelectedOrgId] = useState<string>('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  const { data: onboardingStatus, isLoading: onboardingLoading } = useQuery({
    queryKey: ['onboarding-status'],
    queryFn: () => apiClient.checkOnboardingStatus(),
    enabled: isLoaded && !!getToken,
    retry: (failureCount, error) => {
      // Don't retry on authentication errors
      if (error instanceof ApiError && error.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
  });

  const { data: orgData } = useQuery({
    queryKey: ['organization-with-projects'],
    queryFn: () => apiClient.getOrganizationWithProjects(),
    enabled: isLoaded && !!getToken && onboardingStatus?.hasOrganization,
    retry: 2,
  });

  // Auto-select first organization and project when data loads
  useEffect(() => {
    if (orgData && !selectedOrgId) {
      setSelectedOrgId(orgData.id);
      if (orgData.projects.length > 0 && !selectedProjectId) {
        setSelectedProjectId(orgData.projects[0].id);
      }
    }
  }, [orgData, selectedOrgId, selectedProjectId]);

  // Loading state
  if (!isLoaded || onboardingLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show onboarding flow if user hasn't completed onboarding
  if (!onboardingStatus?.hasOrganization) {
    return <OnboardingFlow />;
  }

  // Find selected project
  const selectedProject = orgData?.projects?.find(p => p.id === selectedProjectId) || orgData?.projects?.[0];

  return (
    <div className="flex bg-background min-h-screen pt-14">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 fixed left-0 top-14 bottom-0 z-40">
        <Sidebar 
          selectedOrgId={selectedOrgId}
          selectedProjectId={selectedProjectId}
          onOrgChange={setSelectedOrgId}
          onProjectChange={setSelectedProjectId}
        />
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 ml-64">
        {/* Header */}
        <div className="flex-shrink-0 sticky top-14 z-30 bg-background">
          <Header 
            organizationName={orgData?.name}
            projectName={selectedProject?.name}
            pageTitle="Overview"
            actionLabel="View Docs"
          />
        </div>
        
        {/* Page Content */}
        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
