import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import "./i18n.ts"
import store, { KEY }  from './reduxTk/store/store.ts'
import { Provider } from 'react-redux'

store.subscribe(()=>{
  //save to local storage
 localStorage.setItem(KEY,JSON.stringify(store.getState())); // get value
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)
