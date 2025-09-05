'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { createApiClient } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FolderOpen, 
  Key, 
  Copy, 
  RefreshCw, 
  Plus,
  Loader2, 
  AlertCircle,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';
import { useMemo, useState, useId } from 'react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function ProjectsList() {
  const { getToken } = useAuth();
  const apiClient = useMemo(() => createApiClient(getToken), [getToken]);
  const queryClient = useQueryClient();
  
  const [newProjectName, setNewProjectName] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<{ id: string; name: string } | null>(null);
  const [editProjectName, setEditProjectName] = useState('');
  const [visibleApiKeys, setVisibleApiKeys] = useState<Set<string>>(new Set());
  const createProjectInputId = useId();
  const editProjectInputId = useId();

  const { data: orgData, isLoading, error } = useQuery({
    queryKey: ['organization-with-projects'],
    queryFn: () => apiClient.getOrganizationWithProjects(),
    retry: 2,
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
      setIsCreateDialogOpen(false);
    },
    onError: (error) => {
      toast.error('Failed to create project. Please try again.');
      console.error('Create project error:', error);
    },
  });

  const regenerateApiKeyMutation = useMutation({
    mutationFn: ({ projectId, organizationId }: { projectId: string; organizationId: string }) =>
      apiClient.regenerateApiKey(projectId, organizationId),
    onSuccess: () => {
      toast.success('API key regenerated successfully!');
      queryClient.invalidateQueries({ queryKey: ['organization-with-projects'] });
    },
    onError: () => {
      toast.error('Failed to regenerate API key. Please try again.');
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: ({ projectId, organizationId, name }: { projectId: string; organizationId: string; name: string }) =>
      apiClient.updateProject(projectId, organizationId, name),
    onSuccess: () => {
      toast.success('Project updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['organization-with-projects'] });
      setEditingProject(null);
      setEditProjectName('');
    },
    onError: () => {
      toast.error('Failed to update project. Please try again.');
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: ({ projectId, organizationId }: { projectId: string; organizationId: string }) =>
      apiClient.deleteProject(projectId, organizationId),
    onSuccess: () => {
      toast.success('Project deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['organization-with-projects'] });
    },
    onError: () => {
      toast.error('Failed to delete project. Please try again.');
    },
  });

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('API key copied to clipboard');
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  };

  const toggleApiKeyVisibility = (projectId: string) => {
    setVisibleApiKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      return newSet;
    });
  };

  const handleCreateProject = () => {
    if (!newProjectName.trim()) {
      toast.error('Please enter a project name');
      return;
    }
    createProjectMutation.mutate(newProjectName.trim());
  };

  const handleUpdateProject = () => {
    if (!editingProject || !editProjectName.trim() || !orgData?.id) return;
    updateProjectMutation.mutate({
      projectId: editingProject.id,
      organizationId: orgData.id,
      name: editProjectName.trim()
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Projects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Projects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load projects. Please refresh to try again.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const projects = orgData?.projects || [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Projects ({projects.length})
          </CardTitle>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>
                  Add a new project to your organization. Each project gets its own API key.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="project-name">Project Name</Label>
                  <Input
                    id={createProjectInputId}
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="Enter project name"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
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
      </CardHeader>
      <CardContent>
        {projects.length === 0 ? (
          <div className="text-center py-8">
            <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first project to get started with Valtro.
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Project
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FolderOpen className="h-5 w-5 text-primary" />
                    <div>
                      <h4 className="font-semibold">{project.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Created {new Date(project.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Active</Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => {
                            setEditingProject({ id: project.id, name: project.name });
                            setEditProjectName(project.name);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => regenerateApiKeyMutation.mutate({
                            projectId: project.id,
                            organizationId: project.organization_id
                          })}
                          disabled={regenerateApiKeyMutation.isPending}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Regenerate API Key
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => deleteProjectMutation.mutate({
                            projectId: project.id,
                            organizationId: project.organization_id
                          })}
                          className="text-destructive"
                          disabled={deleteProjectMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <Key className="h-4 w-4 text-muted-foreground" />
                  <code className="flex-1 text-sm font-mono break-all">
                    {visibleApiKeys.has(project.id) ? project.api_key : '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleApiKeyVisibility(project.id)}
                    title={visibleApiKeys.has(project.id) ? 'Hide API key' : 'Show API key'}
                  >
                    {visibleApiKeys.has(project.id) ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(project.api_key)}
                    title="Copy API key"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Project Dialog */}
        <Dialog open={!!editingProject} onOpenChange={() => setEditingProject(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rename Project</DialogTitle>
              <DialogDescription>
                Update the name of your project.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-project-name">Project Name</Label>
                <Input
                  id={editProjectInputId}
                  value={editProjectName}
                  onChange={(e) => setEditProjectName(e.target.value)}
                  placeholder="Enter new project name"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingProject(null)}>
                Cancel
              </Button>
              <Button 
                onClick={handleUpdateProject}
                disabled={updateProjectMutation.isPending}
              >
                {updateProjectMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Update
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
