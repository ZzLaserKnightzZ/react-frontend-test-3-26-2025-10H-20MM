import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store/store";
import { TGender, TNationlity } from "../Pages/FormPage";
export interface IPerson {
  id: string;
  isSelected: boolean;
  isShowing: boolean;

  prefix: string;
  name: string;
  lasName: string;
  dateOfbirth: string;
  nationality?: TNationlity;
  identityCard: string;
  gender?: TGender;
  prefexCellPhone: string;
  cellPhone: string;
  passPort: string;
  saralyExpect: string;
}

interface Personstate {
  currPage: number;
  editePerson: null | IPerson;
  persons: IPerson[];
}
export const MAX_PERSON_PERPAGE = 10;

const initialState: Personstate = {
  currPage: 1,
  persons: [],
  editePerson: null,
};

export const PersonSlice = createSlice({
  name: "person",
  initialState,
  reducers: {
    prev: (state, _: PayloadAction<undefined>) => {
      const minPage = 1;
      state.currPage = state.currPage - 1;
      if (state.currPage <= minPage) {
        state.currPage = minPage;
      }
      //set pagination
      const start = (state.currPage - 1) * MAX_PERSON_PERPAGE;
      const stop = start + MAX_PERSON_PERPAGE;
      state.persons = state.persons.map((p, i) => {
        if (i >= start && i + 1 <= stop) {
          p.isShowing = true;
        } else {
          p.isShowing = false;
        }
        return p;
      });
    },
    next: (state, _: PayloadAction<undefined>) => {
      const maxPage = Math.ceil(state.persons.length / MAX_PERSON_PERPAGE);
      state.currPage = state.currPage + 1;
      if (state.currPage >= maxPage) {
        state.currPage = maxPage;
      }
      //set pagination
      const start = (state.currPage - 1) * MAX_PERSON_PERPAGE;
      const stop = start + MAX_PERSON_PERPAGE;
      state.persons = state.persons.map((p, i) => {
        if (i >= start && i + 1 <= stop) {
          p.isShowing = true;
        } else {
          p.isShowing = false;
        }
        return p;
      });
    },
    seedData: (state, action: PayloadAction<IPerson[]>) => {
      state.persons = action.payload;
      state.currPage = 1;
    },
    selectEditPerson: (state, action: PayloadAction<IPerson>) => {
      state.editePerson = action.payload;
    },
    addPerson: (state, action: PayloadAction<IPerson>) => {
      state.persons.push(action.payload);
      state.editePerson = null;
    },
    deletePerson: (state, action: PayloadAction<{ id: string }>) => {
      state.persons = state.persons.filter((x) => x.id !== action.payload.id);
    },
    editPerson: (state, action: PayloadAction<IPerson>) => {
      const id = action.payload.id;
      const person = state.persons.find((x) => x.id === id);

      //assign value
      if (person) {
        const newPersonValue = action.payload;
        //update
        state.persons = state.persons.map((x) =>
          x.id === id ? { ...newPersonValue } : { ...x }
        );
      }
    },
    selectPerson: (state, action: PayloadAction<{ id: string }>) => {
      state.persons = state.persons.map((x) =>
        x.id === action.payload.id
          ? { ...x, isSelected: !x.isSelected }
          : { ...x, isSelected: x.isSelected }
      );
    },
    selectAllPerson: (state, action: PayloadAction<{ isSelect: boolean }>) => {
      if (action.payload.isSelect) {
        state.persons = state.persons.map((x) => {
          if (x.isShowing) x.isSelected = true;
          return x;
        });
      } else {
        state.persons = state.persons.map((x) => {
          x.isSelected = false;
          return x;
        });
      }
    },
    pagination: (state, action: PayloadAction<{ page: number }>) => {
      const start = (action.payload.page - 1) * MAX_PERSON_PERPAGE;
      const stop = start + MAX_PERSON_PERPAGE;
      state.currPage = action.payload.page;
      state.persons = state.persons.map((p, i) => {
        if (i >= start && i + 1 <= stop) {
          p.isShowing = true;
        } else {
          p.isShowing = false;
        }
        return p;
      });
    },
    deleteSelectedPerson: (state, _) => {
      state.persons = state.persons.filter((x) => x.isSelected !== true);
      state.persons = state.persons.map((p) => {
        p.isShowing = true;
        return p;
      });
    },
    sortByName: (state, action: PayloadAction<{ upDown: boolean }>) => {
      //select inex
      const isShowingPersons = state.persons.filter(
        (x) => x.isShowing === true
      );

      if (isShowingPersons.length === 0) return;

      const startIndex = state.persons.findIndex(
        (x) => x.id === isShowingPersons[0].id
      );

      const stopIndex = state.persons.findIndex(
        (x) => x.id === isShowingPersons[isShowingPersons.length - 1].id
      );

      if (action.payload.upDown) {
        //sort
        isShowingPersons.sort((a, b) => {
          const nameA = a.name.toUpperCase();
          const nameB = b.name.toUpperCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
      } else {
        //sort
        isShowingPersons.sort((a, b) => {
          const nameA = a.name.toUpperCase();
          const nameB = b.name.toUpperCase();
          if (nameA < nameB) {
            return 1;
          }
          if (nameA > nameB) {
            return -1;
          }
          return 0;
        });
      }

      let index = 0;
      state.persons = state.persons.map((x, i) => {
        if (i >= startIndex && i <= stopIndex) {
          return { ...isShowingPersons[index++] };
        } else {
          return { ...x };
        }
      });
    },
    sortByGender: (state, action: PayloadAction<{ upDown: boolean }>) => {
      //select inex
      const isShowingPersons = state.persons.filter(
        (x) => x.isShowing === true
      );

      if (isShowingPersons.length === 0) return;

      const startIndex = state.persons.findIndex(
        (x) => x.id === isShowingPersons[0].id
      );

      const stopIndex = state.persons.findIndex(
        (x) => x.id === isShowingPersons[isShowingPersons.length - 1].id
      );

      if (action.payload.upDown) {
        //sort
        isShowingPersons.sort((a, b) => {
          const A = a?.gender?.id;
          const B = b?.gender?.id;
          if (A && B) {
            if (A < B) {
              return 1;
            }
            if (A > B) {
              return -1;
            }
          }

          return 0;
        });
      } else {
        //sort
        isShowingPersons.sort((a, b) => {
          const A = a?.gender?.id;
          const B = b?.gender?.id;
          if (A && B) {
            if (A < B) {
              return -1;
            }
            if (A > B) {
              return 1;
            }
          }
          return 0;
        });
      }
      let index = 0;

      state.persons = state.persons.map((x, i) => {
        if (i >= startIndex && i <= stopIndex) {
          return { ...isShowingPersons[index++] };
        } else {
          return { ...x };
        }
      });
    },
    sortByPhoneNumber: (state, action: PayloadAction<{ upDown: boolean }>) => {
      //select inex
      const isShowingPersons = state.persons.filter(
        (x) => x.isShowing === true
      );

      if (isShowingPersons.length === 0) return;

      const startIndex = state.persons.findIndex(
        (x) => x.id === isShowingPersons[0].id
      );

      const stopIndex = state.persons.findIndex(
        (x) => x.id === isShowingPersons[isShowingPersons.length - 1].id
      );

      if (action.payload.upDown) {
        //sort
        isShowingPersons.sort((a, b) => {
          const A = a.cellPhone.toUpperCase();
          const B = b.cellPhone.toUpperCase();
          if (A < B) {
            return 1;
          }
          if (A > B) {
            return -1;
          }
          return 0;
        });
      } else {
        //sort
        isShowingPersons.sort((a, b) => {
          const A = a.cellPhone.toUpperCase();
          const B = b.cellPhone.toUpperCase();
          if (A < B) {
            return -1;
          }
          if (A > B) {
            return 1;
          }
          return 0;
        });
      }
      let index = 0;

      state.persons = state.persons.map((x, i) => {
        if (i >= startIndex && i <= stopIndex) {
          return { ...isShowingPersons[index++] };
        } else {
          return { ...x };
        }
      });
    },
    sortByNationality: (state, action: PayloadAction<{ upDown: boolean }>) => {
      //select inex
      const isShowingPersons = state.persons.filter(
        (x) => x.isShowing === true
      );

      if (isShowingPersons.length === 0) return;

      const startIndex = state.persons.findIndex(
        (x) => x.id === isShowingPersons[0].id
      );

      const stopIndex = state.persons.findIndex(
        (x) => x.id === isShowingPersons[isShowingPersons.length - 1].id
      );

      if (action.payload.upDown) {
        //sort
        isShowingPersons.sort((a, b) => {
          const A = a?.nationality?.id;
          const B = b?.nationality?.id;
          if (A && B) {
            if (A < B) {
              return 1;
            }
            if (A > B) {
              return -1;
            }
          }
          return 0;
        });
      } else {
        //sort
        isShowingPersons.sort((a, b) => {
          const A = a?.nationality?.id;
          const B = b?.nationality?.id;
          if (A && B) {
            if (A < B) {
              return -1;
            }
            if (A > B) {
              return 1;
            }
          }
          return 0;
        });
      }
      let index = 0;

      state.persons = state.persons.map((x, i) => {
        if (i >= startIndex && i <= stopIndex) {
          return { ...isShowingPersons[index++] };
        } else {
          return { ...x };
        }
      });
    },
  },
});

export const {
  next,
  prev,
  seedData,
  selectEditPerson,
  addPerson,
  selectPerson,
  selectAllPerson,
  deletePerson,
  editPerson,
  deleteSelectedPerson,
  sortByName,
  sortByGender,
  sortByNationality,
  sortByPhoneNumber,
  pagination,
} = PersonSlice.actions;

export const personSelecter = (store: RootState) => store.person.persons;
export const currPageSelecter = (store: RootState) => store.person.currPage;
export const editpersonSelecter = (store: RootState) =>
  store.person.editePerson;

export default PersonSlice.reducer;
