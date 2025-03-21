
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-8 w-full animate-slide-down">
      <div className="container max-w-5xl mx-auto px-4">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="inline-flex items-center justify-center rounded-full bg-secondary/80 px-3 py-1 text-sm font-medium text-primary mb-4">
            Algebra Solver
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-semibold tracking-tight mb-3">
            Step-by-Step Math Solutions
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Enter any algebra problem, equation, or expression and get a detailed step-by-step solution instantly.
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
