import { useContext, useEffect } from "react";
import { store } from "../store";

export const useUser = () => {
  const { state } = useContext(store);

  const setUser = () => {
    console.log("setUser");
  };

  useEffect(() => {
    console.log("user", state.user);
  }, [state.user, setUser]);
};
