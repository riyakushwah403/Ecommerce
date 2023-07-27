// export const addItem = (item, next) => {
//     let cart = [];
//     if (typeof window !== "undefined") {
//         if (localStorage.getItem('cart')) {
//             cart = JSON.parse(localStorage.getItem('cart'));
//             console.log("cart?????????",cart);
//         }

//         cart.push({
//             ...item,
//             count: 1
//         });

// //         // Remove duplicates using Set and then convert back to an array
// //         //  remove duplicates
// // // build an arrayfrom new set and turn it back into array using array .from
// // // so later we can re map it
// // //new set will only allow unique value in it
// // //so pass the ids of each object /product
// // //if the loop tries to add the same value again it will get ignored
// // //...with the array of ids we got on when firts map () was used
// // //run map() on it again and return the actual product from the cart
//         cart = Array.from(new Set(cart.map((p) => p._id))).map(id => {
//             return cart.find(p => p._id === id);
//         });

//         localStorage.setItem('cart', JSON.stringify(cart));
//         next();
//     }
// };
export const addItem = (item, next) => {
    let cart = [];
    if (typeof window !== "undefined") {
        if (localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem('cart'));
        }
        console.log(cart);

        // Check if the item with the same _id already exists in the cart
        const existingItem = cart.find((p) => p._id === item._id);

        if (existingItem) {
            // If the item already exists, increase its count
            existingItem.count += 1;
        } else {
            // If the item does not exist, add it to the cart with count: 1
            cart.push({
                ...item,
                count: 1
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        next();
    }
};

export const itemTotal =() =>{
    if(typeof window !== 'undefined'){
        if(localStorage.getItem('cart')){
            return JSON.parse(localStorage.getItem('cart')).length
        }
    };
    return 0;
};

export const getCart =() =>{
    if(typeof window !== 'undefined'){
        if(localStorage.getItem('cart')){
            return JSON.parse(localStorage.getItem('cart'));
        }
    };
    return [];
};

export const updateItem= (productId, count) =>{
    let cart =[]
    if(typeof window !== 'undefined'){
        if(localStorage.getItem('cart')){
            cart= JSON.parse(localStorage.getItem('cart'))
        }
        cart.map((product,i)=>{
            if(product._id === productId){
                cart[i].count = count
            }
        })
        localStorage.setItem('cart', JSON.stringify(cart))
    }
}

export const removeItem= (productId) =>{
    let cart =[]
    if(typeof window !== 'undefined'){
        if(localStorage.getItem('cart')){
            cart= JSON.parse(localStorage.getItem('cart'))
        }
        cart.map((product,i)=>{
            if(product._id === productId){
               cart.splice(i,1)
            }
        })

        localStorage.setItem('cart', JSON.stringify(cart))
    }
    return  cart;
}
  
export const emptyCart = next =>{
    if(typeof window !== "undefined")
    localStorage.removeItem("cart");
    next();

}