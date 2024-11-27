import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { Provider } from 'react-redux'
import { store } from './redux/store.ts'

import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <HelmetProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </HelmetProvider>
  </Provider>,
)
