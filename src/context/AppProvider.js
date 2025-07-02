import { Provider as ConcertsProvider } from './ConcertsContext.js';
import { Provider as GenresProvider } from './GenresContext.js';
import { Provider as AnimationProvider } from './AnimationContext.js';

function AppProvider({ children }) {
    return (
        <ConcertsProvider>
            <GenresProvider>
                <AnimationProvider>
                    {children}
                </AnimationProvider>
            </GenresProvider>
        </ConcertsProvider>
    );
}

export default AppProvider;