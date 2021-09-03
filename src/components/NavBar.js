import {React, useState, useEffect} from "react";
import { NavLink } from "react-router-dom";
import './NavBar.css';
import { useAuth } from '../contexts/AuthContext';

export default function NavBar() {
  const {currentUser} = useAuth();
  const [currentUserName, setCurrentUserName] = useState();

  useEffect(() => {
    if (currentUser !== null) {
      setCurrentUserName(currentUser.displayName);
    }
  }, [])

  return (
    <header className="navbar">
      <div className="container mx-auto flex navbar-content">
        <div className="container mx-auto flex justify-between">
            <div className="inline-flex py-3 px-3 my-6">
                <NavLink
                    to="/"
                    exact
                    activeClassName="text-black"
                    className="site-title"
                >
                    SpotTracker
                </NavLink>
            </div>
            <nav className="middle">
                <NavLink
                    to="/add-spot"
                    activeClassName="text-blue-100 bg-blue-700"
                    className="navlink-title"
                >
                    Add a Spot
                </NavLink>
                <NavLink
                    to="/find-spot"
                    activeClassName="text-blue-100 bg-blue-700"
                    className="navlink-title"
                >
                    Find a Spot
                </NavLink>
            </nav>
        <div className="inline-flex py-3 px-3 my-6">
        {!currentUser &&
          <NavLink
            to="/login"
            activeClassName="text-blue-100 bg-blue-700"
            className="navlink-title"
          >
            Sign In
          </NavLink>
        }
        {currentUser &&
          <NavLink
            to="/profile"
            activeClassName="text-blue-100 bg-blue-700"
            className="navlink-title"
          >
            <img className="pfp" src={`/pfps/${currentUser.email + ".jpg"}`} alt="" onError={(event) => event.target.src = 'https://i.ibb.co/zHrQvyf/default.jpg'}/>
            <span className="username">{currentUserName}</span>
          </NavLink>
        }
        </div>
      </div>
    </div>
    </header>
  );
}
