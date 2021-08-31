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
import MySpots from "./components/MySpots";
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
          <Route component={Home} path='/' exact/>
          <PrivateRoute component={AddSpot} path='/add-spot' />
          <Route component={FindSpot} path='/find-spot' />
          <PrivateRoute component={Profile} path='/profile' />
          <PrivateRoute component={UpdateProfile} path='/update-profile' />
          <PrivateRoute component={MySpots} path='/my-spots' />
          <Route component={Signup} path='/signup' />
          <Route component={Login} path='/login' />
          <Route component={ForgotPassword} path='/forgot-password' />
        </Switch>
      </BrowserRouter>
      </AuthProvider>
  </>
  );
}