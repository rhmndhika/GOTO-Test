import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Contact {
  id: number;
  first_name: string;
  last_name: string;
  phones: { number: string }[];
}

interface FavoriteState {
  favoriteContacts: Contact[];
}

const initialState: FavoriteState = {
  favoriteContacts: [],
};

const favoriteSlice = createSlice({
  name: "favorite",
  initialState,
  reducers: {
    addToFavorite: (state, action: PayloadAction<Contact>) => {
      const newContact = action.payload;
      if (!state.favoriteContacts.some((contact: any) => contact.id === newContact.id)) {
        state.favoriteContacts.push(newContact);
      }
    },
    removeFromFavorite: (state, action: PayloadAction<number>) => {
      const index = state.favoriteContacts.findIndex((item: any) => item.id === action.payload);
      if (index !== -1) {
        state.favoriteContacts.splice(index, 1);
      }
    }
  },
});

export const { addToFavorite, removeFromFavorite } = favoriteSlice.actions;

export default favoriteSlice.reducer;