import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SignupData {
  role: 'student' | 'owner' | '';
  email: string;
  password: string;
  university: string;
  studentCardFile: File | null;
  cinFile: File | null;
  utilityBillFile: File | null;
}

interface SignupContextType {
  data: SignupData;
  setField: (key: keyof SignupData, value: any) => void;
  reset: () => void;
}

const defaultData: SignupData = {
  role: '',
  email: '',
  password: '',
  university: '',
  studentCardFile: null,
  cinFile: null,
  utilityBillFile: null,
};

const SignupContext = createContext<SignupContextType | undefined>(undefined);

export function SignupProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SignupData>(defaultData);

  const setField = (key: keyof SignupData, value: any) =>
    setData(prev => ({ ...prev, [key]: value }));

  const reset = () => setData(defaultData);

  return (
    <SignupContext.Provider value={{ data, setField, reset }}>
      {children}
    </SignupContext.Provider>
  );
}

export function useSignup() {
  const ctx = useContext(SignupContext);
  if (!ctx) throw new Error('useSignup must be used inside SignupProvider');
  return ctx;
}
