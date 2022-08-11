import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./online.css";

export default function Online({ onlineUsers, currentId }) {
  const [friends, setFriends] = useState([]);
  // const [onlineFriends, setOnlineFriends] = useState([]);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    const getFriends = async () => {
      try {
        const friendList = await axios.get("/users/friends/" + currentId);
        setFriends(friendList.data);
      } catch (err) {
        console.log(err);
      }
    };
    getFriends();
  }, [currentId]);

  return (
    <div>
      {friends.map(friend => (
        <Link
          to={"/profile/" + friend.username}
          style={{ textDecoration: "none" }}
        >
          <li className="rightbarFriend">
            <div className="rightbarProfileImgContainer">
              <img
                className="rightbarProfileImg"
                src={
                  friend.profilePicture
                    ? PF + friend.profilePicture
                    : PF + "person/noAvatar.png"
                  }
                alt=""
              />
            </div>
            <span className="rightbarUsername">{friend.username}</span>
            <span className="rightbarOnline"></span>
          </li>
        </Link>
      ))}
    </div>
  );
}
