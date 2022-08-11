import "./comment.css";
import React, { useState, useRef, useContext, useEffect } from 'react';
import { Typography, TextField } from '@material-ui/core';
import { Send } from "@material-ui/icons";
import { useDispatch } from 'react-redux';
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";

const Comment = ({ post }) => {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(post?.comments);
  const commentsRef = useRef();
  const { user: currentUser } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const handleSubmit = async (e) => {

    const res = await axios
      .post("/posts/" + post._id + "/comments", { value: newComment })
      .then(() => {
        window.location.reload();
        e.preventDefault();
      });
    
    setNewComment("");
    setComments([...newComment, res.data]);

    commentsRef.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div>
      <div className="commentOuterContainter">
        <div className="commentInnerContainter">
          {comments.map((c, i) => (
            <Typography key={i} gutterBottom variant="subtitle1">
              <div className="commentList">
                <img
                  className="profileImg"
                  src={PF + "person/noAvatar.png"}
                  alt=""
                />
                <p className="commentText">{c.split(': ')[0]}</p>
                {c.split(':')[1]}
              </div>
            </Typography>
          ))}
        </div>
        <div style={{ width: '100%' }} className="addNewComment">
            <Link to={`/profile/${currentUser.username}`}>
              <img
                className="profileImg"
                src={
                  currentUser.profilePicture
                    ? PF + currentUser.profilePicture
                    : PF + "person/noAvatar.png"
                }
                alt=""
              />
          </Link>
          <div className="textField">
            <TextField 
              fullWidth
              variant="outlined"
              label="Comment"
              multiline
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
          </div>
          <button 
            className="commentSubmitButton"
            fullWidth
            disabled={!newComment}
            variant="contained"
            onClick={handleSubmit}
          >
              <Send />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Comment