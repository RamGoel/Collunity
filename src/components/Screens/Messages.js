import { useEffect, useRef } from "react";

export default function Messages({ msg, user1id, user2 }) {
  const scrollRef = useRef();

  useEffect(() => {
    console.log(msg);
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msg]);

  return (
    <div>

    <div ref={scrollRef} style={{
      background:'#1F51FF',
      margin:'10px 0px', 
      width:'fit-content',
      padding:'10px 15px', 
      borderRadius:'20px',
      marginLeft:(msg.from==user1id)?'auto':'',
    }}>
      <p style={{margin:0, padding:0, color:'white'}}>
        {msg.text ? msg.text : ""}
      </p>
      {msg.media ? (
        <img src={msg.media} style={{height: "200px", borderRadius:'15px' }} />
      ) : null}
    </div>
    </div>
  );
}
