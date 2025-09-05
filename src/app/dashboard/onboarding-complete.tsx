'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Copy, Key, ArrowRight, Building2, FolderOpen } from 'lucide-react';
import { toast } from 'sonner';
import type { OnboardingResponse } from '@/lib/api';

interface OnboardingCompleteProps {
  onboardingData: OnboardingResponse;
  onGoToDashboard: () => void;
}

export function OnboardingComplete({ onboardingData, onGoToDashboard }: OnboardingCompleteProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      if (!navigator.clipboard) {
        throw new Error('Clipboard API not available');
      }
      await navigator.clipboard.writeText(onboardingData.project.api_key);
      setCopied(true);
      toast.success('API key copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers or if clipboard API fails
      try {
        const textArea = document.createElement('textarea');
        textArea.value = onboardingData.project.api_key;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        toast.success('API key copied to clipboard');
        setTimeout(() => setCopied(false), 2000);
      } catch {
        toast.error('Failed to copy API key. Please copy manually.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-3xl font-bold">Welcome to Valtro!</CardTitle>
          <p className="text-muted-foreground mt-2">
            Your organization and project have been successfully created
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Organization & Project Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
              <Building2 className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Organization</p>
                <p className="text-lg">{onboardingData.organization.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
              <FolderOpen className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Project</p>
                <p className="text-lg">{onboardingData.project.name}</p>
              </div>
            </div>
          </div>

          {/* API Key Section */}
          <Alert>
            <Key className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-3">
                <p className="font-medium">Your API Key</p>
                <p className="text-sm text-muted-foreground">
                  Keep this key secure. You&apos;ll need it to authenticate your applications with Valtro.
                </p>
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg font-mono text-sm">
                  <code className="flex-1 break-all">
                    {onboardingData.project.api_key}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    className="shrink-0"
                  >
                    <Copy className="h-4 w-4" />
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>

          {/* Quick Start Info */}
          <div className="p-4 rounded-lg border bg-card">
            <h3 className="font-semibold mb-2">Quick Start</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Use your API key to authenticate requests</li>
              <li>• Start logging events to your project</li>
              <li>• Monitor your application&apos;s activity in real-time</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              onClick={onGoToDashboard}
              className="flex-1"
              size="lg"
            >
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.open('https://docs.valtro.com', '_blank')}
              className="flex-1"
              size="lg"
            >
              View Documentation
            </Button>
          </div>

          {/* Additional Notes */}
          <div className="text-center pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Need help getting started? Check out our{' '}
              <a 
                href="https://docs.valtro.com/quickstart" 
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Quick Start Guide
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
