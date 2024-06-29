import { getCurrentUser } from "@/services/authService";
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
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();

        setIsLogged(true);
        setUserInfo(user);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
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
