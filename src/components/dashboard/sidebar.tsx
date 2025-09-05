'use client';

import { useState, useMemo, useId } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth, useUser } from '@clerk/nextjs';
import { createApiClient } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  LayoutDashboard,
  Settings,
  AlertTriangle,
  Play,
  Users,
  ChevronDown,
  Plus,
  LogOut,
  Loader2,
  Edit,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';

interface SidebarProps {
  selectedOrgId?: string;
  selectedProjectId?: string;
  onOrgChange?: (orgId: string) => void;
  onProjectChange?: (projectId: string) => void;
}

export function Sidebar({ 
  selectedProjectId, 
  onProjectChange 
}: SidebarProps) {
  const { getToken, signOut } = useAuth();
  const { user } = useUser();
  const apiClient = useMemo(() => createApiClient(getToken), [getToken]);
  const queryClient = useQueryClient();

  const [isCreateOrgOpen, setIsCreateOrgOpen] = useState(false);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isEditOrgOpen, setIsEditOrgOpen] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [editOrgName, setEditOrgName] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteType, setDeleteType] = useState<'org' | 'project' | null>(null);
  const orgNameId = useId();
  const projectNameId = useId();
  const editOrgNameId = useId();

  // Fetch organizations with projects
  const { data: orgData, isLoading } = useQuery({
    queryKey: ['organization-with-projects'],
    queryFn: () => apiClient.getOrganizationWithProjects(),
    retry: 2,
  });

  // Navigation items
  const navigationItems = [
    { 
      icon: LayoutDashboard, 
      label: 'Overview', 
      href: '/dashboard',
      active: true 
    },
    { 
      icon: AlertTriangle, 
      label: 'Issues', 
      href: '/dashboard/issues',
      disabled: true 
    },
    { 
      icon: Play, 
      label: 'Session Replays', 
      href: '/dashboard/replays',
      disabled: true 
    },
    { 
      icon: Users, 
      label: 'Members', 
      href: '/dashboard/members',
      disabled: true 
    },
    { 
      icon: Settings, 
      label: 'Project Settings', 
      href: '/dashboard/settings',
      disabled: true 
    },
  ];

  // Mutations
  const createOrgMutation = useMutation({
    mutationFn: (name: string) => apiClient.createOrganization(name),
    onSuccess: () => {
      toast.success('Organization created successfully!');
      queryClient.invalidateQueries({ queryKey: ['organization-with-projects'] });
      setNewOrgName('');
      setIsCreateOrgOpen(false);
    },
    onError: (error) => {
      toast.error('Failed to create organization. Please try again.');
      console.error('Create org error:', error);
    },
  });

  const updateOrgMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => 
      apiClient.updateOrganization(id, name),
    onSuccess: () => {
      toast.success('Organization updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['organization-with-projects'] });
      setEditOrgName('');
      setIsEditOrgOpen(false);
    },
    onError: () => {
      toast.error('Failed to update organization. Please try again.');
    },
  });

  const deleteOrgMutation = useMutation({
    mutationFn: (id: string) => apiClient.deleteOrganization(id),
    onSuccess: () => {
      toast.success('Organization deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['organization-with-projects'] });
      setDeleteConfirmOpen(false);
    },
    onError: () => {
      toast.error('Failed to delete organization. Please try again.');
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: (name: string) => {
      if (!orgData?.id) throw new Error('Organization not found');
      return apiClient.createProject(orgData.id, name);
    },
    onSuccess: () => {
      toast.success('Project created successfully!');
      queryClient.invalidateQueries({ queryKey: ['organization-with-projects'] });
      setNewProjectName('');
      setIsCreateProjectOpen(false);
    },
    onError: (error) => {
      toast.error('Failed to create project. Please try again.');
      console.error('Create project error:', error);
    },
  });

  const currentOrg = orgData;
  const currentProject = orgData?.projects?.find(p => p.id === selectedProjectId) || orgData?.projects?.[0];

  const handleCreateOrg = () => {
    if (!newOrgName.trim()) {
      toast.error('Please enter an organization name');
      return;
    }
    createOrgMutation.mutate(newOrgName.trim());
  };

  const handleCreateProject = () => {
    if (!newProjectName.trim()) {
      toast.error('Please enter a project name');
      return;
    }
    createProjectMutation.mutate(newProjectName.trim());
  };

  const handleEditOrg = () => {
    if (!editOrgName.trim() || !orgData?.id) return;
    updateOrgMutation.mutate({ id: orgData.id, name: editOrgName.trim() });
  };

  const handleDeleteOrg = () => {
    if (!orgData?.id) return;
    deleteOrgMutation.mutate(orgData.id);
  };

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className="w-full h-full bg-card/50 backdrop-blur-sm border-r border-border/50 flex flex-col">
      {/* Header */}
      <div className="px-6 py-5 border-b border-border/50 flex-shrink-0">
        <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Valtro
        </h2>
      </div>

      {/* Organization/Project Switcher */}
      <div className="px-4 py-5 border-b border-border/50 flex-shrink-0 bg-muted/20">
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Organization Selector */}
            <div>
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">Organization</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between h-9 border-border/60 hover:border-border hover:bg-accent/50 transition-colors">
                    <span className="truncate font-medium">{currentOrg?.name || 'Select Organization'}</span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64">
                  {currentOrg && (
                    <>
                      <DropdownMenuItem className="font-medium">
                        {currentOrg.name}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => {
                          setEditOrgName(currentOrg.name);
                          setIsEditOrgOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Organization
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => {
                          setDeleteType('org');
                          setDeleteConfirmOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Organization
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={() => setIsCreateOrgOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Organization
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Project Selector */}
            <div>
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">Project</Label>
              <Select 
                value={currentProject?.id || ''} 
                onValueChange={onProjectChange}
              >
                <SelectTrigger className="w-full h-9 border-border/60 hover:border-border transition-colors">
                  <SelectValue placeholder="Select Project" className="font-medium" />
                </SelectTrigger>
                <SelectContent>
                  {orgData?.projects?.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                  <Separator className="my-1" />
                  <div className="px-2 py-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start h-8"
                      onClick={() => setIsCreateProjectOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Project
                    </Button>
                  </div>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 py-4 min-h-0">
        <nav className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.href}
                variant={item.active ? "secondary" : "ghost"}
                className={`w-full justify-start h-10 px-3 text-sm font-medium transition-all duration-200 ${
                  item.active 
                    ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm' 
                    : 'hover:bg-accent/60 hover:text-foreground'
                } ${item.disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                disabled={item.disabled}
              >
                <Icon className={`h-4 w-4 mr-3 ${item.active ? 'text-primary' : 'text-muted-foreground'}`} />
                {item.label}
              </Button>
            );
          })}
        </nav>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-border/50 flex-shrink-0 bg-muted/10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start p-3 h-auto hover:bg-accent/60 transition-colors rounded-lg">
              <Avatar className="h-9 w-9 mr-3 ring-2 ring-border/20">
                <AvatarImage src={user?.imageUrl} alt={user?.fullName || 'User'} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-semibold truncate">
                  {user?.fullName || user?.emailAddresses[0]?.emailAddress}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.emailAddresses[0]?.emailAddress}
                </p>
              </div>
              <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Create Organization Dialog */}
      <Dialog open={isCreateOrgOpen} onOpenChange={setIsCreateOrgOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Organization</DialogTitle>
            <DialogDescription>
              Create a new organization to manage your projects.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor={orgNameId}>Organization Name</Label>
              <Input
                id={orgNameId}
                value={newOrgName}
                onChange={(e) => setNewOrgName(e.target.value)}
                placeholder="Enter organization name"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateOrg();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOrgOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateOrg}
              disabled={createOrgMutation.isPending}
            >
              {createOrgMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Organization
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Organization Dialog */}
      <Dialog open={isEditOrgOpen} onOpenChange={setIsEditOrgOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Organization</DialogTitle>
            <DialogDescription>
              Update your organization name.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor={editOrgNameId}>Organization Name</Label>
              <Input
                id={editOrgNameId}
                value={editOrgName}
                onChange={(e) => setEditOrgName(e.target.value)}
                placeholder="Enter organization name"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleEditOrg();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOrgOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleEditOrg}
              disabled={updateOrgMutation.isPending}
            >
              {updateOrgMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Update Organization
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {deleteType === 'org' ? 'Delete Organization' : 'Delete Project'}
            </DialogTitle>
            <DialogDescription>
              {deleteType === 'org' 
                ? `Are you sure you want to delete "${currentOrg?.name}"? This will permanently delete the organization and all its projects. This action cannot be undone.`
                : `Are you sure you want to delete this project? This action cannot be undone.`
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={deleteType === 'org' ? handleDeleteOrg : () => {}}
              disabled={deleteOrgMutation.isPending}
            >
              {deleteOrgMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete {deleteType === 'org' ? 'Organization' : 'Project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Project Dialog */}
      <Dialog open={isCreateProjectOpen} onOpenChange={setIsCreateProjectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Add a new project to your organization.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor={projectNameId}>Project Name</Label>
              <Input
                id={projectNameId}
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Enter project name"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateProject();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateProjectOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateProject}
              disabled={createProjectMutation.isPending}
            >
              {createProjectMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
