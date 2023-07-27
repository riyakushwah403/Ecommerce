import React, { useState } from "react";
import Layout from "../core/Layout";
import { signup } from "../auth";

const Signup = () => {
    const [values, setValues] = useState({
        name: "",
        email: "",
        password: '',
        error: '',
        success: false
    });
    const { name, email, password,error,success } = values
    const handleChange = name => event => {
        setValues({ ...values, error: false, [name]: event.target.value })

    }

   
    

    const clickSubmit = (event) => {
        event.preventDefault()
        signup({ name, email, password })
            .then(data => {
                if (data.error) {
                    setValues({ ...values, error: data.error, success: false })
                }
                else {
                    setValues({
                        ...values,
                        name: '',
                        email: '',
                        password: '',
                        error: '',
                        success: true
                    })
                }
            })

    }

    const signUPfrom = () => {
        return (
            <form>
                <div className="from-group ">
                    <label className="text-muted">Name</label>
                    <br />
                    <input onChange={handleChange('name')}
                        type="text"
                        className="from-control"
                        value={name}
                    />
                </div>

                <div className="from-group ">
                    <label className="text-muted">Email</label>
                    <br />
                    <input onChange={handleChange('email')}
                        type="email"
                        className="from-control"
                        value={email}
                    />
                </div>

                <div className="from-group ">
                    <label className="text-muted">password</label>
                    <br />
                    <input onChange={handleChange('password')}
                        type="password"
                        className="from-control"
                        value={password}
                    />
                </div>
                <button onClick={clickSubmit} className="btn btn-primary">
                    Submit
                </button>

            </form>
        )
    };

    const showError = () => {
    return(   <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            {error}
        </div>
        ) 
    }
    const showSuccess = () => {
      return( <div className="alert alert-danger" style={{ display: success ? '' : 'none' }}>
         New account is created . Please signin
        </div>
        ) 
    }
    return (
        <Layout title="SignUp "
            description="Signup to node-react app"
            className="container col-md-8 offset-md-2"
        >
 {showSuccess()}
 {showError()}
            {signUPfrom()}
            {JSON.stringify(values)}
        </Layout>
    );
};

export default Signup;