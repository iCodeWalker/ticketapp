import { useState } from "react";
// import axios from "axios";
import Router from "next/router";
import useRequest from "../../hooks/useRequest";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //   const [errors, setErrors] = useState([]);
  const { doRequest, errors } = useRequest({
    url: "/api/users/signin",
    method: "post",
    body: { email, password },
    onSuccess: () => Router.push("/"),
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    await doRequest();

    // Router.push("/")

    // try {
    //   const response = await axios.post("/api/users/signup", {
    //     email,
    //     password,
    //   });
    // } catch (err) {
    //   setErrors(err.response.data.errors);
    // }
  };

  console.log(errors, "useRequest");
  return (
    <form onSubmit={onSubmit}>
      <h1>Sign In</h1>
      <div className="form-group">
        <label>Email address</label>
        <input
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {errors}
      {/* {errors?.length > 0 && (
        <div className="alert alert-danger">
          <ul className="my-0">
            {errors?.map((error, index) => (
              <li key={index}>{error.message}</li>
            ))}
          </ul>
        </div>
      )} */}
      <button className="btn btn-primary">Sign In</button>
    </form>
  );
};

export default SignIn;
