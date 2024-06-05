import { getCurrentAccount, getCurrentUser } from "@/lib/appwrite";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface GlobalProviderProps {
  children: ReactNode;
}

interface GlobalContextParams {
  setIsLogged: Dispatch<SetStateAction<boolean>>;
  isLogged: boolean;
  isLoading: boolean;
  userInfo: any;
  setUserInfo: Dispatch<SetStateAction<any>>;
}

const GlobalContext = createContext({} as GlobalContextParams);
export const useGlobalContext = () =>
  useContext<GlobalContextParams>(GlobalContext);

export const GlobalProvider = ({ children }: GlobalProviderProps) => {
  const [isLogged, setIsLogged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res) {
          setIsLogged(true);
          setUserInfo(res);
        } else {
          setIsLogged(false);
          setUserInfo(null);
        }
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        setIsLogged,
        isLoading,
        userInfo,
        setUserInfo,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
