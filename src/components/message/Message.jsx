import "./message.css";
import { useState } from "react";
import { format } from "timeago.js";

export default function Message({ message, own }) {
  const [user, setUser] = useState(null);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img
          className={own ? "messageImg own" : "messageImg"}
          src={
            user?.profilePicture
              ? PF + user.profilePicture
              : PF + "person/noAvatar.png"
          }
          alt=""
        />
        <p className="messageText">{message.text}</p>
        {/* <p className="messageText">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas, voluptate vero est ipsum exercitationem, illo doloremque ut porro consequatur nemo iure necessitatibus enim rerum a magnam, quos ducimus dignissimos aliquam?</p> */}
      </div>
      <div className="messageBottom">{format(message.createdAt)}</div>
      {/* <div className="messageBottom">2 month ago</div> */}
    </div>
  );
}