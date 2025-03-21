
import React, { useState, useEffect } from 'react';
import { solveProblem } from '@/lib/mathApi';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MathInput from '@/components/MathInput';
import Solution from '@/components/Solution';
import { Loader2 } from 'lucide-react';

// Install katex package
import 'katex/dist/katex.min.css';

interface SolutionData {
  steps: string[];
  solution: string;
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [solutionData, setSolutionData] = useState<SolutionData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize Wolfram AppID from localStorage on mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('wolfram_app_id');
    if (savedApiKey) {
      (window as any).WOLFRAM_APP_ID = savedApiKey;
    }
  }, []);

  const handleSolve = async (problem: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await solveProblem(problem);
      setSolutionData(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to solve the problem';
      setError(message);
      toast.error(message);
      console.error('Error solving problem:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container max-w-5xl mx-auto px-4 py-8">
        <div className="mb-12">
          <MathInput onSolve={handleSolve} isLoading={isLoading} />
          
          {isLoading && (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Solving your problem...</p>
            </div>
          )}
          
          {error && !isLoading && (
            <div className="w-full max-w-2xl mx-auto mt-8 p-4 border border-destructive/30 bg-destructive/10 rounded-lg text-destructive">
              <p className="font-medium">Error: {error}</p>
              <p className="text-sm mt-2">Try checking your syntax and try again.</p>
            </div>
          )}
          
          {solutionData && !isLoading && (
            <Solution steps={solutionData.steps} solution={solutionData.solution} />
          )}
          
          {!solutionData && !isLoading && !error && (
            <div className="mt-16 text-center animate-pulse">
              <p className="text-muted-foreground">Enter a problem above to get started</p>
            </div>
          )}
        </div>
        
        <div className="mt-16">
          <h2 className="text-2xl font-serif font-semibold mb-6 text-center">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-effect rounded-xl p-6">
              <div className="w-12 h-12 flex items-center justify-center bg-secondary rounded-full mb-4">
                <span className="text-lg font-medium">1</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Enter Your Problem</h3>
              <p className="text-muted-foreground text-sm">
                Type any algebraic equation or expression in the input field above.
              </p>
            </div>
            
            <div className="glass-effect rounded-xl p-6">
              <div className="w-12 h-12 flex items-center justify-center bg-secondary rounded-full mb-4">
                <span className="text-lg font-medium">2</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Get Step-by-Step Solution</h3>
              <p className="text-muted-foreground text-sm">
                Our math engine breaks down the solution process into clear, understandable steps.
              </p>
            </div>
            
            <div className="glass-effect rounded-xl p-6">
              <div className="w-12 h-12 flex items-center justify-center bg-secondary rounded-full mb-4">
                <span className="text-lg font-medium">3</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Learn & Understand</h3>
              <p className="text-muted-foreground text-sm">
                Review each step to understand the mathematical concepts and problem-solving techniques.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
