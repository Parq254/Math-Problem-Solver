
import React, { useEffect, useRef } from 'react';
import 'katex/dist/katex.min.css';
import { renderToString } from 'katex';

interface SolutionProps {
  steps: string[];
  solution: string;
}

const Solution: React.FC<SolutionProps> = ({ steps, solution }) => {
  const solutionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (solutionRef.current) {
      solutionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [steps, solution]);

  const renderLatex = (latex: string) => {
    try {
      // Check if the string already contains HTML
      if (latex.includes('<') && latex.includes('>')) {
        return latex;
      }
      
      // If it's a text label from Wolfram (starts with \text{})
      if (latex.startsWith('\\text{')) {
        // Split the string at the first colon to separate the label and content
        const colonIndex = latex.indexOf(':}');
        if (colonIndex !== -1) {
          const label = latex.substring(0, colonIndex + 2); // Include the colon and closing bracket
          const content = latex.substring(colonIndex + 2);
          
          try {
            // Render the label and content separately
            const renderedLabel = renderToString(label, { throwOnError: false });
            let renderedContent;
            
            try {
              // Try to render the content as LaTeX
              renderedContent = renderToString(content, { throwOnError: false, displayMode: true });
            } catch (contentError) {
              // If content can't be rendered as LaTeX, display as plain text
              renderedContent = `<span>${content}</span>`;
            }
            
            return `${renderedLabel} ${renderedContent}`;
          } catch (error) {
            console.error('Error rendering split LaTeX:', error);
            return latex;
          }
        }
      }
      
      // Standard LaTeX rendering
      return renderToString(latex, {
        throwOnError: false,
        displayMode: true,
      });
    } catch (error) {
      console.error('Error rendering LaTeX:', error);
      return `<span>${latex}</span>`;
    }
  };

  // Deduplicate steps - only needed if the API returns duplicates
  const uniqueSteps = [...new Set(steps)];

  return (
    <div 
      ref={solutionRef}
      className="solution-card animate-slide-up w-full max-w-2xl mx-auto mt-8 overflow-hidden"
    >
      <h2 className="text-xl font-semibold mb-4">Solution</h2>
      
      <div className="space-y-4 fade-mask overflow-y-auto max-h-[500px] pr-2">
        {uniqueSteps.map((step, index) => (
          <div 
            key={index} 
            className="step-transition py-2"
            style={{ 
              animationDelay: `${index * 100}ms`,
            }}
          >
            <div
              dangerouslySetInnerHTML={{ __html: renderLatex(step) }}
              className="overflow-x-auto"
            />
            {index < uniqueSteps.length - 1 && (
              <div className="h-px bg-border/50 w-full my-4" />
            )}
          </div>
        ))}
        
        <div className="mt-6 pt-4 border-t border-border">
          <h3 className="text-lg font-medium mb-2">Final Answer</h3>
          <div 
            className="p-4 bg-secondary/50 rounded-lg overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: renderLatex(solution) }}
          />
        </div>
      </div>
    </div>
  );
};

export default Solution;
