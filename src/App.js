import { BrowserRouter, Route, Switch } from "react-router-dom";
import { React } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from "./components/Home";
import Profile from "./components/Profile";
import AddSpot from "./components/AddSpot";
import FindSpot from "./components/FindSpot";
import NavBar from "./components/NavBar";
import Signup from "./components/SignUp";
import Login from "./components/Login";
import UpdateProfile from "./components/UpdateProfile";
import ForgotPassword from "./components/ForgotPassword";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider} from "./contexts/AuthContext";

export default function App() {
  return (
    <>
    <AuthProvider>
      <BrowserRouter>
      <NavBar />
        <Switch>
          <PrivateRoute component={Home} path='/' exact/>
          <PrivateRoute component={AddSpot} path='/add-spot' />
          <PrivateRoute component={FindSpot} path='/find-spot' />
          <PrivateRoute component={Profile} path='/profile' />
          <PrivateRoute component={UpdateProfile} path='/update-profile' />
          <Route component={Signup} path='/signup' />
          <Route component={Login} path='/login' />
          <Route component={ForgotPassword} path='/forgot-password' />
        </Switch>
      </BrowserRouter>
      </AuthProvider>
  </>
  );
}