import { useState } from "react";
import { Link } from 'react-router-dom'
import Header from '../../component-home-page/Header'
import Footer from '../../component-home-page/Footer'

export default function Wallet() {
    const [amount, setAmount] = useState("");

    const handleTopUp = () => {
        if (!amount || Number(amount) <= 0) {
            alert("Vui lòng nhập số tiền muốn nạp!");
            return;
        }
        // xử lý nạp tiền
        console.log("Nạp:", amount);
    };
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="pt-32 px-5 flex-1">
                <div className="max-w-2xl mx-auto">

                    {/* Ví của tôi */}
                    <section className="bg-white p-6 rounded-lg shadow">
                        <div className="font-semibold text-lg mb-4">Ví của tôi</div>

                        {/* Số dư và nút nạp tiền */}
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 flex items-center justify-between">
                            <div>
                                <div className="text-gray-500 text-sm">Số dư khả dụng</div>
                                <div className="text-3xl font-bold text-blue-600 mt-1">₫ 1,250,000</div>
                            </div>
                            <div className="p-1 ">
                                <input
                                    type="number"
                                    placeholder="Nhập số tiền"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="border border-blue-300 rounded-lg px-1 py-1 w-36 focus:outline-none focus:ring-2 focus:ring-blue-400 mx-2"
                                />

                                <button
                                    onClick={handleTopUp}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-1 py-1 rounded-lg font-medium shadow"
                                >
                                    Nạp tiền
                                </button>
                            </div>

                        </div>

                        {/* Lịch sử giao dịch */}
                        <div className="mt-8">
                            <div className="font-semibold mb-3 text-gray-800">Lịch sử giao dịch</div>
                            <div className="space-y-3 text-sm max-h-80 overflow-y-auto">
                                <div className="p-3 border rounded-lg flex justify-between">
                                    <div>
                                        <div className="font-medium">Nạp tiền</div>
                                        <div className="text-gray-500 text-xs">12/11/2025 - 09:20</div>
                                    </div>
                                    <div className="text-green-600 font-semibold">+ ₫200,000</div>
                                </div>

                                <div className="p-3 border rounded-lg flex justify-between">
                                    <div>
                                        <div className="font-medium">Thanh toán đơn hàng #DH00123</div>
                                        <div className="text-gray-500 text-xs">10/11/2025 - 14:55</div>
                                    </div>
                                    <div className="text-red-600 font-semibold">- ₫350,000</div>
                                </div>

                                <div className="p-3 border rounded-lg flex justify-between">
                                    <div>
                                        <div className="font-medium">Hoàn tiền từ Shop ABC</div>
                                        <div className="text-gray-500 text-xs">09/11/2025 - 11:12</div>
                                    </div>
                                    <div className="text-green-600 font-semibold">+ ₫120,000</div>
                                </div>
                            </div>
                        </div>
                    </section>

                </div>
            </main>

            <Footer />
        </div>
    )
}