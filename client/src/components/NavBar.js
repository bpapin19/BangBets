import {React, useState, useEffect} from "react";
import { NavLink } from "react-router-dom";
import './NavBar.css';
import { useAuth } from '../contexts/AuthContext';
import logo from '../stairs.svg';

export default function NavBar(props) {

  const {currentUser} = useAuth();
  const [currentUserName, setCurrentUserName] = useState("");
  const [img2, setImg2] = useState({});

  useEffect(() => {
    if (currentUser !== null) {
      setTimeout(() => {
        setCurrentUserName(currentUser.displayName);
      }, 500);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser !== null) {
      setImageLink();
    }
    return () => {
        setImg2({});
    };
}, [props]); // eslint-disable-line react-hooks/exhaustive-deps

  const setImageLink = () => {
    // Easiest solution to wait for AWS to complete upload
    setTimeout(() => {
      setImg2({url: `https://s3-us-west-1.amazonaws.com/spot-tracker-pfps/${currentUser.uid + ".jpg"}`, hash: new Date().getTime()});
    }, 1000);
  }

  return (
    <header className="navbar">
      <div className="container flex navbar-content">
        <div className="container flex">
            {currentUser && currentUser.displayName === "client" && <div>
                <NavLink
                    to="/client-home"
                    exact
                    activeClassName="text-black"
                    className="site-title"
                >
                    <img className="logo" alt="" src={logo}/>BANG BETS
                </NavLink>
            </div>}
            {currentUser && currentUser.displayName === "bookie" && <div>
                <NavLink
                    to="/bookie-home"
                    exact
                    activeClassName="text-black"
                    className="site-title"
                >
                    <img className="logo" alt="" src={logo}/>BANG BETS
                </NavLink>
            </div>}
            {currentUser && currentUser.displayName === "client" && <div>
                <NavLink
                    to="/football-bets"
                    exact
                    activeClassName="text-black"
                    className="site-title"
                >
                    <div>Football</div>
                </NavLink>
            </div>}
        <div className="inline-flex py-3 px-3 my-6">
        {currentUser &&
          <NavLink
            to="/profile"
            activeClassName="text-blue-100 bg-blue-700"
            className="navlink-title"
          >
            <img className="pfp" src={img2.url + '?' + img2.hash} alt="" onError={(event) => event.target.src = 'https://i.ibb.co/zHrQvyf/default.jpg'}/>
            <span className="username">{currentUserName}</span>
          </NavLink>
        }
        </div>
      </div>
    </div>
    </header>
  );
}
