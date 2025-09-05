'use client';

import { OnboardingFlow } from './onboarding-flow';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { createApiClient, ApiError } from '@/lib/api';
import { Loader2 } from 'lucide-react';
import { useMemo } from 'react';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { OrganizationOverview } from '@/components/dashboard/organization-overview';
import { ProjectsList } from '@/components/dashboard/projects-list';

function MainDashboard() {
	return (
		<div className="p-4">
			<main className="container mx-auto px-4 py-8 space-y-8">
				<header className="mb-8">
					<h1 className="text-3xl font-bold mb-2">Dashboard</h1>
					<p className="text-muted-foreground">
						Welcome to your Valtro dashboard! Manage your organization and projects.
					</p>
				</header>
				
				{/* Stats Overview */}
				<section>
					<h2 className="text-2xl font-semibold mb-4">Overview</h2>
					<DashboardStats />
				</section>
				
				{/* Organization Details */}
				<section>
					<OrganizationOverview />
				</section>
				
				{/* Projects List */}
				<section>
					<ProjectsList />
				</section>
			</main>
		</div>
	);
}

const DashboardPage = () => {
	const { getToken, isLoaded } = useAuth();
	const apiClient = useMemo(() => createApiClient(getToken), [getToken]);

	const { data: onboardingStatus, isLoading } = useQuery({
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

	if (!isLoaded || isLoading) {
		return (
			<div className="flex items-center justify-center min-h-[60vh]">
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

	// Show main dashboard if user has completed onboarding
	return <MainDashboard />;
};

export default DashboardPage;
