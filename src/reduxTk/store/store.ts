import { combineReducers, configureStore } from "@reduxjs/toolkit";
import PersonSlice from "../personSlice";
import { useDispatch } from "react-redux";

export const KEY = "PERSIST_KEY";

const reducers = combineReducers({
  person: PersonSlice,
});

const loadState = () => {
  try {
    const serializedState = localStorage.getItem(KEY);
    if (!serializedState) return undefined;
    return JSON.parse(serializedState);
  } catch (e) {
    return undefined;
  }
};

const store = configureStore({
    devTools: true,
    reducer: reducers,
    preloadedState:loadState()
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = ()=>  useDispatch<AppDispatch>()

export default store;
