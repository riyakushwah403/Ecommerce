import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { createProduct, getCategories } from "./ApiAdmin";

const AddProduct = () => {


    const [values, setValues] = useState({
        name: '',
        description: '',
        price: '',
        categories: [],
        category: '',
        shipping: '',
        quantity: '',
        photo: '',
        loading: false,
        error: '',
        createdProduct: '',
        redirectToProfile: false,
        formData: ''
    })
    const { user, token } = isAuthenticated();
    const { name,
        description,
        price,
        categories,
        category,
        shipping,
        quantity,
        loading,
        error,
        createdProduct,
        redirectToProfile,
        formData } = values;

    const init = () => {
        getCategories()
            .then(data => {
                console.log("data>>>>>>>>>>>>>>>>>>>>>>>", data);
                if (data.error) {
                    setValues({ ...values, error: data.error });
                } else {
                    setValues({ ...values, categories: data.category, formData: new FormData() });
                }
            });
    };

    useEffect(() => {
        init();
    }, []);

    const handleChange = name => event => {
        console.log("event.target.value", event.target.value);
        const value = name === 'photo' ? event.target.files[0] : event.target.value
        formData.set(name, value);
        setValues({ ...values, [name]: value })
    }

    const clickSubmit = (event) => {
        event.preventDefault();
        setValues({ ...values, erroe: '', loading: true })

        createProduct(user._id, token, formData)
            .then(data => {
                if (data.error) {
                    setValues({ ...values, error: data.error, })
                } else {
                    setValues({
                        ...values,
                        name: '',
                        description: '',
                        photo: '',
                        price: '',
                        quantity: '',
                        loading: false,
                        createdProduct: data.name
                    });
                }
            })

    };
    const newPostForm = () => {
        return <form className="mb-3" onSubmit={clickSubmit} >
            <h4> Post Photo</h4>
            <div className="form-group">
                <label className="btn btn-outline-secondary">
                    <input onChange={handleChange('photo')}
                        type="file"
                        name="photo"
                        accept="image/*" />
                </label>
            </div>

            <div className="form-group">
                <label className="text-muted">Name </label>
                <input onChange={handleChange('name')}
                    type="text"
                    className="form-control"
                    value={name} />

            </div>
            <div className="form-group">
                <label className="text-muted">Description </label>
                <textarea onChange={handleChange('description')}
                    type="text"
                    className="form-control"
                    value={description} />

            </div>
            <div className="form-group">
                <label className="text-muted">Price </label>
                <input onChange={handleChange('price')}
                    type="number"
                    className="form-control"
                    value={price} />

            </div>
            <div className="form-group">
                <label className="text-muted">Categories </label>
                <select onChange={handleChange('category')} className="form-control">
                    <option > Please Select</option>

                    {categories &&
                        categories.map((c, i) => (<option key={i}
                            value={c._id}>
                            {c.name}
                        </option>))}


                </select>

            </div>

            <div className="form-group">
                <label className="text-muted">Shipping </label>
                <select onChange={handleChange('shipping')} className="form-control">
                    <option>Please Select</option>
                    <option value="0">No</option>
                    <option value="1">Yes</option>

                </select>


            </div>

            <div className="form-group">
                <label className="text-muted">Quantity </label>
                <input onChange={handleChange('quantity')}
                    type="number"
                    className="form-control"
                    value={quantity} />

            </div>
            <br />
            <button className="btn btn-outline-primary"> Create Product</button>
        </form>
    }
    const showError = () => {
        return(   <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
                {error}
            </div>
            ) 
        }
        const showSuccess = () => {
            return( <div className="alert alert-danger" style={{ display: createdProduct ? '' : 'none' }}>
             Product is Created
              </div>
              ) 
          }

    return (
        <Layout
            title=" Add a New Product"
            description={` hello ${user.name}  ready to add new product???`}>
            <div className="row">
                <div className="col-md-8 offset-md-2">
                
                    {showSuccess()}
                    {showError()}
                    {newPostForm()}

                </div>
            </div>




        </Layout>
    )
}
export default AddProduct;