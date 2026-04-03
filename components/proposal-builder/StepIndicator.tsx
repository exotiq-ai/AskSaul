interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
}

export default function StepIndicator({
  currentStep,
  totalSteps,
  labels,
}: StepIndicatorProps) {
  return (
    <div className="flex flex-col items-center gap-3 mb-8">
      <div className="flex items-center gap-2">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const stepNum = i + 1;
          const isCompleted = stepNum < currentStep;
          const isActive = stepNum === currentStep;

          return (
            <div key={i} className="flex items-center gap-2">
              <div
                className={`
                  flex items-center justify-center rounded-full text-xs font-semibold transition-all duration-300
                  ${
                    isCompleted
                      ? "w-7 h-7 bg-cyan text-obsidian"
                      : isActive
                      ? "w-8 h-8 bg-cyan text-obsidian ring-2 ring-cyan/30 ring-offset-2 ring-offset-obsidian"
                      : "w-7 h-7 bg-graphite text-dim border border-wire"
                  }
                `}
              >
                {isCompleted ? (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  stepNum
                )}
              </div>
              {i < totalSteps - 1 && (
                <div
                  className={`w-8 sm:w-12 h-0.5 transition-all duration-500 ${
                    isCompleted ? "bg-cyan" : "bg-wire"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
      {labels && labels[currentStep - 1] && (
        <p className="text-sm text-slate">{labels[currentStep - 1]}</p>
      )}
    </div>
  );
}
