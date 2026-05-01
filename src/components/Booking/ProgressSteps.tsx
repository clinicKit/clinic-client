import React from 'react';
import { CheckCircle } from 'lucide-react';
import type { Step } from '../../types/booking';

interface ProgressStepsProps {
  steps: Step[];
  currentStep: number;
}
export const ProgressSteps: React.FC<ProgressStepsProps> = ({ steps, currentStep }) => {
  return (
    <div className="mb-8">
      <div className="relative max-w-2xl mx-auto">
        {/* Lines container - absolute positioned */}
        <div className="absolute left-0 right-0 top-6 flex items-center px-6">
          {steps.slice(0, -1).map((step, idx) => (
            <div
              key={idx}
              className={`flex-1 h-1 transition-all mx-2 ${
                currentStep > step.number ? 'bg-green-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        
        {/* Steps container */}
        <div className="relative flex justify-between">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;
            
            return (
              <div key={step.number} className="flex flex-col items-center">
                <div
                  className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : isActive
                      ? 'bg-accent-600 text-white ring-4 ring-accent-100'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle size={24} />
                  ) : (
                    <Icon size={24} />
                  )}
                </div>
                <p
                  className={`mt-2 text-xs md:text-sm font-medium whitespace-nowrap ${
                    isActive ? 'text-accent-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                  }`}
                >
                  {step.title}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};