import './App.css';
import React, { Fragment } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import store, { persistor } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import Canvas from './canvas/canvas';
import Login from './login/login';
import ProtectedRoute from "./routes/ProtectedRoute";
import Dashboard from './dashboard/dashboard';


function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <BrowserRouter>
          <Fragment>
            <Routes>
              <Route exact path="/login" element={<Login />} />
              <Route exact path="/" element={<ProtectedRoute />}>
                <Route exact path="/" element={<Dashboard />} />
              </Route>
              <Route exact path="/" element={<ProtectedRoute />}>
                <Route exact path="/">
                  <Route path=":id">
                    <Route path=":id" element={<Canvas />}></Route>
                  </Route>
                </Route>
              </Route>
            </Routes>
          </Fragment>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

// function App() {
//   return (    
//     <div className="App">
//         <Login></Login>
//         <Canvas/>
//     </div>
//   );
// }

export default App;
