// import useRef, useState and useContext.
import { useRef, useState, useContext } from "react";
// import Context to get shared data from react context.
import Context from '../Context';
// import real time data and storage to interact with real time database and upload files to Firebase.
import { realTimeDb, storage } from "../firebase";
// import uuid to generate id for posts.
import { v4 as uuidv4 } from "uuid";
import { ImFilePicture } from 'react-icons/im'


function InputBox() {
  // uploaded image to state
  const [imageToPost, setImageToPost] = useState(null);

  // input ref and file ref to get input value and uploaded file
  const inputRef = useRef(null);
  const filepickerRef = useRef(null);

  // get shared data from context.
  const { user, setIsLoading, wallPosts, setWallPosts } = useContext(Context);
  
  const updateWallPosts = (post) => {
    if (post) {
      const updatedwallPosts = [...wallPosts, post];
      setWallPosts(updatedwallPosts.sort((a, b) => {
        return new Date(b.timestamp) - new Date(a.timestamp);
      }));
    }
  }
  
  // send post to Firebase {e} and return

  const sendPost = async (e) => {
    e.preventDefault();

    if (!inputRef.current.value) return;

    // show loading indicator.
    setIsLoading(true);
    // generate uuid for the post.
    const postUuid = uuidv4();
    // create request payload.
    const post = {
      id: postUuid,
      message: inputRef.current.value,
      timestamp: new Date().toString(),
      createdBy: user.email.substring(0, user.email.indexOf('@')),
      userAvatar: user.avatar
    }
    // insert post to real time database - Firebase.
    await realTimeDb.ref(`posts/${postUuid}`).set(post).then(() => {
      if (imageToPost) {
        // if the end-user has uploaded image for the post. The image will be uploaded to firebase storage.
        setIsLoading(true);
        // upload image to Firebase storage.
        const uploadTask = storage.ref(`posts/${postUuid}`).putString(imageToPost, "data_url");
        // remove selected image from UI.
        removeImage();
        // keep track the uploading progress.
        uploadTask.on("state_changed", null, (error) => {
          alert(error);
          // hide loading indicator.
          setIsLoading(false);
        }, () => {
          storage.ref("posts").child(postUuid).getDownloadURL().then((url) => {
            // update post with the uploaded url.
            post.imageUrl = url;
            // set wall posts
            updateWallPosts(post);
            // update the post to real time database.
            realTimeDb.ref(`posts/${postUuid}`).set(post);
            // hide loading indicator.
            setIsLoading(false);
          });
        }
        );
      } else {
        // set wall posts
        updateWallPosts(post);
      }
      // hide loading indicator.
      setIsLoading(false);
    });
    // reset user's input value.  
    inputRef.current.value = "";
  };


  // get the uploaded image {e}.


  const addImageToPost = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      setImageToPost(readerEvent.target.result);
    };
  };

  //  remove image from the UI.

  const removeImage = () => {
    filepickerRef.current.value = null;
    setImageToPost(null);
  };

  return (
    <div className="inputbox__container">
      <div className="inputbox__wrapper">
        <img className="inputbox__useravatar" src={user.avatar} />
        <form className="inputbox__inputcontainer">
          <input
            className="inputbox__input"
            type="text"
            placeholder={`What's on your mind ${""}?`}
            ref={inputRef}
          />
          <button className="sub_button" onClick={sendPost}>
            Submit
          </button>
        </form>
      </div>

      {imageToPost && (
        <div onClick={removeImage} className="inputbox__imgcontainer">
          <img className="inputbox__img" src={imageToPost} alt="" />
        </div>
      )}
      <div
        onClick={() => filepickerRef.current.click()}
        className="inputIcon inputbox__footer-item"
      >
        <i
          data-visualcompletion="css-img"
          className="hu5pjgll lzf7d6o1"
          style={{
            backgroundImage:
              'url("/images/x.png")',
            backgroundPosition: "0px -175px",
            backgroundSize: "auto",
            width: "24px",
            height: "24px",
            backgroundRepeat: "no-repeat",
            display: "inline-block",
          }}
        ></i>
        <p className="inputbox__footer-item-title"><ImFilePicture size={30} style={{ marginTop: '5px', alignContent: 'left' }} /></p>
        <input
          onChange={addImageToPost}
          ref={filepickerRef}
          type="file"
          hidden
        />
      </div>
    </div>
  );
}

export default InputBox;
