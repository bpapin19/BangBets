import React from "react";
import { NavLink } from "react-router-dom";
import './NavBar.css';
import { useAuth } from '../contexts/AuthContext';

export default function NavBar() {
  const {currentUser} = useAuth();

  function getUsername(email) {
    return email.slice(0, email.indexOf("@"));
  }

  return (
    <header className="navbar">
      <div className="container mx-auto flex">
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
            <nav className="flex">
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
            to="/signup"
            activeClassName="text-blue-100 bg-blue-700"
            className="navlink-title"
          >
            Sign In / Sign Up
          </NavLink>
        }
        {currentUser &&
          <NavLink
            to="/profile"
            activeClassName="text-blue-100 bg-blue-700"
            className="navlink-title"
          >
            {getUsername(currentUser.email)}
          </NavLink>
        }
        </div>
      </div>
    </div>
    </header>
  );
}
