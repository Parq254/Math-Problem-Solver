
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-12 mt-16 border-t border-border/20">
      <div className="container max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-sm font-medium mb-4">About</h3>
            <p className="text-sm text-muted-foreground">
              This algebra solver provides step-by-step solutions to help you understand and learn mathematics.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-4">Examples</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>2x + 3 = 7</li>
              <li>x^2 - 4x + 4 = 0</li>
              <li>2(x + 3) = 10</li>
              <li>3x^2 - 2x - 8 = 0</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-4">Features</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Solve linear equations</li>
              <li>Solve quadratic equations</li>
              <li>Evaluate expressions</li>
              <li>Step-by-step solutions</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-border/20 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Algebra Solver. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
