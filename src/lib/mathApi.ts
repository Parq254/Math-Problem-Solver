import { toast } from 'sonner';

interface SolveResponse {
  steps: string[];
  solution: string;
}

interface ErrorResponse {
  error: string;
}

// Original API URL - might be unreliable
const ORIGINAL_API_URL = 'https://algebra-steps-api.onrender.com';

// Wolfram Alpha API connector - more powerful math solver
const WOLFRAM_APP_ID = "DEMO-APPID"; // Replace with actual AppID when user provides it

// Simple local mock solver for basic operations when API is down
function mockSolveProblem(problem: string): SolveResponse {
  try {
    // Clean the input
    const cleanedProblem = problem.trim().replace(/\s+/g, '');
    
    // Handle basic expressions (no variables)
    if (!cleanedProblem.includes('=') && !cleanedProblem.includes('x')) {
      try {
        // Use Function constructor to safely evaluate the math expression
        // This handles basic arithmetic: +, -, *, /, (), and exponents
        const sanitizedProblem = cleanedProblem
          .replace(/\^/g, '**')  // Replace ^ with ** for exponentiation
          .replace(/[a-zA-Z]/g, ''); // Remove any letters for safety
          
        // eslint-disable-next-line no-new-func
        const result = Function(`"use strict"; return (${sanitizedProblem})`)();
        
        return {
          steps: [
            `\\text{Original problem: } ${problem}`,
            `\\text{Simplify: } ${cleanedProblem}`,
            `\\text{Calculate: } ${result}`
          ],
          solution: `${result}`
        };
      } catch (error) {
        throw new Error('Invalid arithmetic expression');
      }
    }
    
    // For equations and more complex problems, show a fallback message
    return {
      steps: [
        `\\text{Original problem: } ${problem}`,
        `\\text{Sorry, the external API is unavailable.}`,
        `\\text{For complex equations and algebra problems,}`,
        `\\text{we need to connect to our solver service.}`
      ],
      solution: "API unavailable - try simple arithmetic only"
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid problem format';
    throw new Error(message);
  }
}

// Function to solve problems using Wolfram Alpha
async function solveWithWolframAlpha(problem: string): Promise<SolveResponse> {
  try {
    // Encode the problem for URL
    const encodedProblem = encodeURIComponent(problem);
    
    // Build the Wolfram Alpha API URL
    const wolframUrl = `https://api.wolframalpha.com/v2/query?input=${encodedProblem}&format=plaintext&output=JSON&appid=${WOLFRAM_APP_ID}`;
    
    const response = await fetch(wolframUrl);
    
    if (!response.ok) {
      throw new Error('Failed to connect to Wolfram Alpha');
    }
    
    const data = await response.json();
    
    // Extract pods from Wolfram Alpha response
    const pods = data.queryresult?.pods || [];
    
    // Extract steps and solution from pods
    const steps: string[] = [];
    let solution = "No solution found";
    
    pods.forEach((pod: any) => {
      // Get the title of the pod
      const title = pod.title;
      
      // Get the plaintext content
      const content = pod.subpods?.[0]?.plaintext || '';
      
      if (content) {
        // Add step with LaTeX formatting
        steps.push(`\\text{${title}:} ${content}`);
        
        // Use "Result" or "Solution" pod as the final answer
        if (title === 'Result' || title === 'Solution' || title === 'Derivative' || title === 'Integral') {
          solution = content;
        }
      }
    });
    
    return {
      steps: steps.length > 0 ? steps : ["No steps available"],
      solution: solution
    };
  } catch (error) {
    console.error('Wolfram Alpha API error:', error);
    throw new Error('Failed to solve using Wolfram Alpha');
  }
}

export async function solveProblem(problem: string): Promise<SolveResponse> {
  try {
    // First try Wolfram Alpha for complex problems
    try {
      if (WOLFRAM_APP_ID !== "DEMO-APPID") {
        console.log('Solving with Wolfram Alpha...');
        return await solveWithWolframAlpha(problem);
      }
    } catch (wolframError) {
      console.log('Wolfram Alpha failed, trying original API...');
      // If Wolfram fails, try the original API
    }
    
    // Try the original API
    try {
      console.log('Trying original API...');
      const response = await fetch(`${ORIGINAL_API_URL}/solve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ problem }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorData = data as ErrorResponse;
        throw new Error(errorData.error || 'Failed to solve the problem');
      }

      return data as SolveResponse;
    } catch (originalApiError) {
      console.log('Original API failed, using local solver...');
      // If original API fails, use our local mock solver
      return mockSolveProblem(problem);
    }
  } catch (error) {
    // If all methods fail, show error message
    const message = error instanceof Error 
      ? error.message 
      : 'Failed to solve the problem';
    toast.error(message);
    throw error;
  }
}
