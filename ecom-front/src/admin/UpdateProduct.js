import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link , Redirect} from "react-router-dom/cjs/react-router-dom.min";
import { getProduct,updateProduct, getCategories } from "./ApiAdmin";

const UpdateProduct = ({match}) => {


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

        const init =(productId) =>{
            getProduct(productId).then(data=>{
                if(data.error){
                    setValues({...values , error:data.error})
                } else{
            //populate the state
            setValues({...values, name:data.name,
                description:data.description ,
                price:data.price,
                category:data.category._id,
                shipping: data.shipping,
                quantity:data.quantity,
                formData: new FormData()
            })
            initCategories()
                }
            })
        }

    const initCategories = () => {
        getCategories()
            .then(data => {
                console.log("data>>>>>>>>>>>>>>>>>>>>>>>", data);
                if (data.error) {
                    setValues({  error: data.error });
                } else {
                    setValues({  categories: data.category, formData: new FormData() });
                }
            });
    };

    useEffect(() => {
        init(match.params.productId);
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

        updateProduct(match.params.productId,user._id, token, formData)
            .then(data => {
                console.log("DD",data);
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
                        redirectToProfile:true,
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
            <button className="btn btn-outline-primary"> Update Product</button>
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
             Product is updated
              </div>
              ) 
          }
          const redirectUser =()  =>{
            if(redirectToProfile) {
                if(!error){
                    return  <Redirect to="/"/>
                }
            }
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
                    {redirectUser()}

                </div>
            </div>




        </Layout>
    )
}
export default UpdateProduct;