import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom/cjs/react-router-dom.min";
import ShowImage from "./ShowImage";
import { API } from '../config';
import moment from "moment/moment";
import { addItem, updateItem, removeItem } from "./CartHelpers";
import { useEffect } from "react";

const Card = ({ product,
    showViewProductButton = true,
    showAddToCartButton = true,
    cartUpdate = false,
    showRemoveProductButton = false
}) => {
    const [redirect, setRedirect] = useState(false);
    const [count, setCount] = useState(product.count)
    const showviewButton = (showViewProductButton) => {
        console.log("countcountcountcountcountcount",count);
        return (
            showViewProductButton && (
                <Link to={`/product/${product._id}`} className="mr-2">
                    <button className="btn btn-outline-warning mt-2 mb-2">
                        View Product
                    </button>
                </Link>
            )
        )
    }

    const addToCart = () => {
        // console.log("PPPPPPPPPPPP",product);
        addItem(product, () => {
            setRedirect(true)
        })
        console.log("PPPPPPPPPPPP", product);
    }
    const shouldRedirect = redirect => {
        if (redirect) {
            return <Redirect to="/cart" />
        }
    }

    const showAddToCart = showAddToCartButton => {
        return (
            showAddToCartButton && (
                <button
                    onClick={addToCart}
                    className="btn btn-outline-primary mt-2 mb-2">
                    Add to Cart
                </button>
            ))
    }
    const showRemoveProduct = showRemoveProductButton => {
        return (
            showRemoveProductButton && (
                <button
                    onClick={()=>{
                         const value = removeItem(product._id)
                         console.log("value value",value);
                    }}
                    className="btn btn-outline-danger mt-2 mb-2">
                   Remove Product
                </button>
            ))
    }

    const showStock = (quantity) => {
        return quantity > 0 ? (
            <span className="badge badge-primary badge-pill">In stock</span>
        ) : (
            <span className="badge badge-primary badge-pill">In stock</span>)
    }
    const handleChange = productId => event => {

        setCount(event.target.value < 1 ? 1 : event.target.value)

        if (event.target.value >= 1) {
            updateItem(productId, event.target.value)
        }
    }

    const showCardUpdateOptions = cartUpdate => {
        return cartUpdate && <div>
            <div className="input-group mb-3">
                <div className="input-group-prepand">
                    <span className="input-group-text "> Adjust Quantity</span>
                </div>
                <input type="number"
                    className="form-control"
                    value={count}
                    onChange={handleChange(product._id)} />
            </div>
        </div>
    }

    return (
        // <div className=" col-4 mb-3">
        // {console.log("product:::::::::::::",product)}
        <div className="card">
            <div className="card-header name" >{`${product.name} ${count}`}</div>
            <div className="card-body">
                {shouldRedirect(redirect)}
                <ShowImage p={product} url="product" />
                {/* <img src={`${API}/product/photo/${product._id}`} alt={`product.name`} className=" mb-3" style={{maxHeight:'100%', maxWidth:'100%'}}/> */}
                <p className="lead mt-2">{product.description.substring(0, 10)}</p>
                <p className="black-10">{product.price}</p>
                <p className="black-9">Category: {product.category && product.category.name}</p>
                <p className="black-8">
                    Added on{moment(product.createAt).fromNow()}
                </p>
                {showStock(product.quantity)}
                <br />

                {showviewButton(showViewProductButton)}

                {showAddToCart(showAddToCartButton)}
                {showRemoveProduct(showRemoveProductButton)}
                {showCardUpdateOptions(cartUpdate)}
            </div>
        </div>
        //  {/* </div> */}
    )
}

export default Card;