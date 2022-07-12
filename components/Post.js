import { GoCommentDiscussion } from 'react-icons/go'
import { GrLike } from 'react-icons/gr'
import firebase from "firebase";
import { useCallback, useContext, useState } from 'react';
import Context from '../Context';

function Post({ createdBy, message, imageUrl, timestamp, userAvatar, postUuid }) {
  const { setIsLoading } = useContext(Context);

  //post remove
  const deletePost = async () => {
    const ref = firebase.database().ref(`posts/${postUuid}`)
    setIsLoading(true)
    await ref.remove()
    setIsLoading(false)
    console.log('removed post');

  }

  return (
    <div className="post__container">
      <div className="post__title-container">
        <div className="post__title">
          <img className="header__avatar" src={userAvatar} />
          <div>
            <p className="post__name">{createdBy}</p>
            {timestamp ? (
              <p className="post__timestamp">
                {new Date(timestamp).toLocaleString()}
              </p>
            ) : (
              <p className="post__timestamp">Loading</p>
            )}
          </div>
          <div className='remove_button'>
            <button onClick={deletePost}>Remove</button>
          </div>
        </div>
        <p className="post__message">{message}</p>
      </div>
      {imageUrl && (
        <div className="post__background">
          <img src={imageUrl} />
        </div>
      )}

      {/* Post Footer */}
      <div className="post__footer">
        <div className="post__footer-item">
          <button className="post__reaction"><GrLike size={25} /></button>
        </div>
        <form className="inputbox__inputcontainer">
          <input
            className="inputbox__input"
            type="text"
            placeholder={`Comment ${""}?`}
          />
          <button className="post__reaction"><GoCommentDiscussion size={25} /></button>
        </form>
      </div>
    </div>
  );
}

export default Post;
