import { Provider as ViewportProvider } from "./ViewportContext";
import { Provider as ConcertsProvider } from './ConcertsContext.js';
import { Provider as GenresProvider } from './GenresContext.js';
import { Provider as AnimationProvider } from './AnimationContext.js';

function AppProvider({ children }) {
    return (
        <ViewportProvider>
            <ConcertsProvider>
                <GenresProvider>
                    <AnimationProvider>
                        {children}
                    </AnimationProvider>
                </GenresProvider>
            </ConcertsProvider>
        </ViewportProvider>
    );
}

export default AppProvider;