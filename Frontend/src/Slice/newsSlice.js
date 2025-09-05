import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  newses: [], // list of articles
  news: {},   // single article details
};

const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {
    setNewses: (state, action) => {
      state.newses = action.payload; // ✅ correct key
    },
    setNews: (state, action) => {
      state.news = action.payload; // ✅ correct key
    },
  },
});

export const { setNewses, setNews } = newsSlice.actions;
export default newsSlice.reducer;
