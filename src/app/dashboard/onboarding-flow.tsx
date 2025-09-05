'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { createApiClient, ApiError } from '@/lib/api';

import { Loader2, AlertCircle } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { OnboardingResponse } from '@/lib/api';
import { OnboardingForm } from './onboarding-form';
import { OnboardingComplete } from './onboarding-complete';

type OnboardingState = 
  | 'loading' 
  | 'needs_onboarding' 
  | 'onboarding_complete' 
  | 'onboarding_success'
  | 'error';

export function OnboardingFlow() {
  const { getToken, isLoaded: authLoaded } = useAuth();
  const [onboardingData, setOnboardingData] = useState<OnboardingResponse | null>(null);
  const [onboardingState, setOnboardingState] = useState<OnboardingState>('loading');

  const apiClient = useMemo(() => createApiClient(getToken), [getToken]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['onboarding-status'],
    queryFn: () => apiClient.checkOnboardingStatus(),
    enabled: authLoaded && !!getToken,
    retry: (failureCount, error) => {
      // Don't retry on authentication errors
      if (error instanceof ApiError && error.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
  });

  // Update state based on query results using useEffect to prevent infinite renders
  useEffect(() => {
    if (!authLoaded) {
      setOnboardingState('loading');
      return;
    }

    if (isLoading) {
      setOnboardingState('loading');
    } else if (error) {
      console.error('Failed to check onboarding status:', error);
      if (error instanceof ApiError && error.status === 401) {
        // Auth error - let Clerk handle this
        return;
      }
      setOnboardingState('error');
    } else if (data?.hasOrganization) {
      setOnboardingState('onboarding_complete');
    } else {
      setOnboardingState('needs_onboarding');
    }
  }, [authLoaded, isLoading, error, data?.hasOrganization]);

  const handleOnboardingComplete = (data: OnboardingResponse) => {
    setOnboardingData(data);
    setOnboardingState('onboarding_success');
  };

  const handleGoToDashboard = () => {
    setOnboardingState('onboarding_complete');
    // This will trigger a re-render showing the main dashboard
  };

  const handleRetry = () => {
    refetch();
  };

  if (onboardingState === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Checking your account...</p>
        </div>
      </div>
    );
  }

  if (onboardingState === 'error') {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="mt-2">
            <p className="mb-4">Unable to check your account status. Please try again.</p>
            <button
              type="button"
              onClick={handleRetry}
              className="text-sm bg-primary text-primary-foreground px-3 py-1 rounded hover:bg-primary/90"
            >
              Retry
            </button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (onboardingState === 'needs_onboarding') {
    return <OnboardingForm onComplete={handleOnboardingComplete} />;
  }

  if (onboardingState === 'onboarding_success' && onboardingData) {
    return (
      <OnboardingComplete 
        onboardingData={onboardingData}
        onGoToDashboard={handleGoToDashboard}
      />
    );
  }

  // User has completed onboarding, return null to show main dashboard
  return null;
}
