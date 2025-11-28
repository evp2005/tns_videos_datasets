import { createContext, useState } from "react";

export const VideoContext = createContext();

export function VideoProvider({ children }) {
    const [videoGlobal, setVideoGlobal] = useState(null);

    return (
        <VideoContext.Provider value={{ videoGlobal, setVideoGlobal }}>
            {children}
        </VideoContext.Provider>
    );
}
