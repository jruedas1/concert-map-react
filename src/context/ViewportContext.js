import { createContext, useState, useEffect } from "react";

const ViewportContext = createContext();

function Provider({ children }) {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        function handleResize() {
            const mobile = window.innerWidth < 768;
            setIsMobile(prev => {
                if (prev !== mobile) return mobile;
                return prev;
                });
        }
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <ViewportContext.Provider value={{ isMobile }}>
            {children}
        </ViewportContext.Provider>
    );
}

export { Provider }
export default ViewportContext;
