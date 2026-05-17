import { createContext, useContext, useState } from "react";
import { initialProfiles } from "../data/profiles";

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const [profiles, setProfiles] = useState(initialProfiles);

  function addProfile(profile) {
    setProfiles((p) => [...p, profile]);
  }

  return (
    <ProfileContext.Provider value={{ profiles, addProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfiles() {
  return useContext(ProfileContext);
}
