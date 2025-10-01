import React from "react";
import { useParams } from "react-router-dom";

const ShipperProfileDetail = () => {
  const { id } = useParams();

  // Tạm thời data giả, thực tế sẽ fetch từ API theo id
  const shipper = {
    id,
    cccd: "012345678901",
    cccd_front: "/images/cccd_front.jpg",
    portrait: "/images/portrait.jpg",
    registration: "/images/registration.jpg",
    health_certificate: "/images/health.jpg",
    phone: "0901234567",
    email: "a@gmail.com",
    password: "********",
    fullname: "Nguyễn Văn A",
    vehicle_name: "Honda Winner X",
    license_plate: "59A1-123.45",
    work_area_city: "TP. Hồ Chí Minh",
    work_area_village: "Quận 1",
    bank_name: "Vietcombank",
    bank_account_number: "0123456789",
    bank_account_holder_name: "Nguyen Van A",
  };

  return (
    <div className="p-8 font-sans bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-[#116AD1] mb-6 text-center">
          Chi tiết Shipper
        </h2>

        <div className="grid grid-cols-2 gap-6">
          {/* Thông tin cơ bản */}
          <div>
            <label className="block font-semibold text-gray-700">
              Căn cước công dân
            </label>
            <p className="border rounded-lg px-3 py-2 bg-gray-50">{shipper.cccd}</p>
          </div>

          <div>
            <label className="block font-semibold text-gray-700">
              Số điện thoại
            </label>
            <p className="border rounded-lg px-3 py-2 bg-gray-50">{shipper.phone}</p>
          </div>

          <div>
            <label className="block font-semibold text-gray-700">Email</label>
            <p className="border rounded-lg px-3 py-2 bg-gray-50">{shipper.email}</p>
          </div>

          <div>
            <label className="block font-semibold text-gray-700">Mật khẩu</label>
            <p className="border rounded-lg px-3 py-2 bg-gray-50">{shipper.password}</p>
          </div>

          <div>
            <label className="block font-semibold text-gray-700">Họ và tên</label>
            <p className="border rounded-lg px-3 py-2 bg-gray-50">{shipper.fullname}</p>
          </div>

          <div>
            <label className="block font-semibold text-gray-700">Tên xe</label>
            <p className="border rounded-lg px-3 py-2 bg-gray-50">{shipper.vehicle_name}</p>
          </div>

          <div>
            <label className="block font-semibold text-gray-700">Biển số xe</label>
            <p className="border rounded-lg px-3 py-2 bg-gray-50">{shipper.license_plate}</p>
          </div>

          <div>
            <label className="block font-semibold text-gray-700">
              Khu vực (Tỉnh/Thành phố)
            </label>
            <p className="border rounded-lg px-3 py-2 bg-gray-50">{shipper.work_area_city}</p>
          </div>

          <div>
            <label className="block font-semibold text-gray-700">
              Khu vực (Quận/Huyện)
            </label>
            <p className="border rounded-lg px-3 py-2 bg-gray-50">{shipper.work_area_village}</p>
          </div>

          <div>
            <label className="block font-semibold text-gray-700">Ngân hàng</label>
            <p className="border rounded-lg px-3 py-2 bg-gray-50">{shipper.bank_name}</p>
          </div>

          <div>
            <label className="block font-semibold text-gray-700">Số tài khoản</label>
            <p className="border rounded-lg px-3 py-2 bg-gray-50">{shipper.bank_account_number}</p>
          </div>

          <div>
            <label className="block font-semibold text-gray-700">Chủ tài khoản</label>
            <p className="border rounded-lg px-3 py-2 bg-gray-50">
              {shipper.bank_account_holder_name}
            </p>
          </div>
        </div>

        {/* Hình ảnh */}
        <h3 className="text-2xl font-semibold text-[#116AD1] mt-8 mb-4">
          Hình ảnh hồ sơ
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <label className="block font-semibold text-gray-700">
              Mặt trước CCCD
            </label>
            <img
              src={shipper.cccd_front}
              alt="CCCD Front"
              className="rounded-lg shadow-md"
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-700">
              Ảnh chân dung
            </label>
            <img
              src={shipper.portrait}
              alt="Portrait"
              className="rounded-lg shadow-md"
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-700">Ảnh đăng ký</label>
            <img
              src={shipper.registration}
              alt="Registration"
              className="rounded-lg shadow-md"
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-700">
              Giấy khám sức khỏe
            </label>
            <img
              src={shipper.health_certificate}
              alt="Health"
              className="rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipperProfileDetail;
