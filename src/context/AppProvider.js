import { Provider as ConcertsProvider } from './ConcertsContext.js';
import { Provider as GenresProvider } from './GenresContext.js';

function AppProvider({ children }) {
    return (
        <ConcertsProvider>
            <GenresProvider>
                {children}
            </GenresProvider>
        </ConcertsProvider>
    );
}

export default AppProvider;