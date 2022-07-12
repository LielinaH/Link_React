// import useContext to get share data from react context.
import { useContext } from 'react';
// import context.
import Context from "../Context";
// import custom components.
import SidebarRow from "./SidebarRow";
import Groups from "./Groups";
import withModal from "./Modal";

function Sidebar(props) {
  const { user } = useContext(Context);

  const { toggleModal } = props;

  return (
    <div className="sidebar">
      <SidebarRow src={user.avatar} title={user.email.substring(0, user.email.indexOf('@'))} />
      <SidebarRow toggleModal={toggleModal} src="/images/group.png" title="Groups" />
    </div>
  );
}

export default withModal(Groups)(Sidebar);
