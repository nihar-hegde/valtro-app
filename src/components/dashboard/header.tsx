'use client';

import { Button } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { UserPlus, ExternalLink } from 'lucide-react';

interface HeaderProps {
  organizationName?: string;
  projectName?: string;
  pageTitle?: string;
  actionLabel?: string;
  onActionClick?: () => void;
}

export function Header({ 
  organizationName = 'Valtro',
  projectName,
  pageTitle = 'Overview',
  actionLabel = 'View Docs',
  onActionClick 
}: HeaderProps) {
  const handleDefaultAction = () => {
    window.open('https://docs.valtro.dev', '_blank');
  };

  return (
    <header className="border-b border-border bg-background">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Breadcrumbs */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard" className="text-muted-foreground">
                {organizationName}
              </BreadcrumbLink>
            </BreadcrumbItem>
            {projectName && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard" className="text-muted-foreground">
                    {projectName}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium">
                {pageTitle}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Action Button */}
        <Button 
          onClick={onActionClick || handleDefaultAction}
          className="flex items-center gap-2"
        >
          {actionLabel === 'View Docs' && <ExternalLink className="h-4 w-4" />}
          {actionLabel === 'Invite Members' && <UserPlus className="h-4 w-4" />}
          {actionLabel}
        </Button>
      </div>
    </header>
  );
}
