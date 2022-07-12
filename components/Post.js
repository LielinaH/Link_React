import { GoCommentDiscussion } from 'react-icons/go'
import {GrLike} from 'react-icons/gr'

function Post({ createdBy, message, imageUrl, timestamp, userAvatar }) {
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
          <button className="post__reaction"><GrLike style={{ width: '20px', height: '18px'}}/></button>
        </div>

        <div className="post__footer-item">
          <button className="post__reaction"><GoCommentDiscussion style={{ width: '20px', height: '18px' }}/></button>
        </div>

      </div>
    </div>
  );
}

export default Post;
