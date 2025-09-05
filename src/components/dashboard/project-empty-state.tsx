'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Key, ExternalLink, Eye, EyeOff, Shield, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface ProjectEmptyStateProps {
  projectName: string;
  apiKey: string;
}

export function ProjectEmptyState({ projectName, apiKey }: ProjectEmptyStateProps) {
  const [isApiKeyVisible, setIsApiKeyVisible] = useState(false);
  const [activeExample, setActiveExample] = useState<'javascript' | 'python' | 'curl'>('javascript');

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard');
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  };

  const maskedApiKey = '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••';

  const setupSnippets = {
    javascript: `import { ValtroLogger } from '@valtro/js-sdk';

const valtro = new ValtroLogger('${apiKey}');

// Log an error
valtro.error('Something went wrong!', { 
  userId: '12345',
  action: 'user-signup' 
});`,
    
    python: `from valtro import ValtroLogger

valtro = ValtroLogger('${apiKey}')

# Log an error
valtro.error('Something went wrong!', {
    'user_id': '12345',
    'action': 'user-signup'
})`,
    
    curl: `curl -X POST https://api.valtro.dev/v1/logs \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "level": "error",
    "message": "Something went wrong!",
    "metadata": {
      "userId": "12345",
      "action": "user-signup"
    }
  }'`
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="container mx-auto max-w-4xl p-8 space-y-10">
        {/* Welcome Hero Section */}
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 text-green-700 dark:text-green-300 text-sm font-semibold border border-green-200 dark:border-green-800/50 shadow-sm">
              <div className="relative">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-75" />
              </div>
              Ready to receive logs
            </div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
              Welcome to {projectName}!
            </h1>
            <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
              Your project is configured and ready to start collecting logs. Use the API key below to integrate Valtro into your application and begin monitoring your errors and events in real-time.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex justify-center gap-6 pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-blue-500" />
              <span>Secure</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span>Real-time</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Key className="h-4 w-4 text-green-500" />
              <span>Easy Setup</span>
            </div>
          </div>
        </div>

        {/* API Key Card */}
        <Card className="border-2 border-dashed border-border/50">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Key className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Your API Key</h3>
                  <p className="text-sm text-muted-foreground">Use this to authenticate your requests</p>
                </div>
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800">
                  <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                  Keep secure
                </Badge>
              </div>
              
              <div className="p-4 bg-muted/50 rounded-lg border">
                <div className="flex items-center gap-3">
                  <code className="flex-1 text-sm font-mono break-all select-all bg-background px-3 py-2 rounded border">
                    {isApiKeyVisible ? apiKey : maskedApiKey}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsApiKeyVisible(!isApiKeyVisible)}
                    className="shrink-0"
                  >
                    {isApiKeyVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(apiKey)}
                    className="shrink-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Setup Examples */}
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-semibold mb-3">Quick Setup Examples</h3>
            <p className="text-muted-foreground text-lg">
              Choose your preferred language to get started with Valtro integration
            </p>
          </div>
          
          {/* Language Tabs */}
          <div className="flex justify-center">
            <div className="inline-flex items-center p-1 bg-muted rounded-lg">
              <button
                type="button"
                onClick={() => setActiveExample('javascript')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeExample === 'javascript'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-100 dark:bg-yellow-900/20 rounded flex items-center justify-center">
                    <span className="text-yellow-600 dark:text-yellow-400 font-bold text-xs">JS</span>
                  </div>
                  JavaScript
                </div>
              </button>
              <button
                type="button"
                onClick={() => setActiveExample('python')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeExample === 'python'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-100 dark:bg-blue-900/20 rounded flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 font-bold text-xs">PY</span>
                  </div>
                  Python
                </div>
              </button>
              <button
                type="button"
                onClick={() => setActiveExample('curl')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeExample === 'curl'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-100 dark:bg-green-900/20 rounded flex items-center justify-center">
                    <span className="text-green-600 dark:text-green-400 font-bold text-xs">$</span>
                  </div>
                  cURL
                </div>
              </button>
            </div>
          </div>

          {/* Active Code Example */}
          <Card className="relative group hover:shadow-lg transition-all duration-200 border-2">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      activeExample === 'javascript' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                      activeExample === 'python' ? 'bg-blue-100 dark:bg-blue-900/20' :
                      'bg-green-100 dark:bg-green-900/20'
                    }`}>
                      <span className={`font-bold ${
                        activeExample === 'javascript' ? 'text-yellow-600 dark:text-yellow-400' :
                        activeExample === 'python' ? 'text-blue-600 dark:text-blue-400' :
                        'text-green-600 dark:text-green-400'
                      }`}>
                        {activeExample === 'javascript' ? 'JS' : activeExample === 'python' ? 'PY' : '$'}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">
                        {activeExample === 'javascript' ? 'JavaScript / Node.js' :
                         activeExample === 'python' ? 'Python' : 'cURL'}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {activeExample === 'javascript' ? 'npm install @valtro/js-sdk' :
                         activeExample === 'python' ? 'pip install valtro' : 'Direct HTTP requests'}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(setupSnippets[activeExample])}
                    className="opacity-70 group-hover:opacity-100 transition-opacity"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <div className="bg-slate-950 rounded-lg p-6 overflow-x-auto border">
                  <pre className="text-sm text-slate-300 leading-relaxed">
                    <code>{setupSnippets[activeExample]}</code>
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Resources */}
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Quick Actions</h3>
            <p className="text-muted-foreground">
              Everything you need to get started with Valtro
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.open('https://docs.valtro.dev/quickstart', '_blank')}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <ExternalLink className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">Quick Start Guide</h4>
                    <p className="text-sm text-muted-foreground">5-minute setup tutorial</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.open('https://docs.valtro.dev', '_blank')}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <ExternalLink className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">Documentation</h4>
                    <p className="text-sm text-muted-foreground">Full API reference</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.open('https://github.com/valtro/examples', '_blank')}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                    <ExternalLink className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">Example Projects</h4>
                    <p className="text-sm text-muted-foreground">Ready-to-use templates</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Getting Started Checklist */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 border-blue-200 dark:border-slate-600">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 dark:bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <h4 className="font-semibold text-lg text-slate-900 dark:text-slate-100">Getting Started Checklist</h4>
                </div>
                
                <div className="space-y-3 ml-11">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-green-500 dark:bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">✓</span>
                    </div>
                    <span className="text-sm text-slate-700 dark:text-slate-200 font-medium">Project created successfully</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-green-500 dark:bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">✓</span>
                    </div>
                    <span className="text-sm text-slate-700 dark:text-slate-200 font-medium">API key generated</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-slate-300 dark:border-slate-500 rounded-full bg-white dark:bg-slate-700"></div>
                    <span className="text-sm text-slate-600 dark:text-slate-300">Install Valtro SDK</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-slate-300 dark:border-slate-500 rounded-full bg-white dark:bg-slate-700"></div>
                    <span className="text-sm text-slate-600 dark:text-slate-300">Send your first error log</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-slate-300 dark:border-slate-500 rounded-full bg-white dark:bg-slate-700"></div>
                    <span className="text-sm text-slate-600 dark:text-slate-300">Invite team members</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Support Section */}
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Button variant="outline" onClick={() => window.open('https://discord.gg/valtro', '_blank')} className="sm:min-w-[160px]">
              <ExternalLink className="h-4 w-4 mr-2" />
              Join Discord
            </Button>
            <Button variant="outline" onClick={() => window.open('mailto:support@valtro.dev', '_blank')} className="sm:min-w-[160px]">
              <ExternalLink className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
