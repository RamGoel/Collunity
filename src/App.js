import "./styles/styles.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Login from "./components/Auth/Login.jsx";
import Register from "./components/Auth/Register.jsx";
import Dashboard from "./components/Screens/Dashboard";
import AuthProvider from "./configs/auth";
import PrivateRoute from "./components/utils/PrivateRoute";
import Profile from "./components/Screens/Profile";
import SelectedUser from "./components/Screens/SelectedUser";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/register" component={Register} />
          <PrivateRoute exact path="/dashboard" component={Dashboard} />
          <PrivateRoute exact path="/profile" component={Profile} />
          <PrivateRoute path="/user" component={SelectedUser} />
        </Switch>
      </BrowserRouter>
    </AuthProvider>
  );
}
