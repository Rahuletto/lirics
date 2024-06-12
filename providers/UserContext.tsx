import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import useInterval from "@/lib/useInterval";

const UserContext = createContext<boolean>(false);

export function usePremium() {
  return useContext(UserContext);
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [premium, setPremium] = useState(false);

  useEffect(() => {
    fetch(`/api/spotify/status`)
      .then((res) => res.json())
      .then((d: { premium: boolean }) => {
        setPremium(d.premium);
      })
      .catch((a) => {
        console.warn(a);
      });
  }, []);

  return (
    <UserContext.Provider value={premium}>{children}</UserContext.Provider>
  );
}
