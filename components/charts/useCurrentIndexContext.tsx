import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { SharedValue, useSharedValue } from "react-native-reanimated";

interface ContextProps {
  currentIndex: SharedValue<number>;
  currentIndexJS: number;
  setCurrentIndexJS: Dispatch<SetStateAction<number>>;
}

const currentIndexContext = createContext<ContextProps>({} as ContextProps);

export const useCurrentIndexContext = () => useContext(currentIndexContext);

interface ProviderProps {
  children: ReactNode;
}

export const CurrentIndexProvider = ({ children }: ProviderProps) => {
  const [currentIndexJS, setCurrentIndexJS] = useState(0);
  const currentIndex = useSharedValue(currentIndexJS);

  return (
    <currentIndexContext.Provider
      value={{ currentIndex, currentIndexJS, setCurrentIndexJS }}
    >
      {children}
    </currentIndexContext.Provider>
  );
};
