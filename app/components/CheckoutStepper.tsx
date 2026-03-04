interface Step {
  label: string;
  icon: string;
}

interface CheckoutStepperProps {
  currentStep: 1 | 2 | 3;
}

const STEPS: Step[] = [
  { label: 'Panier',    icon: '🛒' },
  { label: 'Livraison', icon: '📦' },
  { label: 'Paiement',  icon: '💳' },
];

export default function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
  return (
    <div className="flex items-center justify-center w-full gap-0 mb-8 sm:mb-10 px-2">
      {STEPS.map((step, idx) => {
        const stepNum = idx + 1 as 1 | 2 | 3;
        const isDone    = stepNum < currentStep;
        const isActive  = stepNum === currentStep;
        const isPending = stepNum > currentStep;

        return (
          <div key={step.label} className="flex items-center flex-1 last:flex-none">
            {/* Step */}
            <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
              <div
                className={`stepper-step-circle text-sm font-bold
                  ${isDone    ? 'bg-benin-vert text-white' : ''}
                  ${isActive  ? 'bg-benin-jaune text-black dark:text-gray-100' : ''}
                  ${isPending ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500' : ''}
                `}
              >
                {isDone ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : (
                  <span>{step.icon}</span>
                )}
              </div>
              <span
                className={`font-basecoat text-xs uppercase tracking-widest hidden sm:block
                  ${isActive  ? 'text-gray-900 dark:text-gray-100 font-bold' : ''}
                  ${isDone    ? 'text-benin-vert font-semibold' : ''}
                  ${isPending ? 'text-gray-400 dark:text-gray-500' : ''}
                `}
              >
                {step.label}
              </span>
            </div>

            {/* Connector */}
            {idx < STEPS.length - 1 && (
              <div
                className={`stepper-connector mx-2 sm:mx-3
                  ${isDone ? 'bg-benin-vert' : 'bg-gray-200 dark:bg-gray-700'}
                `}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
