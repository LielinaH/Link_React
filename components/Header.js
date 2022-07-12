//  useState, useRef, useContext to get shared data from react context.
import { useState, useRef, useContext } from "react";
// Context to get shared data.
import Context from "../Context";
// real time db.
import { realTimeDb } from "../firebase";
// custom components.
import HeaderRightIcon from "./HeaderRightIcon";
import { GrSearch } from 'react-icons/gr'
import HeaderIcon from "./HeaderIcon";
import { TiHomeOutline } from 'react-icons/ti'
import { BsChatDots } from 'react-icons/bs'
import {BiLogOut} from 'react-icons/bi'

function Header() {
  // search results state.
  const [searchResults, setSearchResults] = useState([]);
  // get shared data from react context.
  const { user, setUser, setIsLoading, setIsChatLayoutShown, setSelectedContact } = useContext(Context);
  // create search ref to get value from the search box.
  const searchRef = useRef(null);

  
  // log out function.
   
  const logout = () => {
    if (confirm("Are you sure to log out ?")) {
      // clear authenticated user data from local storage and react context.
      localStorage.removeItem("auth");
      setUser(null);
      window.location.reload();
    }
  };

  /**
   * check the user is a friend, or not.
   * @param {*} friends 
   * @param {*} user 
   * @returns 
   */
  const isFriend = (friends, user) => {
    if (!friends || friends.length === 0 || !user) {
      return false;
    }
    return friends.find(friend => friend.uid === user.id);
  }

   //search users by user's email {e}
  
  const onSearchChanged = (e) => {
    const keywords = e.target.value;
    if (keywords === '') {
      setSearchResults(() => []);
      return;
    }
    // call firebase realtime db to search users by user's email
    realTimeDb.ref().child('users').orderByChild('email').startAt(keywords).endAt(keywords + "\uf8ff").on("value", function (snapshot) {
      const users = snapshot.val();
      console.log(users)
      if (users && users.length !== 0) {
        const keys = Object.keys(users);
        const searchResults = keys.map(key => users[key]);
        const url = `https://api-us.cometchat.io/v2.0/users/${user.id}/friends`;
        const options = {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            appId: `${process.env.NEXT_PUBLIC_COMETCHAT_APP_ID}`,
            apiKey: `${process.env.NEXT_PUBLIC_COMETCHAT_API_KEY}`,
          }
        };
        fetch(url, options).then((res) => {
          res.json().then(friends => {
            setSearchResults(() => searchResults.map(searchRes => {
              if (searchRes.id === user.id) {
                searchRes.status = 1; // you.
              } else if (isFriend(friends.data, searchRes)) {
                searchRes.status = 0; // ur friend.
              } else {
                searchRes.status = -1; // stranger.
              }
              return searchRes;
            }))
          });
        }).catch(error => {
          alert('Cannot load search results, please try again');
        });
      }
    });
  }

  //  close the search box and clear search results
 
  const closeSearchBox = () => {
    setSearchResults(() => []);
    searchRef.current.value = '';
  }

  // add friend {friendUid}
   
  const addFriend = (friend) => {
    setIsLoading(true);
    // send request to comet chat api
    const url = `https://api-us.cometchat.io/v2.0/users/${user.id}/friends`;
    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        appId: `${process.env.NEXT_PUBLIC_COMETCHAT_APP_ID}`,
        apiKey: `${process.env.NEXT_PUBLIC_COMETCHAT_API_KEY}`,
      },
      body: JSON.stringify({ accepted: [friend.id] }),
    };
    fetch(url, options)
      .then((res) => {
        // hide loading indicator.
        setIsLoading(false);
        // close search box and clear text input.
        searchRef.current.value = '';
        setSearchResults(() => []);
        // show success alert.
        alert(`${friend.email} was added as friend succesfully`);
      })
      .catch((err) => {
        console.error("error:" + err)
        // show failure alert.
        alert(`Failure to add ${friend.email} as friend`);
        // hide loading indicator.
        setIsLoading(false);
      });
  }

  const showChatUI = () => {
    setIsChatLayoutShown(true);
  };

  const hideChatUI = () => {
    setIsChatLayoutShown(false);
    setSelectedContact(null);
  }

  return (
    <header className="header">
      {/* Left */}
      <div className="header__left">
        <div>
          <img onClick={hideChatUI} src="/images/lslogo.png" style={{ height: '50px', marginTop: '7px' }} />
        </div>
        <div className="header__searchbox">
          <GrSearch />
          <input
            ref={searchRef}
            className="header__searchinput"
            placeholder="Search"
            onChange={onSearchChanged}
          />
          {searchResults && searchResults.length !== 0 && searchRef.current.value !== '' && (
            <div className="header__searchresult">
              <div className="header__searchtitlecontainer">
                <div className="header__searchtitle">Search Results</div>
                <div className="header__searchclose">
                  <img onClick={closeSearchBox} src="/images/x.png" />
                </div>
              </div>
              <div className="header__searchresultlist">
                {searchResults.map(result => (
                  <div key={result.id} className="header__searchresultlist-item">
                    <div className="header__searchresultlist-item-avatar">
                      <img src={result.avatar} />
                    </div>
                    <span className="header__searchresultlist-item-username">
                      {result.email}
                    </span>
                    <div className="header__searchresultlist-item-add-fr-btn">
                      {result.status == 1 ? <span>You</span> : result.status == 0 ? <span>Friend</span> : <button onClick={() => addFriend(result)}>Add Friend</button>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center */}
      <div className="header__center">
        <div className="header__iccontainer">
          <HeaderIcon
            onClick={hideChatUI}
            active
            icon = {
              <TiHomeOutline
              size={40} style={{justifyContent:"center"}}
              />} />
        </div>
      </div>

      {/* Right */}
      <div className="header__right">
        {user ? (
          <>
            <img className="header__avatar" src={user.avatar} />
            <p className="header__username">
              {user.email.substring(0, user.email.indexOf("@"))}
            </p>
          </>
        ) : (
          <></>
        )}
        <HeaderRightIcon
          onClick={showChatUI}
          icon={
            <BsChatDots size={25}/>
          }
        />
        <HeaderRightIcon
          onClick={logout}
          icon={
            <BiLogOut style={{marginRight:'5px'}} size={25}/>
          }
        />
      </div>
    </header>
  );
}

export default Header;
