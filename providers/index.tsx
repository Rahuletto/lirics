import { ReactNode } from "react";
import { LyricsProvider } from "./LyricsContext";
import { SongProvider } from "./SongContext";
import { UserProvider } from "./UserContext";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <UserProvider>
      <SongProvider>
        <LyricsProvider>{children}</LyricsProvider>
      </SongProvider>
    </UserProvider>
  );
}
