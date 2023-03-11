import { useRef, useState, useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { auth, db, storage } from "../../configs/firebase";
import FileUpload from "../utils/FileUpload";
import { AuthContext } from "../../configs/auth";
import SendIcon from "@mui/icons-material/Send";
import UploadIcon from "@mui/icons-material/Upload";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  Timestamp,
  QuerySnapshot,
  setDoc,
  doc,
  updateDoc
} from "firebase/firestore";
import {
  ref,
  getDownloadURL,
  uploadBytes,
  deleteObject
} from "firebase/storage";
import Messages from "./Messages";
import { usePageVisibility } from "react-page-visibility";
import UserCard from "./UserCard";

export default function SelectedUser({user2state}) {
  const { user } = useContext(AuthContext);
  const user1id = user.uid;
  console.log(user1id);
  // let location = useLocation();
  const user2 = user2state;
  var isVisible = usePageVisibility();

  const [text, setText] = useState("");
  const [img, setImg] = useState("");
  const [msgs, setMsgs] = useState([]);
  const [data, setData] = useState("");
  const [uploading, setUploading] = useState(false);

  const user2uid = user2.uid;
  const id =
    user1id > user2uid ? `${user1id + user2uid}` : `${user2uid + user1id}`;
  const addDocMsg = async (url) => {
    await addDoc(collection(db, "messages", id, "chat"), {
      text,
      from: user1id,
      to: user2uid,
      createdAt: Timestamp.fromDate(new Date()),
      media: url || ""
    });
    await setDoc(doc(db, "lastMsg", id), {
      text,
      from: user1id,
      to: user2uid,
      createdAt: Timestamp.fromDate(new Date()),
      media: url || "",
      unread: true
    });
    setText("");
    setImg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let url;
    if(!img && text==''){
      alert("Please type a message")
      return;
    }
    if (img) {
      setUploading(true);
      const imgRef = ref(
        storage,
        `images/${new Date().getTime()} - ${img.name}`
      );
      const snap = await uploadBytes(imgRef, img);
      const dlUrl = await getDownloadURL(ref(storage, snap.ref.fullPath));
      url = dlUrl;

      addDocMsg(url);
      setUploading(false);
      return;
    }
    addDocMsg();
  };

  useEffect(() => {
    const msgRef = collection(db, "messages", id, "chat");
    const _q = query(msgRef, orderBy("createdAt", "asc"));
    onSnapshot(_q, (querySnapshot) => {
      let msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push(doc.data());
      });
      setMsgs(msgs);
    });
    let unsub = onSnapshot(doc(db, "lastMsg", id), (doc) => {
      setData(doc.data());
    });
    return () => unsub();
  }, []);
  useEffect(() => {
    console.log("file uploaded");
  }, [setImg]);

  useEffect(async () => {
    console.log(isVisible);
    await updateDoc(doc(db, "users", user.uid), {
      isOnline: isVisible
    });
    user2.isOnline = isVisible;
  }, [isVisible]);
  console.log(data);
  return (
    <div>
      <main>
        <div className="content">
          

          <div
            style={{
              height: "80vh",
              overflowY: "auto",
              backgroundColor: "#eaebff",
              padding: "7px",
              marginLeft: "-10px",
              marginRight: "-10px",
              borderRadius: "5px"
            }}
            className="new"
          >
            <UserCard user={user2} design2={true} />
            {msgs.length
              ? msgs.map((msg, i) => (
                  <Messages msg={msg} user1id={user1id} user2={user2} />
                ))
              : null}
          </div>


          <div className="messageBox d-flex" style={{
            backgroundColor:'white',
            margin:'10px auto',
            width:'100%',
            padding:'5px',
            borderRadius:'10px'
          }}>
            <input
              onChange={(e) => setImg(e.target.files[0])}
              type="file"
              id="upimg"
              accept="image/*"
              style={{ display: "none" }}
            />

            <button
              id="linkCopy"
              className="button-s1"
              tooltip="Copy Link"
              flow="up"
              style={{
                background:'transparent',
                border:'none'
              }}
              onClick={() => {
                document.getElementById("upimg").click();
              }}
            >
              <span className="material-icons">
                <UploadIcon />
              </span>
            </button>

              <input
                id="message"
                name="message"
                placeholder="Type your message here"
                defaultValue={""}
                value={text}
                style={{
                  width:'100%',
                  padding:'10px',
                  background:'transparent',
                  border:'none'
                }}
                onChange={(e) => setText(e.target.value)}
              />
            <button
              onClick={(e) => handleSubmit(e)}
              id="send"
              className="button-s1"
              tooltip="Send"
              flow="left"
              style={{
                background:'transparent',
                border:'none'
              }}
            >
              <span className="material-icons headerIcon">
                <SendIcon />
              </span>
            </button>
          </div>

          {img ? <p>{img.name}</p> : ""}
          {uploading ? "Please Wait.. File is uploading" : ""}
        </div>
      </main>
    </div>
  );
}
