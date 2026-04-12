"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, RotateCcw } from "lucide-react";

type StepKey =
  | "sites"
  | "contractors"
  | "contractorWorkers"
  | "internalControl"
  | "suppliersControl"
  | "aiValidation"
  | "email";

interface EstimatorContent {
  title: string;
  subtitle: string;
  disclaimer: string;
  progress: string;
  summaryTitle: string;
  emptyValue: string;
  resultTitle: string;
  confirmationTitle: string;
  confirmationMessage: string;
  recommendedPlan: string;
  estimatedPrice: string;
  customPrice: string;
  monthly: string;
  methodology: string;
  contactCta: string;
  trialCta: string;
  resetCta: string;
  buttons: {
    back: string;
    next: string;
    seeResult: string;
    edit: string;
  };
  options: {
    yes: string;
    no: string;
    singleSite: string;
    multipleSites: string;
  };
  validation: {
    selectOption: string;
    minTwoSites: string;
    nonNegative: string;
    positive: string;
    invalidEmail: string;
    businessEmailRequired: string;
  };
  steps: {
    sites: { label: string; question: string; countLabel: string };
    contractors: { label: string; question: string };
    contractorWorkers: { label: string; question: string };
    internalControl: { label: string; question: string };
    internalWorkers: { label: string; question: string };
    suppliersControl: { label: string; question: string };
    suppliersCount: { label: string; question: string };
    aiValidation: { label: string; question: string };
    email: { label: string; question: string; placeholder: string };
  };
  result: {
    volumeLow: string;
    volumeMedium: string;
    volumeHigh: string;
    volumeEnterprise: string;
  };
}

interface PricingEstimatorProps {
  content: EstimatorContent;
}

interface EstimatorState {
  siteMode: "single" | "multiple" | null;
  siteCount: number;
  contractors: number;
  contractorWorkers: number;
  controlInternalWorkers: boolean | null;
  internalWorkers: number;
  controlSuppliers: boolean | null;
  suppliersCount: number;
  aiValidation: boolean | null;
  email: string;
}

const BASE_STATE: EstimatorState = {
  siteMode: null,
  siteCount: 2,
  contractors: 10,
  contractorWorkers: 100,
  controlInternalWorkers: null,
  internalWorkers: 25,
  controlSuppliers: null,
  suppliersCount: 20,
  aiValidation: null,
  email: "",
};

const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com", "googlemail.com", "hotmail.com", "hotmail.es", "hotmail.co.uk",
  "outlook.com", "outlook.es", "live.com", "live.es", "msn.com",
  "yahoo.com", "yahoo.es", "yahoo.co.uk", "ymail.com",
  "icloud.com", "me.com", "mac.com",
  "protonmail.com", "proton.me",
  "aol.com", "aim.com",
  "mail.com", "email.com", "inbox.com",
  "gmx.com", "gmx.es", "gmx.net",
]);

function isBusinessEmail(email: string): boolean {
  const parts = email.toLowerCase().split("@");
  if (parts.length !== 2) return false;
  return !FREE_EMAIL_DOMAINS.has(parts[1]);
}

function sanitizeNumber(value: number): number {
  return Number.isFinite(value) ? Math.max(0, Math.round(value)) : 0;
}

function buildProgressText(template: string, current: number, total: number): string {
  return template
    .replace("{current}", String(current))
    .replace("{total}", String(total));
}

function getRecommendation(
  state: EstimatorState,
  customPriceLabel: string
) {
  const sites = state.siteMode === "multiple" ? Math.max(2, sanitizeNumber(state.siteCount)) : 1;
  const contractors = sanitizeNumber(state.contractors);
  const contractorWorkers = sanitizeNumber(state.contractorWorkers);
  const internalWorkers =
    state.controlInternalWorkers === true ? sanitizeNumber(state.internalWorkers) : 0;
  const suppliers = state.controlSuppliers === true ? sanitizeNumber(state.suppliersCount) : 0;
  const aiEnabled = state.aiValidation === true;

  const score =
    sites * 12 +
    contractors * 4 +
    contractorWorkers * 0.25 +
    internalWorkers * 0.2 +
    suppliers * 1.5 +
    (aiEnabled ? 90 : 0);

  let estimatedPrice = Math.round(149 + score);
  if (estimatedPrice < 199) {
    estimatedPrice = 199;
  }

  if (score < 220) {
    return {
      score,
      estimatedPrice: Math.min(Math.max(199, estimatedPrice), 349),
      isCustom: false,
      displayPrice: String(Math.min(Math.max(199, estimatedPrice), 349)),
    };
  }

  if (score < 900) {
    return {
      score,
      estimatedPrice: Math.min(Math.max(399, estimatedPrice), 1199),
      isCustom: false,
      displayPrice: String(Math.min(Math.max(399, estimatedPrice), 1199)),
    };
  }

  return {
    score,
    estimatedPrice,
    isCustom: true,
    displayPrice: customPriceLabel,
  };
}

export default function PricingEstimator({ content }: PricingEstimatorProps) {
  const [state, setState] = useState<EstimatorState>(BASE_STATE);
  const [stepIndex, setStepIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const steps = useMemo(() => {
    const baseSteps: StepKey[] = [
      "sites",
      "contractors",
      "contractorWorkers",
      "internalControl",
    ];

    baseSteps.push("suppliersControl");

    baseSteps.push("aiValidation");
    baseSteps.push("email");
    return baseSteps;
  }, [state.controlInternalWorkers]);

  useEffect(() => {
    if (stepIndex >= steps.length) {
      setStepIndex(Math.max(steps.length - 1, 0));
    }
  }, [stepIndex, steps.length]);

  const currentStep = steps[stepIndex];
  const recommendation = useMemo(
    () => getRecommendation(state, content.customPrice),
    [state, content.customPrice]
  );

  const volumeTag = useMemo(() => {
    if (recommendation.score < 220) {
      return content.result.volumeLow;
    }
    if (recommendation.score < 520) {
      return content.result.volumeMedium;
    }
    if (recommendation.score < 900) {
      return content.result.volumeHigh;
    }
    return content.result.volumeEnterprise;
  }, [recommendation.score, content.result]);

  const stepLabels = useMemo(
    () =>
      ({
        sites: content.steps.sites.label,
        contractors: content.steps.contractors.label,
        contractorWorkers: content.steps.contractorWorkers.label,
        internalControl: content.steps.internalControl.label,
        suppliersControl: content.steps.suppliersControl.label,
        aiValidation: content.steps.aiValidation.label,
        email: content.steps.email.label,
      }) satisfies Record<StepKey, string>,
    [content.steps]
  );

  const summaryItems = useMemo(
    () => [
      {
        label: content.steps.sites.label,
        value:
          state.siteMode === "multiple"
            ? `${sanitizeNumber(state.siteCount)}`
            : state.siteMode === "single"
              ? "1"
              : content.emptyValue,
      },
      {
        label: content.steps.contractors.label,
        value: `${sanitizeNumber(state.contractors)}`,
      },
      {
        label: content.steps.contractorWorkers.label,
        value: `${sanitizeNumber(state.contractorWorkers)}`,
      },
      {
        label: content.steps.internalControl.label,
        value:
          state.controlInternalWorkers === null
            ? content.emptyValue
            : state.controlInternalWorkers
              ? `${sanitizeNumber(state.internalWorkers)}`
              : content.options.no,
      },
      {
        label: content.steps.suppliersControl.label,
        value:
          state.controlSuppliers === null
            ? content.emptyValue
            : state.controlSuppliers
              ? `${sanitizeNumber(state.suppliersCount)}`
              : content.options.no,
      },
      {
        label: content.steps.aiValidation.label,
        value:
          state.aiValidation === null
            ? content.emptyValue
            : state.aiValidation
              ? content.options.yes
              : content.options.no,
      },
      {
        label: content.steps.email.label,
        value: state.email || content.emptyValue,
      },
    ],
    [state, content]
  );

  const validateCurrentStep = () => {
    switch (currentStep) {
      case "sites":
        if (!state.siteMode) {
          setError(content.validation.selectOption);
          return false;
        }
        if (state.siteMode === "multiple" && sanitizeNumber(state.siteCount) < 2) {
          setError(content.validation.minTwoSites);
          return false;
        }
        break;
      case "contractors":
        if (sanitizeNumber(state.contractors) < 0) {
          setError(content.validation.nonNegative);
          return false;
        }
        break;
      case "contractorWorkers":
        if (sanitizeNumber(state.contractorWorkers) < 0) {
          setError(content.validation.nonNegative);
          return false;
        }
        break;
      case "internalControl":
        if (state.controlInternalWorkers === null) {
          setError(content.validation.selectOption);
          return false;
        }
        if (
          state.controlInternalWorkers === true &&
          sanitizeNumber(state.internalWorkers) <= 0
        ) {
          setError(content.validation.positive);
          return false;
        }
        break;
      case "suppliersControl":
        if (state.controlSuppliers === null) {
          setError(content.validation.selectOption);
          return false;
        }
        if (
          state.controlSuppliers === true &&
          sanitizeNumber(state.suppliersCount) <= 0
        ) {
          setError(content.validation.positive);
          return false;
        }
        break;
      case "aiValidation":
        if (state.aiValidation === null) {
          setError(content.validation.selectOption);
          return false;
        }
        break;
      case "email": {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(state.email)) {
          setError(content.validation.invalidEmail);
          return false;
        }
        if (!isBusinessEmail(state.email)) {
          setError(content.validation.businessEmailRequired);
          return false;
        }
        break;
      }
      default:
        break;
    }

    setError(null);
    return true;
  };

  const goNext = () => {
    if (!validateCurrentStep()) {
      return;
    }

    if (stepIndex < steps.length - 1) {
      setStepIndex((prev) => prev + 1);
      return;
    }

    void fetch("/api/pricing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: state.email,
        siteMode: state.siteMode,
        siteCount: state.siteMode === "multiple" ? sanitizeNumber(state.siteCount) : 1,
        contractors: sanitizeNumber(state.contractors),
        contractorWorkers: sanitizeNumber(state.contractorWorkers),
        controlInternalWorkers: state.controlInternalWorkers === true,
        internalWorkers: state.controlInternalWorkers === true ? sanitizeNumber(state.internalWorkers) : 0,
        controlSuppliers: state.controlSuppliers === true,
        suppliersCount: state.controlSuppliers === true ? sanitizeNumber(state.suppliersCount) : 0,
        aiValidation: state.aiValidation === true,
        estimatedPrice: recommendation.estimatedPrice,
        isCustom: recommendation.isCustom,
        score: recommendation.score,
      }),
    });

    setShowResult(true);
  };

  const goBack = () => {
    setError(null);

    if (showResult) {
      setShowResult(false);
      return;
    }

    if (stepIndex > 0) {
      setStepIndex((prev) => prev - 1);
    }
  };

  const resetWizard = () => {
    setState(BASE_STATE);
    setStepIndex(0);
    setShowResult(false);
    setError(null);
  };

  const renderChoiceButton = (
    isSelected: boolean,
    label: string,
    onClick: () => void
  ) => (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-xl border px-4 py-3 text-left font-medium transition-colors ${
        isSelected
          ? "border-playBlueDark bg-playBlueDark text-white"
          : "border-playBlueLight/30 bg-white text-playBlueDark hover:border-playBlueLight/60"
      }`}
    >
      {label}
    </button>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "sites":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-playBlueDark">
              {content.steps.sites.question}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {renderChoiceButton(
                state.siteMode === "single",
                content.options.singleSite,
                () => setState((prev) => ({ ...prev, siteMode: "single", siteCount: 1 }))
              )}
              {renderChoiceButton(
                state.siteMode === "multiple",
                content.options.multipleSites,
                () => setState((prev) => ({ ...prev, siteMode: "multiple", siteCount: Math.max(prev.siteCount, 2) }))
              )}
            </div>

            {state.siteMode === "multiple" && (
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-playBlueLight">
                  {content.steps.sites.countLabel}
                </span>
                <input
                  min={2}
                  type="number"
                  value={state.siteCount}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      siteCount: sanitizeNumber(Number(e.target.value)),
                    }))
                  }
                  className="w-full rounded-xl border border-playBlueLight/30 px-4 py-3 text-playBlueDark focus:border-playBlueDark focus:outline-none"
                />
              </label>
            )}
          </div>
        );

      case "contractors":
        return (
          <label className="block">
            <h3 className="text-xl font-semibold text-playBlueDark mb-3">
              {content.steps.contractors.question}
            </h3>
            <input
              min={0}
              type="number"
              value={state.contractors}
              onChange={(e) =>
                setState((prev) => ({
                  ...prev,
                  contractors: sanitizeNumber(Number(e.target.value)),
                }))
              }
              className="w-full rounded-xl border border-playBlueLight/30 px-4 py-3 text-playBlueDark focus:border-playBlueDark focus:outline-none"
            />
          </label>
        );

      case "contractorWorkers":
        return (
          <label className="block">
            <h3 className="text-xl font-semibold text-playBlueDark mb-3">
              {content.steps.contractorWorkers.question}
            </h3>
            <input
              min={0}
              type="number"
              value={state.contractorWorkers}
              onChange={(e) =>
                setState((prev) => ({
                  ...prev,
                  contractorWorkers: sanitizeNumber(Number(e.target.value)),
                }))
              }
              className="w-full rounded-xl border border-playBlueLight/30 px-4 py-3 text-playBlueDark focus:border-playBlueDark focus:outline-none"
            />
          </label>
        );

      case "internalControl":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-playBlueDark">
              {content.steps.internalControl.question}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {renderChoiceButton(
                state.controlInternalWorkers === true,
                content.options.yes,
                () =>
                  setState((prev) => ({
                    ...prev,
                    controlInternalWorkers: true,
                    internalWorkers:
                      sanitizeNumber(prev.internalWorkers) > 0
                        ? sanitizeNumber(prev.internalWorkers)
                        : 1,
                  }))
              )}
              {renderChoiceButton(
                state.controlInternalWorkers === false,
                content.options.no,
                () =>
                  setState((prev) => ({
                    ...prev,
                    controlInternalWorkers: false,
                  }))
              )}
            </div>
            {state.controlInternalWorkers === true && (
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-playBlueLight">
                  {content.steps.internalWorkers.question}
                </span>
                <input
                  min={1}
                  type="number"
                  value={state.internalWorkers}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      internalWorkers: sanitizeNumber(Number(e.target.value)),
                    }))
                  }
                  className="w-full rounded-xl border border-playBlueLight/30 px-4 py-3 text-playBlueDark focus:border-playBlueDark focus:outline-none"
                />
              </label>
            )}
          </div>
        );

      case "suppliersControl":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-playBlueDark">
              {content.steps.suppliersControl.question}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {renderChoiceButton(
                state.controlSuppliers === true,
                content.options.yes,
                () =>
                  setState((prev) => ({
                    ...prev,
                    controlSuppliers: true,
                    suppliersCount:
                      sanitizeNumber(prev.suppliersCount) > 0
                        ? sanitizeNumber(prev.suppliersCount)
                        : 1,
                  }))
              )}
              {renderChoiceButton(
                state.controlSuppliers === false,
                content.options.no,
                () =>
                  setState((prev) => ({
                    ...prev,
                    controlSuppliers: false,
                  }))
              )}
            </div>
            {state.controlSuppliers === true && (
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-playBlueLight">
                  {content.steps.suppliersCount.question}
                </span>
                <input
                  min={1}
                  type="number"
                  value={state.suppliersCount}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      suppliersCount: sanitizeNumber(Number(e.target.value)),
                    }))
                  }
                  className="w-full rounded-xl border border-playBlueLight/30 px-4 py-3 text-playBlueDark focus:border-playBlueDark focus:outline-none"
                />
              </label>
            )}
          </div>
        );

      case "aiValidation":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-playBlueDark">
              {content.steps.aiValidation.question}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {renderChoiceButton(
                state.aiValidation === true,
                content.options.yes,
                () =>
                  setState((prev) => ({
                    ...prev,
                    aiValidation: true,
                  }))
              )}
              {renderChoiceButton(
                state.aiValidation === false,
                content.options.no,
                () =>
                  setState((prev) => ({
                    ...prev,
                    aiValidation: false,
                  }))
              )}
            </div>
          </div>
        );

      case "email":
        return (
          <label className="block">
            <h3 className="text-xl font-semibold text-playBlueDark mb-3">
              {content.steps.email.question}
            </h3>
            <input
              type="email"
              autoComplete="work email"
              placeholder={content.steps.email.placeholder}
              value={state.email}
              onChange={(e) =>
                setState((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full rounded-xl border border-playBlueLight/30 px-4 py-3 text-playBlueDark focus:border-playBlueDark focus:outline-none"
            />
          </label>
        );

      default:
        return null;
    }
  };

  return (
    <div className="rounded-3xl border border-playBlueLight/20 bg-playGrey p-6 md:p-10">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-playBlueDark">{content.title}</h2>
        <p className="mt-3 text-playBlueLight max-w-3xl">{content.subtitle}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-2xl border border-playBlueLight/20 bg-white p-6 md:p-8">
          {!showResult && (
            <>
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm text-playBlueLight">
                  <span>{buildProgressText(content.progress, stepIndex + 1, steps.length)}</span>
                  <span>{stepLabels[currentStep]}</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-playBlueLight/15">
                  <div
                    className="h-2 rounded-full bg-playOrange transition-all"
                    style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
                  />
                </div>
              </div>

              {renderCurrentStep()}

              {error && (
                <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </p>
              )}
            </>
          )}

          {showResult && (
            <div className="flex flex-col items-center text-center space-y-4 py-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-playGreen/10">
                <CheckCircle2 className="h-8 w-8 text-playGreen" />
              </div>
              <h3 className="text-2xl font-bold text-playBlueDark">{content.confirmationTitle}</h3>
              <p className="text-playBlueLight max-w-sm">{content.confirmationMessage}</p>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {(stepIndex > 0 || showResult) && (
              <button
                type="button"
                onClick={goBack}
                className="rounded-full border border-playBlueLight/30 px-5 py-2.5 font-semibold text-playBlueDark transition-colors hover:border-playBlueDark/40"
              >
                {showResult ? content.buttons.edit : content.buttons.back}
              </button>
            )}

            {!showResult && (
              <button
                type="button"
                onClick={goNext}
                className="inline-flex items-center gap-2 rounded-full bg-playBlueDark px-6 py-2.5 font-semibold text-white transition-colors hover:bg-playBlueLight"
              >
                {stepIndex === steps.length - 1
                  ? content.buttons.seeResult
                  : content.buttons.next}
                <ArrowRight className="h-4 w-4" />
              </button>
            )}

            <button
              type="button"
              onClick={resetWizard}
              className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-playBlueLight hover:text-playBlueDark"
            >
              <RotateCcw className="h-4 w-4" />
              {content.resetCta}
            </button>
          </div>
        </div>

        <aside className="rounded-2xl border border-playBlueLight/20 bg-white p-6">
          <h3 className="text-lg font-semibold text-playBlueDark">{content.summaryTitle}</h3>
          <div className="mt-5 space-y-4">
            {summaryItems.map((item) => (
              <div
                key={item.label}
                className="flex items-start justify-between gap-3 border-b border-playBlueLight/10 pb-3"
              >
                <span className="text-sm text-playBlueLight">{item.label}</span>
                <span className="text-sm font-semibold text-playBlueDark text-right">
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          {showResult && (
            <div className="mt-6 space-y-3">
              <Link
                href="/contacto"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-playOrange px-5 py-3 font-semibold text-white transition-colors hover:bg-playOrange/90"
              >
                {content.contactCta}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/register"
                className="inline-flex w-full items-center justify-center rounded-full border border-playBlueLight/30 px-5 py-3 font-semibold text-playBlueDark transition-colors hover:border-playBlueLight/60"
              >
                {content.trialCta}
              </Link>
            </div>
          )}

          <p className="mt-6 text-xs text-playBlueLight">{content.disclaimer}</p>
        </aside>
      </div>
    </div>
  );
}
