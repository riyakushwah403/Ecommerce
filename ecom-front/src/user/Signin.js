import React, { useState } from "react";
import Layout from "../core/Layout";
import { signin, authenticate,isAuthenticated } from "../auth";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";


const Signin = () => {
    const [values, setValues] = useState({

        email: "",
        password: '',
        error: '',
        loading: false,
        redirectToReferrer: false
    });
    const { email, password, error, loading, redirectToReferrer } = values;
    const {user} = isAuthenticated()
    const handleChange = name => event => {
        setValues({ ...values, error: false, [name]: event.target.value })

    }




    const clickSubmit = (event) => {
        event.preventDefault();
        setValues({ ...values, error: false, loading: true })
        signin({ email, password })
            .then(data => {
                if (data.error) {
                    setValues({ ...values, error: data.error, loading: false })
                }
                else {
                   authenticate(data, () => {
                   setValues({
                    ...values,
                    redirectToReferrer: true
                });
                })
            }
            })

    }

    const signInfrom = () => {
        return (
            <form>

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
        return (<div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            {error}
        </div>
        )
    }
    const showLoading = () => {
        return (
            loading && (<div className=" alert alert-info">
                <h2>Loading....</h2>
            </div>)
        )
    };

    const redirectUser = () => {
        if (redirectToReferrer) {
            if(user && user.role === 1){
            return <Redirect to="/admin/dashboard" />

            }
            else{
            return <Redirect to="/user/dashboard" />

            }
        }

        if(isAuthenticated()){
            return <Redirect to="/" />
        }
    }
    return (
        <Layout title="SignIn "
            description="Signin to node-react app"
            className="container col-md-8 offset-md-2"
        >
            {showLoading()}

            {showError()}
            {signInfrom()}
            {redirectUser()}
            {/* {JSON.stringify(values)} */}
        </Layout>
    );
};

export default Signin;