import "./post.css";
import { Delete, Edit, MoreVert } from "@material-ui/icons";
import { useContext, useEffect, useState } from "react";
import Comment from "../comment/Comment";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function Post({ post, socket }) {
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [displayComments, setDisplayComments] = useState(false);
  const [displayPostControl, setDisplayPostControl] = useState(false);
  const [user, setUser] = useState({});
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [currentUser._id, post.likes]);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?userId=${post.userId}`);
      setUser(res.data);
    };
    fetchUser();
  }, [post.userId]);

  const clickComment = () => {
    setDisplayComments(!displayComments);
  }

  const clickBurger = () => {
    setDisplayPostControl(!displayPostControl);
  }

  const likeHandler = async () => {
    try {
      await axios.put("/posts/" + post._id + "/like", { userId: currentUser._id });
    } catch (err) {}
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);

    // socket.emit("sendNotification", {
    //   senderName: user,
    //   receiverName: post.username,
    // });
  };

  const deletePost = async (e) => {
    e.preventDefault();
    
    (currentUser._id && currentUser._id === post.userId 
      ? await axios
        .delete("/posts/" + post._id, { data: { userId: currentUser._id } })
        .then(() => {
          window.location.reload();
        })
      : alert("You don't have permission!"))
  }

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/profile/${user.username}`}>
              <div className="postProfile">
                <img
                  className="postProfileImg"
                  src={
                    user.profilePicture
                    ? PF + user.profilePicture
                    : PF + "person/noAvatar.png"
                  }
                  alt=""
                  />
                <span className="postUsername">{user.username}</span>
              </div>
            </Link>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          <div className="postTopRight">
            <MoreVert onClick={clickBurger} />
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post?.desc}</span>
          <img className="postImg" src={PF + post.img} alt="" />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            {isLiked ? (
              <img
                className="likeIcon"
                src={PF + "liked.png"}
                onClick={likeHandler}
                alt="Paw"
              />
            ) : (
              <img
                className="likeIcon"
                src={PF + "like.png"}
                onClick={likeHandler}
                alt="Paw"
              />
            )}
            <span className="postLikeCounter">{like} people liked it</span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText" onClick={clickComment}>Comments</span>
          </div>
        </div>
      </div>

      {displayPostControl ? (
        <div className="postAction">
          <div className="postActionItem">
            <Edit /> Edit
          </div>
          <div className="postActionItem" onClick={deletePost}>
            <Delete /> Delete
          </div>
        </div>
      ) : null}

      {displayComments ? (
        <div className="commentsBox">
          <Comment post={post} />
        </div>
      ) : null}
    </div>
  );
}

export default Post
