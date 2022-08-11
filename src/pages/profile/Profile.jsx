import "./profile.css";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import { useRef, useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { CheckCircle } from "@material-ui/icons";
import { AuthContext } from "../../context/AuthContext";

export default function Profile() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState({});
  const username = useParams().username;
  const [file, setFile] = useState(null);
  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?username=${username}`);
      setUser(res.data);
    };
    fetchUser();
  }, [username]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const newAvatar = {
      userId: user._id,
    };
    if (file) {
      const data = new FormData();
      const fileName = Date.now() + file.name; //add timestamp to filename to handle naming conflict
      data.append("name", fileName);
      data.append("file", file);
      newAvatar.profilePicture = fileName;
      console.log(newAvatar);
      try {
        await axios.post("/upload", data);
      } catch (err) {
        console.log(err)
      }
    }
    try {
      await axios.put(`/users/${user._id}`, newAvatar);
      window.location.reload();
    } catch (err) {
      console.log(err)
    }
  };

  return (
    <>
      <Topbar />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                className="profileCoverImg"
                src={
                  user.coverPicture
                    ? PF + user.coverPicture
                    : PF + "cover/noCover.png"
                }
                alt="cover"
              />
              <form className="changeAvatar" onSubmit={submitHandler}>
                <label htmlFor="file" className="shareOption">
                  {file ? (
                    <div>
                      <img className="profileUserImg" src={URL.createObjectURL(file)} alt="" />
                      {(!username || username === currentUser.username) && (
                        <button type="submit" className="avatarUpdateBtn" >
                          <CheckCircle />
                        </button>
                      )}
                    </div>
                  ) : (
                    <img
                      className="profileUserImg"
                      src={
                        user.profilePicture
                          ? PF + user.profilePicture
                          : PF + "person/noAvatar.png"
                      }
                      alt="avatar"
                    />
                  )}
                  <input
                    style={{ display: "none" }}
                    type="file"
                    id="file"
                    accept=".png,.jpeg,.jpg"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                </label>
              </form>
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">{user.username}</h4>
              <span className="profileInfoDesc">{user.desc}</span>
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed username={username} />
            <Rightbar user={user} />
          </div>
        </div>
      </div>
    </>
  );
}
