
import { useState } from "react";
import { Path, UseFormTrigger } from "react-hook-form";
import { AthleteOnboardingData } from "@/features/onboarding/types";


const stepFields: Path<AthleteOnboardingData>[][] = [
  ["birthdate", "weight", "height"],
  ["events", "otherEvents"],
  ["level"],
  ["goals"],
];

export function useStepNavigation(
  trigger: UseFormTrigger<AthleteOnboardingData>, 
  initialStep: number = 0
) {

  const [currentStep, setCurrentStep] = useState<number>(initialStep)

  const handleNext = async () => {
    const fields = stepFields[currentStep] ?? [];
    const isValid = await trigger(fields, { shouldFocus: true });

    if (isValid) {
      setCurrentStep((prev) => prev + 1);
    }
  }

  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  return { 
    currentStep, 
    stepNumber: currentStep + 1,
    totalSteps: stepFields.length,
    isFirstStep: currentStep === 0, 
    isLastStep: currentStep === stepFields.length - 1,
    handleNext,
    handleBack
  }
}