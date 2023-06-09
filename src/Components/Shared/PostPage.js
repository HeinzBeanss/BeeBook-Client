import React, { useState } from "react";
import { Link } from "react-router-dom";

import defaultpfp from "../../Assets/default_bee_profile.jpg";
import heart from "../../Assets/heart-outline.svg";
import heartfull from "../../Assets/heart.svg";

const PostPage = ({guestMode, post, stopEnlargeImage, formatTimestamp, userData, toggleLikeComment, toggleLikePost, postComment, handleInputChange, comment, deletePost}) => {

    // Display Likes
    const [likes, setLikes] = useState(null);
    const displayLikes = (users) => {
        if (users.length < 1) {
            return
        }
        setLikes(
            <div className="display-likes-component">
                {users.map((user, index) => {
                    return (
                        <p key={index}>{user.first_name} {user.last_name}</p>
                    )
                })}
            </div>
        )
    };

    // Display Comment Likes
    const [hoveredComment, setHoveredComment] = useState(null);

    const displayCommentLikes = (users) => {
        if (users.length < 1) {
          return;
        }
      
        return (
          <div className="display-likes-component-postpage">
            {users.map((user, index) => (
              <p key={index}>{user.first_name} {user.last_name}</p>
            ))}
          </div>
        );
      };

    // Update the hover state for the specific comment
    const handleCommentMouseEnter = (commentId) => {
    setHoveredComment(commentId);
    };
    
     // Reset the hover state when the mouse leaves the comment
    const handleCommentMouseLeave = () => {
    setHoveredComment(null);
    };

    return (
        <div className="large-image-overlay" onClick={stopEnlargeImage}>
            <div className="large-image-container" onClick={(e) => e.stopPropagation()}>
                <img className="large-post-image" src={`data:${post.image.contentType};base64,${post.image.data}`} alt="large-post-content" />
            
                <div className="large-post-info">
                <div className="post-section-header">
                <Link onClick={stopEnlargeImage} className="user-profilepicture-medium t" to={`/user/${post.author._id}`}><img className="user-profilepicture-medium" src={`data:${post.author.profile_picture.contentType};base64,${post.author.profile_picture.data}`} alt={`${post.author.first_name} profile`} /></Link>
                {post.author._id === userData.updatedUser._id ? 
                <div className="profilepost-section-header">
                <div className="post-section-header-info">
                    <Link onClick={stopEnlargeImage} to={`/user/${post.author._id}`}><h4 className="post-user-name">{post.author.first_name} {post.author.last_name}</h4></Link>
                    <p className="post-timestamp">{formatTimestamp(post.timestamp)}</p>
                </div>
                <button className="profilepost-delete" onClick={deletePost}>Delete Post</button>
            </div> :
            <div className="post-section-header-info">
            <Link onClick={stopEnlargeImage} to={`/user/${post.author._id}`}><h4 className="post-user-name">{post.author.first_name} {post.author.last_name}</h4></Link>
                <p className="post-timestamp">{formatTimestamp(post.timestamp)}</p>
            </div>}
            </div>
            <div className="post-section-content">{post.content}</div>
            {/* Note - add hover like thing displaying users. */}
            <div className="post-section-feedback postpage">
            <div className="post-section-likes" onMouseOver={() => displayLikes(post.likes)} onMouseLeave={() => setLikes(null)}>
                    {likes}
                    <img className="comment-item-likesvg" src={post.likes.some(like => like._id === userData.updatedUser._id) ? heartfull : heart} onClick={guestMode ? null : toggleLikePost}></img>
                    <p className="post-section-likecount">{post.likes.length}</p>
                </div>
                <p className="post-section-comments">{post.comments.length} Comments</p>
            </div>
            <form className={post.comments.length > 0 ? "post-section-writecomment" : "post-section-writecomment-end"}>
                <img className="user-profilepicture-small" src={guestMode ? defaultpfp : `data:${userData.updatedUser.profile_picture.contentType};base64,${userData.updatedUser.profile_picture.data}`} alt={`${userData.updatedUser.first_name} profile`} />
                <input className="writecomment-section-comment" type="text" name="comment" placeholder={guestMode ? "Login to post a comment" : "Write a comment..."} onChange={handleInputChange} value={comment}></input>
                <button disabled={guestMode} type="submit" className="writecomment-section-post" onClick={postComment}>Post Comment</button>
            </form>
            {post.comments.length > 0 ? (
            <div className="comment-section">
            {post.comments.length > 0 && (
                
                post.comments.map((comment, index) => {
                    return (
                        <div key={index} className="comment-section-item">
                            <Link onClick={stopEnlargeImage} className="user-profilepicture-small" to={`/user/${comment.author._id}`}><img className="user-profilepicture-small" src={`data:${comment.author.profile_picture.contentType};base64,${comment.author.profile_picture.data}`} alt={`${comment.author.first_name} profile`} /></Link>
                            <div className="comment-item-right">
                                <div className="comment-item-right-top">
                                <Link onClick={stopEnlargeImage} to={`/user/${comment.author._id}`}><h5 className="comment-item-author">{comment.author.first_name} {comment.author.last_name}</h5></Link>
                                    <p className="comment-item-timestamp">{formatTimestamp(comment.timestamp)}</p>
                                </div>
                                
                                <div className="comment-item-right-bot">
                                    <p className="comment-item-content">{comment.content}</p>
                                    <div className="comment-item-likes postpage" onMouseEnter={() => handleCommentMouseEnter(comment._id)} onMouseLeave={handleCommentMouseLeave}>
                                    {hoveredComment === comment._id && (
                                    <>{displayCommentLikes(comment.likes)}</>
                                    )}
                                        <p className="comment-section-likecount">{comment.likes.length}</p>
                                        <img className="comment-item-likesvg" src={comment.likes.some(like => like._id === userData.updatedUser._id) ? heartfull : heart} onClick={guestMode ? null : (e) => toggleLikeComment(e, comment)}></img>

                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })
            )}
            </div>
            ) : null}
                </div>
            </div>
        </div>
    )
}

export default PostPage;