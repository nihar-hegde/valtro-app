'use client';

import { useState, useId, useMemo, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { createApiClient, type OnboardingResponse, ApiError } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, Building2, FolderOpen } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

const onboardingSchema = z.object({
  organization_name: z
    .string()
    .min(1, 'Organization name is required')
    .min(2, 'Organization name must be at least 2 characters')
    .max(50, 'Organization name must be less than 50 characters')
    .regex(/^[a-zA-Z0-9\s\-_.]+$/, 'Organization name contains invalid characters'),
  project_name: z
    .string()
    .min(1, 'Project name is required')
    .min(2, 'Project name must be at least 2 characters')
    .max(50, 'Project name must be less than 50 characters')
    .regex(/^[a-zA-Z0-9\s\-_.]+$/, 'Project name contains invalid characters'),
});

type OnboardingFormData = z.infer<typeof onboardingSchema>;

interface OnboardingFormProps {
  onComplete: (data: OnboardingResponse) => void;
}

export function OnboardingForm({ onComplete }: OnboardingFormProps) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const orgNameId = useId();
  const project_nameId = useId();
  const [formData, setFormData] = useState<OnboardingFormData>({
    organization_name: '',
    project_name: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof OnboardingFormData, string>>>({});

  const apiClient = useMemo(() => createApiClient(getToken), [getToken]);

  const onboardingMutation = useMutation({
    mutationFn: ({ organization_name, project_name }: OnboardingFormData) =>
      apiClient.completeOnboarding(organization_name.trim(), project_name.trim()),
    onSuccess: (data) => {
      toast.success('Welcome to Valtro! Your account is now set up.');
      queryClient.invalidateQueries({ queryKey: ['onboarding-status'] });
      onComplete(data);
    },
    onError: (error) => {
      console.error('Onboarding failed:', error);
      
      // Handle specific API errors
      if (error instanceof ApiError) {
        if (error.status === 400) {
          toast.error('Invalid input. Please check your organization and project names.');
        } else if (error.status === 409) {
          toast.error('Organization name already exists. Please choose a different name.');
        } else if (error.status >= 500) {
          toast.error('Server error. Please try again later.');
        } else {
          toast.error('Something went wrong. Please try again.');
        }
      } else {
        toast.error('Network error. Please check your connection and try again.');
      }
    },
  });

  const handleInputChange = useCallback((field: keyof OnboardingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const validateForm = (): boolean => {
    try {
      onboardingSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof OnboardingFormData, string>> = {};
        error.issues.forEach((err: z.ZodIssue) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof OnboardingFormData] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onboardingMutation.mutate(formData);
    }
  };

  const canSubmit = formData.organization_name.trim() && formData.project_name.trim();

  return (
    <div className="flex items-center justify-center min-h-[80vh] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome to Valtro</CardTitle>
          <CardDescription>
            Let&apos;s set up your organization and first project to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Organization Name Field */}
            <div className="space-y-2">
              <Label htmlFor={orgNameId} className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Organization Name
              </Label>
              <Input
                id={orgNameId}
                type="text"
                placeholder="Enter your organization name"
                value={formData.organization_name}
                onChange={(e) => handleInputChange('organization_name', e.target.value)}
                className={errors.organization_name ? 'border-destructive' : ''}
                disabled={onboardingMutation.isPending}
              />
              {errors.organization_name && (
                <p className="text-sm text-destructive">{errors.organization_name}</p>
              )}
            </div>

            {/* Project Name Field */}
            <div className="space-y-2">
              <Label htmlFor={project_nameId} className="flex items-center gap-2">
                <FolderOpen className="h-4 w-4" />
                Project Name
              </Label>
              <Input
                id={project_nameId}
                type="text"
                placeholder="Enter your first project name"
                value={formData.project_name}
                onChange={(e) => handleInputChange('project_name', e.target.value)}
                className={errors.project_name ? 'border-destructive' : ''}
                disabled={onboardingMutation.isPending || !formData.organization_name.trim()}
              />
              {errors.project_name && (
                <p className="text-sm text-destructive">{errors.project_name}</p>
              )}
              {!formData.organization_name.trim() && (
                <p className="text-sm text-muted-foreground">
                  Enter an organization name first
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={!canSubmit || onboardingMutation.isPending}
            >
              {onboardingMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up your account...
                </>
              ) : (
                'Create Organization & Project'
              )}
            </Button>
          </form>

          {/* Progress Indicator */}
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Step 1 of 1</span>
              <span>Almost there!</span>
            </div>
            <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300 ease-out"
                style={{ 
                  width: canSubmit ? '100%' : formData.organization_name.trim() ? '50%' : '0%' 
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
