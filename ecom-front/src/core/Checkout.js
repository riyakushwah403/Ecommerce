import React, { useState, useEffect } from "react";
import { getBraintreeClientToken, getProducts, processPayment, createOrder } from "./apiCore";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { emptyCart } from './CartHelpers'
import DropIn from "braintree-web-drop-in-react";
import "braintree-web";



const Checkout = ({ products }) => {
    const [data, setData] = useState({
        success: false,
        clientToken: null,
        error: "",
        instance: {},
        address: ''
    })

    const userId = isAuthenticated() && isAuthenticated().user._id;

    const token = isAuthenticated() && isAuthenticated().token;

    const getToken = (userId, token) => {
        getBraintreeClientToken(userId, token).then(data => {
            if (data.error) {
                setData({ ...data, error: data.error })
            } else {
                setData({ clientToken: data.clientToken })
            }
        })
    }

    useEffect(() => {
        getToken(userId, token)
    }, []);
     const handleAddress = event =>{
        setData({...data, address: event.target.value});
     };


    const getTotal = () => {
        return products.reduce((currentValue, nextValue) => {
            return currentValue + nextValue.count * nextValue.price;
        }, 0);
    };

    const showCheckout = () => {

        return isAuthenticated() ? (
            <div  >{showDropIn()} </div>
        ) : (

            <Link to="/signin">
                <button className="btn btn-primary ">Sign in to Checkout</button>
            </Link>

        )
    }

    let deliveryAddress = data.address
    const buy = () => {
        //send the nonce to  your server 
        //nonce = data.instance.requestPaymentMethod()
        let nonce;
        let getNonce = data.instance.requestPaymentMethod()
            .then(data => {
                console.log(data);
                nonce = data.nonce
                //once you have nonce (card type, card number ) send nonce as 'paymentMethodNonce '
                //also total  to be charged
                console.log('send nonce and total to process', nonce, getTotal(products));

                const paymentData = {
                    paymentMethodNonce: nonce,
                    amount: getTotal(products)
                }
                processPayment(userId, token, paymentData)
                    .then(response => {
                         console.log(response);

                        //create order
                        setData({ ...data, success: true });
                        //empty cart
                        emptyCart(() => {
                            console.log('paymentsuccess and empty cart');
                        })

                        const createOrderData = {
                            products: products,
                            transaction_id:response.transaction.id,
                            amount:response.transaction.amount,
                            address: deliveryAddress
                        }
                        createOrder(userId, token, createOrderData)




                      

                    })
                    .catch(error => console.log(error));
            })

            .catch(error => {
                // console.log('dropin error', error);
                setData({ ...data, error: error.message })
            })
    }



    const showDropIn = () => {
        return (<div onBlur={() => setData({ ...data, error: '' })}>
            {data.clientToken !== null && products.length > 0 ? (

               
                <div>
                    <div className="gorm-group mb-3">
                        <label className="text-muted">Delivery Address</label>
                        <textarea 
                        onChange={handleAddress}
                        className="form-control"
                        value= {data.address}
                        placeholder="Type your Delivery Address"></textarea>
                    </div>
                    <DropIn options={{
                        authorization: data.clientToken,
                        paypal: {
                            flow: 'vault'
                        }
                    }} onInstance={instance => (data.instance = instance)} />
                    <button onClick={buy} className="btn btn-success">Make Payment</button>
                </div>
            ) : null}
        </div>
        )
    }

    const showError = error => {
        return (
            <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
                {error}
            </div>
        )
    }
    const showSuccess = success => {
        return (
            <div className="alert alert-info" style={{ display: success ? '' : 'none' }}>
                Thanks  Your payment was Successful
            </div>
        )
    }

    return (
        <div>

            <h2>Total: {getTotal()}Rs</h2>
            {showSuccess(data.success)}
            {showError(data.error)}
            {showCheckout()}
        </div>
    )

}
export default Checkout;