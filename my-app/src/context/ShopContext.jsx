import { createContext, useEffect, useState } from "react"

// import { products } from "../assets/assets";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from 'react-toastify'
import axios from 'axios';


export const ShopContext = createContext();
const ShopContextProvider = (props) => {

    const currency = '₫ ';
    const delivery_fee = 10000;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(true);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('');
    const navigate = useNavigate();

    const addToCart = async (itemId, brand, quantity = 1) => {
        let cartData = structuredClone(cartItems);

        // Thêm đúng số lượng được chọn
        cartData[itemId] = (cartData[itemId] || 0) + quantity;

        setCartItems(cartData);
        console.log(cartData);

        if (token) {
            try {
                toast.success("Add to cart successfully");
                await axios.post(`${backendUrl}/api/cart/add`, { itemId, quantity }, { headers: { token } });
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        }
    };


    const getCartCount = () => {
        let total = 0;

        for (const itemId in cartItems) {
            try {
                if (cartItems[itemId] > 0) {
                    total += cartItems[itemId]; // Chỉ cần cộng trực tiếp số lượng
                }
            } catch (error) {
                console.error("Error calculating total count:", error);
            }
        }

        return total;
    };

    const getProductsData = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/product/list')
            if (response.data.success) {
                setProducts(response.data.products);
            }
            else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }



    const updateQuantity = async (itemId, quantity) => {
        let cartData = structuredClone(cartItems);

        cartData[itemId] = quantity;

        setCartItems(cartData);

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/update', { itemId, quantity }, { headers: { token } });
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        }
    }

    const getCartAmount = () => {
        let totalAmount = 0;

        for (const itemId in cartItems) {
            let itemInfo = products.find((product) => product._id === itemId);

            if (!itemInfo) continue; // Bỏ qua nếu không tìm thấy sản phẩm

            try {
                if (cartItems[itemId] > 0) {
                    totalAmount += itemInfo.price * cartItems[itemId];
                }
            } catch (error) {
                console.error("Error calculating total amount:", error);
            }
        }

        return totalAmount;
    };
    const getUserCart = async (token) => {
        try {
            const response = await axios.post(backendUrl + '/api/cart/get', {}, { headers: { token } });
            if (response.data.success) {
                setCartItems(response.data.cartData);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }

    }

    useEffect(() => {
        getProductsData();
    }, [])

    useEffect(() => {

        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'));
            getUserCart(localStorage.getItem('token'));
        }

    }, [])

    const value = {
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart, setCartItems,
        getCartCount, updateQuantity,
        getCartAmount, navigate, backendUrl,
        setToken, token
    }
    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;
