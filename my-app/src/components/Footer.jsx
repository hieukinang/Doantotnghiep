import React from 'react';
import {
    FaFacebookF,
    FaTwitter,
    FaInstagram,
    FaLinkedinIn,
} from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-blue-600 text-white py-10 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8">
                {/* Column 1 */}
                <div>
                    <h2 className="text-lg font-semibold mb-4">Exclusive</h2>
                    <p className="font-medium mb-2">Subscribe</p>
                    <p className="text-sm mb-4">Get 10% off your first order</p>
                    <div className="flex">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="p-2 rounded-l-md w-full text-black"
                        />
                        <button className="bg-white text-blue-600 px-4 py-2 rounded-r-md font-bold">
                            &gt;
                        </button>
                    </div>
                </div>

                {/* Column 2 */}
                <div>
                    <h2 className="text-lg font-semibold mb-4">Support</h2>
                    <p className="text-sm mb-1">111 Bijoy sarani, Dhaka,</p>
                    <p className="text-sm mb-1">DH 1515, Bangladesh.</p>
                    <p className="text-sm mb-1">exclusive@gmail.com</p>
                    <p className="text-sm">+88015-88888-9999</p>
                </div>

                {/* Column 3 */}
                <div>
                    <h2 className="text-lg font-semibold mb-4">Account</h2>
                    <ul className="space-y-2 text-sm">
                        <li>My Account</li>
                        <li>Login / Register</li>
                        <li>Cart</li>
                        <li>Wishlist</li>
                        <li>Shop</li>
                    </ul>
                </div>

                {/* Column 4 */}
                <div>
                    <h2 className="text-lg font-semibold mb-4">Quick Link</h2>
                    <ul className="space-y-2 text-sm">
                        <li>Privacy Policy</li>
                        <li>Terms Of Use</li>
                        <li>FAQ</li>
                        <li>Contact</li>
                    </ul>
                </div>

                {/* Column 5 */}
                <div>
                    <h2 className="text-lg font-semibold mb-4">Download App</h2>
                    <p className="text-sm mb-2">Save $3 with App New User Only</p>
                    <div className="flex items-center gap-2 mb-4">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/8/8f/Qr-2.png"
                            alt="QR"
                            className="w-16 h-16 bg-white p-1"
                        />
                        <div className="flex flex-col gap-2">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/512px-Google_Play_Store_badge_EN.svg.png"
                                alt="Google Play"
                                className="h-8"
                            />
                            <img
                                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                                alt="App Store"
                                className="h-8"
                            />
                        </div>
                    </div>
                    <div className="flex gap-4 text-xl">
                        <FaFacebookF />
                        <FaTwitter />
                        <FaInstagram />
                        <FaLinkedinIn />
                    </div>
                </div>
            </div>

            {/* Bottom line */}
            <div className="mt-10 text-center text-sm text-white/70 border-t border-white/20 pt-4">
                © Copyright Rimel 2022. All right reserved
            </div>
        </footer>
    );
};

export default Footer;
