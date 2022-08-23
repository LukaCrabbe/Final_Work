import { createSlice} from "@reduxjs/toolkit";

// type State = {
//   token: string | null;
//   refreshToken: string | null;
//   account: AccountResponse | null;
// };

// const initialState: State = { token: null, refreshToken: null, account: null };


const initialState = { token: null, refreshToken: null, account: null };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthTokens(state,action){
      state.refreshToken = action.payload.refreshToken;
      state.token = action.payload.token;
    },
    setAccount(state, action) {
      state.account = action.payload;
    },
    logout(state) {
      state.account = null;
      state.refreshToken = null;
      state.token = null;
    },
  },
});

// const authSlice = createSlice({
//     name: "auth",
//     initialState,
//     reducers: {
//       setAuthTokens(
//         state: State,
//         action: PayloadAction<{ token: string; refreshToken: string }>
//       ) {
//         state.refreshToken = action.payload.refreshToken;
//         state.token = action.payload.token;
//       },
//       setAccount(state: State, action: PayloadAction<AccountResponse>) {
//         state.account = action.payload;
//       },
//       logout(state: State) {
//         state.account = null;
//         state.refreshToken = null;
//         state.token = null;
//       },
//     },
//   });
  

export default authSlice;