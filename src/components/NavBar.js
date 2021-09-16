import {React, useState, useEffect} from "react";
import { NavLink } from "react-router-dom";
import './NavBar.css';
import { useAuth } from '../contexts/AuthContext';
import logo from '../stairs.svg'

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
      <div className="container mx-auto flex navbar-content">
        <div className="container mx-auto flex justify-between">
            <div className="inline-flex py-3 px-3 my-6">
                <NavLink
                    to="/"
                    exact
                    activeClassName="text-black"
                    className="site-title"
                >
                    <img className="logo" alt="" src={logo}/>SpotTracker
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
