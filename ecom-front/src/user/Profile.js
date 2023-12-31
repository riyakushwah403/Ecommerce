import React, { useEffect, useState } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link, Redirect } from "react-router-dom/cjs/react-router-dom.min";
import { read, update, updateUser } from "./apiUser";

const Profile = ({ match }) => {


    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        error: false,
        success: false
    })

    const { token } = isAuthenticated();
    const { name, email, password, error, success } = values;

    const init = (userId) => {
        console.log("userId???????", userId);
        read(userId, token)
            .then(data => {
                if (data.error) {
                    setValues({ ...values, error: true })
                } else {
                    setValues({ ...values, name: data.name, email: data.email })
                }
            })
    }
    useEffect(() => {
        init(match.params.userId)
    }, [])
    const handleChange = name => e => {
        setValues({ ...values, error: false, [name]: e.target.value })
    }

    const clickSubmit = e => {
        e.preventDefault();
        update(match.params.userId, token, { name, email, password })
            .then(data => {
                console.log("data??????????", data);
                if (data.error) {
                    console.log(data.error)
                } else {
                    updateUser(data, () => {
                        setValues({ ...values, name: data.name, email: data.email, success: true })
                    })
                }
            })
    }
    const redirectUser = (success) => {
        if (success) {
            return <Redirect to="/cart" />
        }
    }
    const profileUpdate = (name, email, password) => {
        return (
            <form >
                <div className="form-group">
                    <label className="text-muted">Name</label>
                    <input type="text"
                        onChange={handleChange('name')}
                        className="form-control"
                        value={name}></input>
                </div>
                <div className="form-group">
                    <label className="text-muted">email</label>
                    <input type="email"
                        onChange={handleChange('email')}
                        className="form-control"
                        value={email}></input>
                </div>
                <div className="form-group">
                    <label className="text-muted">password</label>
                    <input type="text"
                        onChange={handleChange('password')}
                        className="form-control"
                        value={password}></input>
                </div>

                <button onClick={clickSubmit} className="btn btn-primary">Submit</button>
            </form>
        )
    }

    return (<Layout title="profile Page"
        description="Update Your Profile">
        <h2 className="mb-4"> profile Update</h2>
        {/* {JSON.stringify(values)} */}
        {profileUpdate(name, email, password)}
        {redirectUser(success)}
    </Layout>
    )
}

export default Profile;