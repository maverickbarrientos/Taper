
import { cn } from "@/lib/utils"

interface StepCounterProps {
  numberOfSteps: number
  currentStep: number
}

export default function StepCounter({ numberOfSteps, currentStep }: StepCounterProps) {

  return (

    <div>
      <p className="text-muted-foreground font-bold">
        Step {currentStep} of {numberOfSteps}
      </p>

      <div className="flex items-center gap-2 mt-2">
        {Array.from({ length: numberOfSteps }).map((_, index) => (
          <div
            key={index}
            className={cn(
              'h-2 flex-1 rounded-full bg-muted transition-colors',
              index < currentStep && 'bg-primary'
            )}
          />
        ))}
      </div>
    </div>
  )
}