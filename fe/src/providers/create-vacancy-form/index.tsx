'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { UseFormReturn, useForm } from 'react-hook-form';
import { IVacancy, vacancySchema } from '@web/shared/const/validations';
import { SkillModel } from '@web/shared/types/models/skills.model';
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { CategoryModel } from '@web/shared/types/models/category.model';
import { BenefitModel } from '@web/shared/types/models/vacancy.model';
import { LanguageModel } from '@web/shared/types/models/language.model';
import { CitizenshipModel } from '@web/shared/types/models/citizenship.model';
import { CityModel } from '@web/shared/types/models/city.model';
import { useBackend } from '@web/shared/lib/hooks/useBackend';
import { BackendAPI } from '@web/shared/services/BackendAPI';
import { Session } from 'next-auth';
import { stepsFields } from './lib/const';
import { ContactsModel } from '@web/shared/types/models/contacts.model';
import useStorage from '@web/shared/lib/hooks/useStorage';
import { EAppStorageKeys } from '@web/shared/types/enums/common';
import { Currency } from '@web/shared/types/enums/resume-vacancy';
import { VacancyFormSlice } from '@web/shared/types/types';

export const createVacancySteps = ['info', 'contacts', 'settings'] as const;
export type CreateVacancyStep = (typeof createVacancySteps)[number];

export type BackendInfo = {
  skills: SkillModel[];
  categories: CategoryModel[];
  benefits: BenefitModel[];
  languages: LanguageModel[];
  citezenships: CitizenshipModel[];
  cities: CityModel[];
  contacts: ContactsModel[];
};

export type VacancyFormContextData = {
  form: UseFormReturn<IVacancy, any, undefined>;
  currentStep: number;
  maxStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  api: BackendAPI;
  session: Session | null;
  onNext: () => void;
  hasCurrentStepErrors: boolean;
  loadState: (stateId: string) => Promise<void>;
  slice?: VacancyFormSlice;
  stateId?: string;
  dropFormState: (stateId?: string) => void;
} & BackendInfo;

const VacancyFormContext = createContext<VacancyFormContextData>(
  {} as VacancyFormContextData,
);

export const CreateVacancyFormProvider = ({
  children,
  ...backendInfo
}: BackendInfo & { children: React.ReactNode }) => {
  const [slice, setSlice] = useState<VacancyFormSlice>();
  const [stateId, setStateId] = useState<string>();
  const [currentStep, setCurrentStep] = useState(0);
  const [hasCurrentStepErrors, setHasCurrentStepErrors] = useState(false);
  const mutableState = useRef<{
    maxStep: number;
    stateId?: string;
    currentStep: number;
  }>({
    maxStep: 0,
    currentStep: 0,
  });
  const storage = useStorage();
  const { api, data } = useBackend();
  const methods = useForm<IVacancy>({
    resolver: zodResolver(vacancySchema),
    shouldUnregister: false,
    defaultValues: {
      salaryCurrency: Currency.RUB,
      languages: [],
    },
  });

  useEffect(() => {
    mutableState.current.maxStep = Math.max(
      currentStep,
      mutableState.current.maxStep,
    );
    mutableState.current.stateId = stateId;
    mutableState.current.currentStep = currentStep;
  }, [currentStep, stateId]);

  const onSubmitTotal = methods.handleSubmit((data) => {
    console.log(data, 'data');
    // TODO: на успех дропнуть текущий стейт если есть stateId && dropFormState(stateId)
  });

  const goNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const onNext = methods.handleSubmit(goNext, (errors) => {
    const _hasCurrentStepErrors = stepsFields[currentStep]?.some(
      (fieldName) => errors[fieldName as keyof typeof errors],
    );
    if (!_hasCurrentStepErrors) {
      const nextStep = stepsFields[currentStep + 1];
      nextStep ? goNext() : onSubmitTotal();
    } else {
      console.log('errors on step', errors);
    }
    setHasCurrentStepErrors(_hasCurrentStepErrors);
  });

  const saveFormState = async () => {
    const _stateId = mutableState.current.stateId || String(Date.now());
    const _prevSlice = await storage.getItem<VacancyFormSlice>(
      EAppStorageKeys.VacancyFormState,
    );
    const newSlice = await storage.setItem<VacancyFormSlice>(
      EAppStorageKeys.VacancyFormState,
      {
        states: {
          ..._prevSlice?.states,
          [_stateId]: {
            currentStep: mutableState.current.currentStep,
            maxStep: mutableState.current.maxStep,
            form: methods.getValues(),
          },
        },
      },
    );
    setStateId(_stateId);
    newSlice && setSlice(newSlice);
  };

  const dropFormState = async (stateId?: string) => {
    let _newSlice: VacancyFormSlice | undefined = { states: {} };

    if (stateId) {
      const _prevSlice = await storage.getItem<VacancyFormSlice>(
        EAppStorageKeys.VacancyFormState,
      );
      delete _prevSlice?.states[stateId];
      _newSlice = _prevSlice || undefined;
    }

    if (_newSlice) {
      await storage.setItem<VacancyFormSlice>(
        EAppStorageKeys.VacancyFormState,
        _newSlice,
      );
      setSlice(_newSlice);
    }
  };

  const loadState = async (stateId: string) => {
    const currentState = slice?.states[stateId];

    if (currentState) {
      setStateId(stateId);
      setCurrentStep(currentState.currentStep);
      mutableState.current.maxStep = currentState.maxStep;
      methods.reset({ ...currentState.form }, { keepDirtyValues: true });
    }
  };

  useEffect(() => {
    storage
      .getItem<VacancyFormSlice>(EAppStorageKeys.VacancyFormState)
      .then((slice) => slice && setSlice(slice));
  }, []);

  useEffect(() => {
    if (methods.formState.isDirty) {
      window.addEventListener('beforeunload', saveFormState);
      return () => {
        window.removeEventListener('beforeunload', saveFormState);
        saveFormState();
      };
    }
  }, [Number(methods.formState.isDirty)]);

  return (
    <VacancyFormContext.Provider
      value={{
        form: methods,
        currentStep,
        setCurrentStep,
        api,
        session: data,
        onNext,
        maxStep: mutableState.current.maxStep,
        hasCurrentStepErrors,
        loadState,
        slice,
        stateId,
        dropFormState,
        ...backendInfo,
      }}
    >
      <form onSubmit={onSubmitTotal}>{children}</form>
    </VacancyFormContext.Provider>
  );
};

export const useVacancyForm = () => useContext(VacancyFormContext);
