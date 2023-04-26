"use client";
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  phone: string;
}

interface State {
  loading: boolean;
  error: string | null;
  data: User | null;
}

interface AuthState extends State {
  setAuthState: React.Dispatch<React.SetStateAction<State>>;
}

export const AuthenticaiontContext = createContext<AuthState>({
  loading: false,
  error: null,
  data: null,
  setAuthState: () => {},
});

export default function AuthContext({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authState, setAuthState] = useState<State>({
    loading: true,
    data: null,
    error: null,
  });

  const fetchUser = async () => {
    setAuthState({ data: null, loading: true, error: null });
    try {
      const jwt = getCookie("jwt");
      if (!jwt) {
        return setAuthState({ data: null, loading: false, error: null });
      }
      const response = await axios.get(`/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;

      setAuthState({ data: response.data, loading: false, error: null });
    } catch (error: any) {
      setAuthState({
        data: null,
        loading: false,
        error: error.response.data.errorMessage,
      });
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthenticaiontContext.Provider value={{ ...authState, setAuthState }}>
      {children}
    </AuthenticaiontContext.Provider>
  );
}
