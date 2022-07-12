// import custom components
import InputBox from "./InputBox";
import Posts from "./Posts";

function Feed() {
  return (
    <div className="feed">
      <div className="feed__container">
        <InputBox />
        <Posts />
      </div>
    </div>
  );
}

export default Feed;
