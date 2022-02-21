import React, { useState } from "react";
import {
  BsFillPersonPlusFill,
  BsFillPersonLinesFill,
  BsFillEnvelopeFill,
  BsFillPersonFill,
} from "react-icons/bs";
import "./sidepanel.css";
import AddFriend from "../AddFriend/AddFriend";
import FriendRequests from "../FriendRequests/FriendRequests";
import Friendlist from "../Friendlist/Friendlist";
import Profile from "../Profile/Profile";

const Sidepanel = () => {
  const [state, setState] = useState(0);

  const updateState = (val) => {
    if (state === val){
      setState(0)
    }
    else {
      setState(val)
    }
  }

  return (
    <>
      <div className="Sidepanel_main">
        <div className="Sidepanel_navbar">
          <div
            className={`Sidepanel_navbar-button ${state === 1 && "selected"}`}
            onClick={() => updateState(1)}
          >
            <BsFillPersonLinesFill />
          </div>
          <div
            className={`Sidepanel_navbar-button ${state === 2 && "selected"}`}
            onClick={() => updateState(2)}
          >
            <BsFillPersonPlusFill />
          </div>
          <div
            className={`Sidepanel_navbar-button ${state === 3 && "selected"}`}
            onClick={() => updateState(3)}
          >
            <BsFillEnvelopeFill />
          </div>
          
          <div className="Sidepanel_navbar-footer" />
          
          <div className="Sidepanel_navbar-personal">
            <div
              className={`Sidepanel_navbar-button ${state === 4 && "selected"}`}
              onClick={() => updateState(4)}
            >
              <BsFillPersonFill />
          </div>

          </div>
        </div>
      </div>
        {state !== 0 && <div className="default-block">
          {state === 1 && <Friendlist />}
          {state === 2 && <AddFriend />}
          {state === 3 && <FriendRequests />}
          {state === 4 && <Profile/>}
      </div>}
    </>
  );
};

export default Sidepanel;
