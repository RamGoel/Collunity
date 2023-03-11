import { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { auth, db } from "../../configs/firebase";
import { useHistory } from "react-router-dom";
import { signOut } from "firebase/auth";
import { updateDoc, doc } from "firebase/firestore";
import { AuthContext } from "../../configs/auth";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { usePageVisibility } from "react-page-visibility";
import SelectedUser from "./SelectedUser";
import UserCard from "./UserCard";

export default function Dashboard() {
  const isVisible = usePageVisibility();

  const { user } = useContext(AuthContext);

  const history = useHistory();

  const location = useLocation();

  const handleSignOut = async () => {
    await updateDoc(doc(db, "users", user.uid), {
      isOnline: false
    });
    await signOut(auth);
    history.push("/");
  };

  const [users, setUsers] = useState([]);
  const [myuser, setMyUser] = useState([]);

  const [showChat, setShowChat]=useState(false);
  const [chatData, setChatData]=useState([])
  useEffect(() => {
    const usersRef = collection(db, "users");

    // create query object
    const myname = query(usersRef, where("uid", "in", [auth.currentUser.uid]));

    console.log("hi--", myname);
    const q = query(usersRef);
    //execute query
    const unsub = onSnapshot(q, (querySnapshot) => {
      let users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      setMyUser(users.find((e) => e.uid === auth.currentUser.uid));
      setUsers(users.filter((e) => e.uid != auth.currentUser.uid));
    });
    return () => unsub();
  }, []);

  console.log(myuser);

  return (
    <div style={{backgroundColor:'#1F51FF', margin:'13px', padding:'20px', borderRadius:'10px'}}>
      <main className="d-flex">
        <div className="content" style={{ width:'20vw' }}>
          <div style={{
            marginBottom:'5px',
            background:'black',
            borderRadius:'10px',
            padding:'7px'
          }}>
            <button onClick={handleSignOut} style={{
              background:'transparent',
              cursor:'pointer'
            }}>

           <i className="fa fa-sign-out" style={{color:'white'}}></i>
            </button>
          </div>

          <div className="new">
            <div
              style={{
                height: "83vh",
                overflowY: "auto",
                padding: "7px",
                borderRadius: "5px",
                background:'white'
              }}
              className="container"
            >
              {users.length?users.map((user) => {
                return (
                  <div
                    onClick={()=>{
                      setChatData(user)
                      setShowChat(true)
                    }}
                    style={{
                      color:'black',
                      textDecoration:'none',
                    }}
                  >
                    <UserCard user={user} />
                  </div>
                );
              }):<div style={{height:'80vh'}} className="d-flex">
                <i className="fa fa-spinner fa-spin"></i>
                </div>}
            </div>
          </div>
        </div>

        <div style={{width:'70vw'}}>
          {showChat?<SelectedUser user2state={chatData} />:null}
        </div>
      </main>
    </div>
  );
}
