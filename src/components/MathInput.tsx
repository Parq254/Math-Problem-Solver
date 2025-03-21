import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, Key } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface MathInputProps {
  onSolve: (problem: string) => Promise<void>;
  isLoading: boolean;
}

const API_KEY_STORAGE_KEY = 'wolfram_app_id';

const MathInput: React.FC<MathInputProps> = ({ onSolve, isLoading }) => {
  const [problem, setProblem] = useState('');
  const [apiDown, setApiDown] = useState(false);
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');

  // Load API key from localStorage on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (savedApiKey) {
      setApiKey(savedApiKey);
      // Also set it in the global window object for the API to use
      (window as any).WOLFRAM_APP_ID = savedApiKey;
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (problem.trim()) {
      setApiDown(true); // Assume API might be down until we get a successful response
      onSolve(problem).then(() => {
        // If we got here without an error, the API is working
        setApiDown(false);
      }).catch(() => {
        // Keep the apiDown flag true if there was an error
      });
    }
  };

  const saveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
      // Also set it in the global window object for the API to use
      (window as any).WOLFRAM_APP_ID = apiKey;
      setApiKeyDialogOpen(false);
      toast.success("Wolfram Alpha API key saved!");
    }
  };

  return (
    <div className="animate-fade-in w-full max-w-2xl mx-auto">
      {apiDown && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>
            Our external solver API may be down. Simple arithmetic still works locally.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Math Problem Solver</h2>
        <Dialog open={apiKeyDialogOpen} onOpenChange={setApiKeyDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              API Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Wolfram Alpha API Key</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-sm text-muted-foreground">
                Enter your Wolfram Alpha AppID to solve complex math problems. 
                You can get a free AppID at <a href="https://developer.wolframalpha.com/portal/myapps/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">developer.wolframalpha.com</a>
              </p>
              <Input
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter Wolfram Alpha AppID"
                className="w-full"
              />
              <Button onClick={saveApiKey} className="w-full">Save API Key</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="relative">
          <textarea
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            placeholder="Enter a math problem (e.g., integrate x^2, solve x^2 + 2x - 3 = 0, limit of sin(x)/x as x approaches 0)"
            className="math-input floating-input min-h-[120px] resize-none"
            data-gramm="false"
            spellCheck="false"
            autoComplete="off"
          />
        </div>
        
        <Button 
          type="submit" 
          disabled={isLoading || !problem.trim()} 
          className="w-full py-6 text-lg font-medium tracking-wide rounded-xl transition-all duration-300 bg-primary hover:bg-primary/90"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> 
              Solving...
            </>
          ) : (
            'Solve'
          )}
        </Button>
      </form>
    </div>
  );
};

export default MathInput;
