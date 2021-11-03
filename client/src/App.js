import { BrowserRouter, Route, Switch } from "react-router-dom";
import { React } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import FootballBets from "./components/FootballBets";
import BasketballBets from "./components/BasketballBets";
import BaseballBets from "./components/BaseballBets";
import BookieActiveBets from "./components/BookieActiveBets";
import BookieWeekBets from "./components/BookieWeekBets";
import BookieAllBets from "./components/BookieAllBets";
import Profile from "./components/Profile";
import AddSpot from "./components/AddSpot";
import NavBar from "./components/NavBar";
import Login from "./components/Login";
import UpdateProfile from "./components/UpdateProfile";
import MyBets from "./components/MyBets";
import ForgotPassword from "./components/ForgotPassword";
import PrivateRoute from "./components/PrivateRoute";
import BookieRoute from "./components/BookieRoute";
import ClientRoute from "./components/ClientRoute";
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
          <PrivateRoute component={BookieActiveBets} path='/bookie-active-bets' exact/>
          <PrivateRoute component={BookieWeekBets} path='/bookie-week-bets' exact/>
          <PrivateRoute component={BookieAllBets} path='/bookie-all-bets' exact/>
          <PrivateRoute component={AddSpot} path='/add-spot' />
          <PrivateRoute component={Profile} path='/profile' />
          <PrivateRoute component={UpdateProfile} path='/update-profile' />
          <ClientRoute component={MyBets} path='/my-bets' />
          <Route component={Login} path='/login' />
          <Route component={ForgotPassword} path='/forgot-password' />
        </Switch>
      </BrowserRouter>
      </AuthProvider>
  </>
  );
}