import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../configs/firebase";
import { setDoc, doc, Timestamp, onSnapshot, collection, query, orderBy, addDoc } from "firebase/firestore";
import { useHistory } from "react-router-dom";
import { TextField, Button, InputAdornment, Autocomplete} from "@mui/material";
import { useEffect } from "react";

const Register = () => {
  const history = useHistory();
  const [collegeList, setCollegeList] = useState(null)
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    college: "",
    error: null,
    loading: false
  });
  const { name, email, password, college, error, loading } = data;
  const handleChange = (e, val) => {
    if(val!=null){
      setData({ ...data, college: val });
    }else{

      setData({ ...data, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(data);
    setData({ ...data, error: null, loading: true });
    if (!data.name || !data.email || !data.password) {
      setData({ ...data, error: "All fields are required!" });
      return;
    }
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(result.user);
      if(!collegeList.includes(college)){
        await addDoc(collection(db,"colleges"),{
          label:college,
          id:collegeList[collegeList.length-1].id
        })
      }
      await setDoc(doc(db, "users", result.user.uid), {
        uid: result.user.uid,
        name,
        email,
        college,
        createdAt: Timestamp.fromDate(new Date()),
        isOnline: true
      });
      setData({
        name: "",
        email: "",
        password: "",
        college: "",
        error: null,
        loading: false
      });
      history.push("/dashboard", name);
    } catch (err) {
      console.log(err.message);
      setData({ ...data, error: err.message, loading: false });
    }
  };


  useEffect(() => {
    const clgRef = collection(db, "colleges");
    const _q = query(clgRef, orderBy("label", "asc"));
    let unsub = onSnapshot(_q, (querySnapshot) => {
      let ls = [];
      querySnapshot.forEach((doc) => {
        ls.push(doc.data());
      });
      setCollegeList(ls);
    });
    return () => unsub();
  }, []);


  return (

    <div className="d-flex" style={{ height: '100vh' }}>

      <div className="d-flex" style={{ width: '70vw' }}>
        <div className="content" style={{ width: '45%' }}>
          <h2
            style={{
              textAlign: "center",
              fontSize: "35px",
              color: "#502A75",
              marginTop: "10px"
            }}
          >
            Register
          </h2>

          <div class="formClass">
            <form onSubmit={handleSubmit}>
              <div class="form-group" style={{ margin: '15px 0px' }}>

                <TextField
                  id="outlined-basic"
                  label="Full Name"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">
                      <i className="fa fa-user"></i>
                    </InputAdornment>,
                  }}
                  style={{
                    width: '100%'
                  }}
                  variant="outlined"
                  value={name}
                  type="text"
                  name="name"
                  onChange={(event) => {
                    handleChange(event);
                  }}
                  required={true} />
              </div>

              <div class="form-group" style={{ margin: '15px 0px' }}>

                <TextField
                  id="outlined-basic"
                  label="Email"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">
                      <i className="fa fa-envelope"></i>
                    </InputAdornment>,
                  }}
                  style={{
                    width: '100%'
                  }}
                  variant="outlined"
                  value={email}
                  type="email"
                  name="email"
                  onChange={(event) => {
                    handleChange(event);
                  }}
                  required={true} />
              </div>

              <div class="form-group" style={{ margin: '15px 0px' }}>
                <TextField
                  id="outlined-basic"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">
                      <i className="fa fa-lock"></i>
                    </InputAdornment>,
                  }}
                  style={{
                    width: '100%'
                  }}
                  label="Password"
                  variant="outlined"
                  name="password"
                  value={password}
                  type={'password'}
                  onChange={(event) => {
                    handleChange(event);
                  }}
                  required={true} />
              </div>

              <div class="form-group" style={{ margin: '15px 0px' }}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={collegeList}
                  freeSolo={true}
                  inputValue={college}
                  onInputChange={(e,val)=>handleChange(e, val)}
                  renderInput={(params) => <TextField {...params} label="College" />}
                />
                
              </div>

              <Button type="submit" variant="contained" style={{
                width: '100%'
              }}>{loading ? <i className="fa fa-spinner fa-spin"></i> : "submit"}</Button>

              <div style={{ color: "red", margin: '5px auto' }}>{error ? error : ""}</div>
              <div style={{ margin: '10px auto', textAlign: 'center' }}>
                <h5 style={{ fontSize: "medium", marginTop: '10px', marginBottom: '5px' }}>Already have an Account?</h5>
                <Link to="/">Login Here</Link>
              </div>

            </form>
          </div>


        </div>

        <div className="d-flex" style={{ width: '50%' }}>
          <img style={{
            borderRadius: '20px',
            width: '100%'
          }} src="https://media.istockphoto.com/id/173598452/photo/university-in-autumn.jpg?s=612x612&w=0&k=20&c=jQqpZuTZ6qXIfWqnCW5nqlExJZO0PO47L-ZiaE8jIk0=" alt="" />
        </div>
      </div>
    </div>



  );
};

export default Register;
