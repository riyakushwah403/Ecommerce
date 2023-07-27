import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { listOrders ,getStatusValues,updateOrderStatus} from "./ApiAdmin";
import moment from "moment";

const Orders = () => {
    const [orders, setOrders] = useState([])
    const [statusValues, setStatusValues] = useState([])

    const { user, token } = isAuthenticated()

    const loadOrders = () => {
        listOrders(user._id, token).then(data => {
            if (data.error) {
                console.log(data.error);

            } else {
                setOrders(data)
            }
        })
    }

    const loadStatusValues = () => {
        getStatusValues(user._id, token).then(data => {
            if (data.error) {
                console.log(data.error);

            } else {
                setStatusValues(data)
            }
        })
    }

    useEffect(() => {
        loadOrders();
        loadStatusValues();
    }, [])

    const showOrdersLength = () => {
        if (orders.length > 0) {
            return (
                <h1 className="text-danger display-2">Total orders {orders.length}</h1>
            )
        }
        else {
            return <h1 className="text-danger">No orders</h1>
        }
    }

    const showInput = (key, value) => {
     return(
        <div className="input-group mb-2 mr-ms-2">
        <div className="input-group-prepend">
            <div className="input-group-text">{key}</div>
        </div>
        <input type="text"  value={value} className="form-control" readOnly/>
    </div>
     )
    }

    const handleStatusChange =(e, orderId) =>{
        updateOrderStatus(user._id, token,orderId,e.target.value)
        .then(data=>{
            if(data.error){
                console.log("status update failled");
            } else{
                loadOrders()
            }
        })
    }
 
    const showStatus = (o) =>{
       return(
        <div className="form-group">
<h3 className="mark mb-4"> Status: {o.status}</h3>
<select className=" form-control"
 onChange={(e) => handleStatusChange(e,o._id)}>
    <option > update Status</option>
    {statusValues.map((status, i) =>(
        <option key={i} value={status}> {status}</option>
    ))}
 </select>
        </div>
       )
    }


    return (
        <Layout
            title="Orders"
            description={` hello ${user.name} you can manage all the order here`}
        >
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    {showOrdersLength()}
                    {orders.map((o, i) => {
                        // console.log("orders>>>>>>>>>>>>", orders);
                        return (
                            <div className="mt-5"
                                key={i}
                                style={{ borderBottom: " 5px solid indigo" }}>
                                <h2 className="mb-5">
                                    <span className="bg-primary"> Order Id: {o._id}</span>
                                </h2>
                                <ul className="list-group mb-2">
                                    <li className="list-group-item">{showStatus(o)}</li>
                                    <li className="list-group-item">
                                        Transaction ID:    {o.transaction_id}</li>
                                    <li className="list-group-item">
                                        Amount: {o.amount}Rs</li>
                                    <li className="list-group-item">
                                        Orderd By :{o.user.name}</li>
                                    <li className="list-group-item">
                                        Orderd On:    {moment(o.createdAt).fromNow()}</li>
                                    <li className="list-group-item">
                                        Delivery Address:    {o.address}</li>
                                </ul>
                                <h3 className="mt-4 mb-4 font-italic">
                                    Total Products in the Order: {o.products.length}
                                </h3>
                                {o.products.map((p, i) => {
                                   return(
                                    <div className="mb-4" key={i}
                                    style={{ padding: '20px', border: '1px solid indigo' }}>

                                    {showInput('Product name', p.name)}
                                    {showInput('Product price', p.price)}
                                    {showInput('Product total', p.count)}
                                    {showInput('Product Id', p._id)}



                                </div>
                                   )
                                })}
                            </div>
                        )
                    })}
                </div>
            </div>

        </Layout>
    )

}

export default Orders;