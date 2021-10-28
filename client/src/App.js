import { BrowserRouter, Route, Switch } from "react-router-dom";
import { React } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import FootballBets from "./components/FootballBets";
import BasketballBets from "./components/BasketballBets";
import BaseballBets from "./components/BaseballBets";
import BookieHome from "./components/BookieHome";
import Profile from "./components/Profile";
import AddSpot from "./components/AddSpot";
import NavBar from "./components/NavBar";
import Login from "./components/Login";
import UpdateProfile from "./components/UpdateProfile";
import MyBets from "./components/MyBets";
import ForgotPassword from "./components/ForgotPassword";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider} from "./contexts/AuthContext";

export default function App() {

  return (
    <>
    <AuthProvider>
      <BrowserRouter>
      <NavBar/>
        <Switch>
          <PrivateRoute component={FootballBets} path='/football-bets' exact/>
          <PrivateRoute component={BasketballBets} path='/basketball-bets' exact/>
          <PrivateRoute component={BaseballBets} path='/baseball-bets' exact/>
          <PrivateRoute component={BookieHome} path='/bookie-home' exact/>
          <PrivateRoute component={AddSpot} path='/add-spot' />
          <PrivateRoute component={Profile} path='/profile' />
          <PrivateRoute component={UpdateProfile} path='/update-profile' />
          <PrivateRoute component={MyBets} path='/my-bets' />
          <Route component={Login} path='/login' />
          <Route component={ForgotPassword} path='/forgot-password' />
        </Switch>
      </BrowserRouter>
      </AuthProvider>
  </>
  );
}