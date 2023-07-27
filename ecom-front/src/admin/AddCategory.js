import React, { useState } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { createCategory } from "./ApiAdmin";


const AddCategory = () => {
const [name,setName] = useState('')
const [error,setError] = useState(false)
const [success,setSuccess] = useState(false)

//destructure user nad token from localstorage
const {user,token  } =  isAuthenticated()

const handleChange =(event) =>{
// setError('')
setName(event.target.value)
}

const clickSubmit = (event) =>{
    event.preventDefault();

setError('')
setSuccess (false)

//make req to api to create category

 createCategory(user._id, token,{name})
 .then(data =>{
    if(data.error){
        setError(true)
    } else{
        setError('')
        setSuccess(true)
    }
 })
}
const newCategoryForm = () =>{
    return <form  onClick={clickSubmit}>
        <div className="formgroup">
<label className=" text-muted">name</label>
<input type="text" className="form-control" onChange={handleChange} value={name}
autoFocus />
<br/>
<button className="btn btn-primary">Create</button>

        </div>
    </form>
}


const showSuccess =() =>{
    if(success){
        console.log(name);
        return <h3 className="text-success">{name} is created</h3>
    }
}

const showError =() =>{
   
    if(error){
        return <h3 className="text-danger">Category should be Unique</h3>
    }
}

const goBack = () =>{
  return(  <div className="mr-5">
        <Link to="/admin/dashboard" className="text-warning"> Back to Dashboard</Link>
    </div>
  )
}
return(
    <Layout
    title=" Add a New Category"
    description={` hello ${user.name}  ready to add new category???`}
    className="col-md-8 offset-md-2">
    {showSuccess()}
    {showError()}
    {newCategoryForm()}
    {goBack()}

    </Layout>
)
}
export default AddCategory;