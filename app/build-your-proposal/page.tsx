"use client";

import { useState, useEffect, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import type { Metadata } from "next";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StepIndicator from "@/components/proposal-builder/StepIndicator";
import ServiceSelector from "@/components/proposal-builder/ServiceSelector";
import BusinessInfo from "@/components/proposal-builder/BusinessInfo";
import QuestionFlow from "@/components/proposal-builder/QuestionFlow";
import ContactPreferences from "@/components/proposal-builder/ContactPreferences";
import SummaryReview from "@/components/proposal-builder/SummaryReview";
import SubmissionConfirmation from "@/components/proposal-builder/SubmissionConfirmation";
import Button from "@/components/ui/Button";

import {
  step1Schema,
  step2Schema,
  step4Schema,
  proposalSchema,
} from "@/lib/validation";
import type { ProposalFormData, ServiceOption } from "@/lib/validation";

const STEP_LABELS = [
  "What do you need?",
  "About your business",
  "A few more questions",
  "Contact & preferences",
  "Review & submit",
];

const STORAGE_KEY = "asksaul_proposal_draft";

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 40 : -40,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({
    x: dir > 0 ? -40 : 40,
    opacity: 0,
  }),
};

export default function BuildYourProposalPage() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const methods = useForm<ProposalFormData>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      services: [],
      teamSize: "1",
      preferredContact: "email",
      timeline: "1-2-months",
      marketingTools: [],
    },
    mode: "onTouched",
  });

  const { watch, setValue, getValues, trigger, handleSubmit } = methods;
  const services = watch("services") as ServiceOption[];

  // Restore from sessionStorage
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<ProposalFormData>;
        Object.entries(parsed).forEach(([key, value]) => {
          setValue(key as keyof ProposalFormData, value as never);
        });
      }
    } catch {
      // Ignore parse errors
    }
  }, [setValue]);

  // Persist to sessionStorage on change
  useEffect(() => {
    const sub = watch((values) => {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(values));
      } catch {
        // Ignore storage errors
      }
    });
    return () => sub.unsubscribe();
  }, [watch]);

  function scrollToTop() {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function goNext() {
    let valid = false;
    if (step === 1) valid = await trigger("services");
    else if (step === 2)
      valid = await trigger(["businessName", "industry", "teamSize"]);
    else if (step === 3) valid = true; // optional questions
    else if (step === 4)
      valid = await trigger(["name", "email", "preferredContact", "timeline"]);
    else valid = true;

    if (valid) {
      setDirection(1);
      setStep((s) => s + 1);
      scrollToTop();
    }
  }

  function goBack() {
    setDirection(-1);
    setStep((s) => s - 1);
    scrollToTop();
  }

  function goToStep(targetStep: number) {
    setDirection(targetStep > step ? 1 : -1);
    setStep(targetStep);
    scrollToTop();
  }

  const onSubmit = handleSubmit(async (data) => {
    if (submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Submission failed");
      sessionStorage.removeItem(STORAGE_KEY);
      setSubmitted(true);
    } catch {
      setSubmitError("Something went wrong. Please try again or email us directly.");
    } finally {
      setSubmitting(false);
    }
  });

  if (submitted) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-24 px-4">
          <div className="w-full max-w-lg">
            <SubmissionConfirmation />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <FormProvider {...methods}>
      <Navbar />
      <main className="flex-1 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div ref={topRef} className="text-center mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-cyan mb-2">
              Proposal Builder
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-cloud mb-3">
              Build Your Proposal
            </h1>
            <p className="text-slate text-base max-w-md mx-auto">
              Answer a few questions and Saul will put together a real, scoped proposal. Takes about 3 minutes.
            </p>
          </div>

          <StepIndicator
            currentStep={step}
            totalSteps={5}
            labels={STEP_LABELS}
          />

          {/* Card */}
          <div className="bg-carbon/80 backdrop-blur-sm border border-wire rounded-2xl overflow-hidden">
            <div className="p-6 sm:p-8">
              {/* Step title */}
              <h2 className="font-display text-lg font-semibold text-cloud mb-6">
                {STEP_LABELS[step - 1]}
              </h2>

              {/* Step content */}
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={step}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  {step === 1 && (
                    <ServiceSelector
                      selected={services}
                      onChange={(s) =>
                        setValue("services", s, { shouldValidate: true })
                      }
                      error={methods.formState.errors.services?.message as string | undefined}
                    />
                  )}
                  {step === 2 && <BusinessInfo />}
                  {step === 3 && <QuestionFlow services={services} />}
                  {step === 4 && <ContactPreferences />}
                  {step === 5 && (
                    <SummaryReview data={getValues()} onEdit={goToStep} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Nav buttons */}
            <div className="px-6 sm:px-8 pb-6 sm:pb-8 flex items-center justify-between gap-4 border-t border-wire/50 pt-5">
              {step > 1 ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  onClick={goBack}
                  disabled={submitting}
                >
                  Back
                </Button>
              ) : (
                <div />
              )}

              {step < 5 ? (
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={goNext}
                >
                  Continue
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={onSubmit}
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit Proposal"}
                </Button>
              )}
            </div>

            {submitError && (
              <p className="px-6 sm:px-8 pb-4 text-sm text-error text-center">
                {submitError}
              </p>
            )}
          </div>

          <p className="text-center text-xs text-dim mt-6">
            No spam. No sales calls you did not ask for. Just a real proposal.
          </p>
        </div>
      </main>
      <Footer />
    </FormProvider>
  );
}
