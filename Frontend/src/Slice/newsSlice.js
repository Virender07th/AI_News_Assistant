import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  newses: [], // list of articles
  latestNews :0,
  video:0,
  allNews:0,
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
    setLatestNews: (state, action) => {
      state.latestNews = action.payload; // ✅ correct key
    },
    setAllNews: (state, action) => {
      state.allNews = action.payload; // ✅ correct key
    },
    setVideo: (state, action) => {
      state.video = action.payload; // ✅ correct key
    },
  },
});

export const { setNewses, setNews  , setAllNews , setLatestNews , setVideo } = newsSlice.actions;
export default newsSlice.reducer;
