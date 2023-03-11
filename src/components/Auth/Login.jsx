import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../configs/firebase";
import { updateDoc, doc } from "firebase/firestore";
import { useHistory } from "react-router-dom";
import image from '../../assets/signin.png'
import { Button, TextField, InputAdornment } from "@mui/material";
const Login = () => {
  const history = useHistory();
  const [data, setData] = useState({
    email: "",
    password: "",
    error: null,
    loading: false
  });
  const { email, password, error, loading } = data;
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setData({ ...data, error: null, loading: true });
    console.log(data);
    if (!data.email || !data.password) {
      setData({ ...data, error: "All fields are required!" });
      return;
    }
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await updateDoc(doc(db, "users", result.user.uid), {
        isOnline: true
      });

      history.push("/dashboard");
    } catch (err) {
      console.log(err.message);
      setData({ ...data, error: err.message, loading: false });
    }
  };
  return (
    <div className="d-flex" style={{height:'100vh'}}>

      <div className="d-flex" style={{width:'70vw'}}>
        <div className="content" style={{width:'45%'}}>
          <h2
            style={{
              textAlign: "center",
              fontSize: "35px",
              color: "#502A75",
              marginTop: "10px"
            }}
          >
            Login
          </h2>

          <div class="formClass">
            <form onSubmit={handleSubmit}>
              <div class="form-group" style={{margin:'15px 0px'}}>

                <TextField
                 id="outlined-basic" 
                 label="Email" 
                 InputProps={{
                  startAdornment: <InputAdornment position="start">
                    <i className="fa fa-envelope"></i>
                  </InputAdornment>,
                  }}
                 style={{
                  width:'100%'
                 }}
                 variant="outlined"
                 value={email}
                 type="email"
                 name="email"
                 onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  handleChange(event);
                }}
                 required={true} />
              </div>

              <div class="form-group" style={{margin:'15px 0px'}}>
                 <TextField
                 id="outlined-basic" 
                 InputProps={{
                  startAdornment: <InputAdornment position="start">
                    <i className="fa fa-lock"></i>
                  </InputAdornment>,
                  }}
                 style={{
                  width:'100%'
                 }}
                 label="Password" 
                 variant="outlined"
                 name="password"
                 value={password}
                 type={'password'}
                 onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  handleChange(event);
                }}
                 required={true} />
              </div>

              <Button type="submit" variant="contained" style={{
                width:'100%'
              }}>{loading ? <i className="fa fa-spinner fa-spin"></i> : "submit"}</Button>
            
              <div style={{ color: "red", margin:'5px auto' }}>{error ? error : ""}</div>
              <div style={{margin:'10px auto',textAlign:'center'}}>
                <h5 style={{ fontSize: "medium", marginTop:'10px', marginBottom:'5px' }}>Don't have an Account?</h5>
                <Link to="/register">Register Here</Link>
              </div>
              {/* <Button className="" variant="" style={{
                width:'90%',
              }}>
              <img style={{width:'100%'}} src={image} alt="" />
              </Button> */}
            </form>
          </div>


        </div>

        <div className="d-flex" style={{width:'50%'}}>
          <img style={{
            borderRadius:'20px',
            width:'100%'
          }} src="https://media.istockphoto.com/id/173598452/photo/university-in-autumn.jpg?s=612x612&w=0&k=20&c=jQqpZuTZ6qXIfWqnCW5nqlExJZO0PO47L-ZiaE8jIk0=" alt="" />
        </div>
      </div>
    </div>
  );
};

export default Login;
