import "./topbar.css";
import { Search, Person, Chat, Notifications, ExitToApp } from "@material-ui/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { loginCall } from "../../apiCalls";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
}

const Topbar = () => {
  const { user } = useContext(AuthContext);
  const query = useQuery();
  const navigate = useNavigate();
  const searchQuery = query.get("searchQuery");
  const [search, setSearch] = useState("");
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { dispatch } = useContext(AuthContext);

  const searchUser = () => {
    
  };

  const handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      searchUser();
    }
  };

  const logout = (e) => {
    e.preventDefault();
    window.location.reload();
    localStorage.clear()

    navigate('/login');
  }

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">
            <img src={`${PF}white-icon.png`} alt="logo" className="topbarLogo" />
          </span>
        </Link>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <Search className="searchIcon" />
          <input
            placeholder="Search for friends, posts, images or videos"
            className="searchInput"
            onKeyDown={handleKeyPress}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {/* <button onClick={searchUser} className="searchButton" variant="contained" color="primary">Search</button> */}
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarLinks">
          <span className="topbarLink">Home</span>
          <span className="topbarLink">Timeline</span>
        </div>
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <Person />
            <span className="topbarIconBadge">1</span>
          </div>
          <div className="topbarIconItem">
            <Link to={"/messenger"} className="messengerButton">
              <Chat />
            </Link>
            {/* <span className="topbarIconBadge">2</span> */}
          </div>
          <div className="topbarIconItem">
            <Notifications />
            <span className="topbarIconBadge">1</span>
          </div>
        </div>
        <Link to={`/profile/${user.username}`}>
          <img
            src={
              user.profilePicture
                ? PF + user.profilePicture
                : PF + "person/noAvatar.png"
            }
            alt="avatar"
            className="topbarImg"
          />
        </Link>
        <button
          type="button"
          className="topbarLogout"
          onClick={logout}
        >
          <ExitToApp />
        </button>
      </div>
    </div>
  );
}

export default Topbar
