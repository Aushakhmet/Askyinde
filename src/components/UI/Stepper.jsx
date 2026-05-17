import React from 'react';
import { Check } from 'lucide-react';

const Stepper = ({ currentStep }) => {
  const steps = [
    'Search',
    'Flights',
    'Seats',
    'Passenger',
    'Payment',
  ];

  return (
    <div className="w-full mb-14 px-2 md:px-6">
      <div className="w-full max-w-[900px] mx-auto flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          const isPassedOrActive = index <= currentStep;

          return (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center relative shrink-0">
                <div
                  className={`w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center border-2 font-bold transition-all duration-700 ease-in-out ${
                    isPassedOrActive
                      ? 'bg-[#0A4A5E] border-[#0A4A5E] text-white shadow-md scale-105'
                      : 'bg-white/70 border-gray-300 text-gray-400'
                  }`}
                >
                  {isCompleted ? <Check size={20} /> : index + 1}
                </div>

                <span
                  className={`absolute top-12 md:top-14 text-[10px] md:text-xs font-bold whitespace-nowrap transition-all duration-700 ${
                    isPassedOrActive
                      ? 'text-[#0A4A5E] opacity-100'
                      : 'text-gray-400 opacity-60'
                  }`}
                >
                  {step}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div className="relative flex-1 h-[3px] mx-2 md:mx-3 bg-gray-300 rounded-full overflow-hidden">
                  <div
                    className={`absolute left-0 top-0 h-full bg-[#0A4A5E] rounded-full transition-all duration-700 ease-in-out ${
                      index < currentStep ? 'w-full' : 'w-0'
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;