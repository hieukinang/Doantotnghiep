import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  DialogActions,
  Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const ShipperManagement = () => {
  const navigate = useNavigate();

  const [shippers, setShippers] = useState([
    {
      id: 1,
      fullname: "Nguyễn Văn A",
      phone: "0901234567",
      email: "shipperA@gmail.com",
      vehicle_name: "Wave Alpha",
      license_plate: "30A-12345",
      work_area_city: "Hà Nội",
      work_area_village: "Hoàn Kiếm",
      status: "Hoạt động",
    },
    {
      id: 2,
      fullname: "Trần Thị B",
      phone: "0912345678",
      email: "shipperB@gmail.com",
      vehicle_name: "Vision",
      license_plate: "29B-98765",
      work_area_city: "Hà Nội",
      work_area_village: "Cầu Giấy",
      status: "Tạm nghỉ",
    },
    {
      id: 1,
      fullname: "Nguyễn Văn A",
      phone: "0901234567",
      email: "shipperA@gmail.com",
      vehicle_name: "Wave Alpha",
      license_plate: "30A-12345",
      work_area_city: "Hà Nội",
      work_area_village: "Hoàn Kiếm",
      status: "Hoạt động",
    },
    {
      id: 2,
      fullname: "Trần Thị B",
      phone: "0912345678",
      email: "shipperB@gmail.com",
      vehicle_name: "Vision",
      license_plate: "29B-98765",
      work_area_city: "Hà Nội",
      work_area_village: "Cầu Giấy",
      status: "Tạm nghỉ",
    },
    {
      id: 1,
      fullname: "Nguyễn Văn A",
      phone: "0901234567",
      email: "shipperA@gmail.com",
      vehicle_name: "Wave Alpha",
      license_plate: "30A-12345",
      work_area_city: "Hà Nội",
      work_area_village: "Hoàn Kiếm",
      status: "Hoạt động",
    },
    {
      id: 2,
      fullname: "Trần Thị B",
      phone: "0912345678",
      email: "shipperB@gmail.com",
      vehicle_name: "Vision",
      license_plate: "29B-98765",
      work_area_city: "Hà Nội",
      work_area_village: "Cầu Giấy",
      status: "Tạm nghỉ",
    },
    {
      id: 1,
      fullname: "Nguyễn Văn A",
      phone: "0901234567",
      email: "shipperA@gmail.com",
      vehicle_name: "Wave Alpha",
      license_plate: "30A-12345",
      work_area_city: "Hà Nội",
      work_area_village: "Hoàn Kiếm",
      status: "Hoạt động",
    },
    {
      id: 2,
      fullname: "Trần Thị B",
      phone: "0912345678",
      email: "shipperB@gmail.com",
      vehicle_name: "Vision",
      license_plate: "29B-98765",
      work_area_city: "Hà Nội",
      work_area_village: "Cầu Giấy",
      status: "Tạm nghỉ",
    },
    {
      id: 1,
      fullname: "Nguyễn Văn A",
      phone: "0901234567",
      email: "shipperA@gmail.com",
      vehicle_name: "Wave Alpha",
      license_plate: "30A-12345",
      work_area_city: "Hà Nội",
      work_area_village: "Hoàn Kiếm",
      status: "Hoạt động",
    },
    {
      id: 2,
      fullname: "Trần Thị B",
      phone: "0912345678",
      email: "shipperB@gmail.com",
      vehicle_name: "Vision",
      license_plate: "29B-98765",
      work_area_city: "Hà Nội",
      work_area_village: "Cầu Giấy",
      status: "Tạm nghỉ",
    },
    {
      id: 1,
      fullname: "Nguyễn Văn A",
      phone: "0901234567",
      email: "shipperA@gmail.com",
      vehicle_name: "Wave Alpha",
      license_plate: "30A-12345",
      work_area_city: "Hà Nội",
      work_area_village: "Hoàn Kiếm",
      status: "Hoạt động",
    },
    {
      id: 2,
      fullname: "Trần Thị B",
      phone: "0912345678",
      email: "shipperB@gmail.com",
      vehicle_name: "Vision",
      license_plate: "29B-98765",
      work_area_city: "Hà Nội",
      work_area_village: "Cầu Giấy",
      status: "Tạm nghỉ",
    },
  ]);

  const [openForm, setOpenForm] = useState(false); // popup thêm shipper
  const [openUpdate, setOpenUpdate] = useState(false); // popup cập nhật
  const [openDelete, setOpenDelete] = useState(false); // popup xóa
  const [openDetail, setOpenDetail] = useState(false); // popup xem chi tiết

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedShipper, setSelectedShipper] = useState(null);

  // Menu hành động
  const handleMenuClick = (event, shipper) => {
    setAnchorEl(event.currentTarget);
    setSelectedShipper(shipper);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Xem chi tiết
  const handleDetail = (id) => {
    navigate(`/shipper/profile-detail/${id}`);
    handleMenuClose();
  };

  // Mở popup cập nhật
  const handleUpdate = () => {
    setOpenUpdate(true);
    handleMenuClose();
  };

  // Lưu cập nhật
  const handleUpdateSubmit = (updatedShipper) => {
    setShippers(
      shippers.map((s) => (s.id === updatedShipper.id ? updatedShipper : s))
    );
    setOpenUpdate(false);
  };

  // Mở popup xóa
  const handleDelete = () => {
    setOpenDelete(true);
    handleMenuClose();
  };

  // Xác nhận xóa
  const confirmDelete = () => {
    setShippers(shippers.filter((s) => s.id !== selectedShipper.id));
    setOpenDelete(false);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Nút thêm shipper góc trên bên phải */}
      <div className="flex justify-end mb-4">
        <Button
          variant="contained"
          style={{ backgroundColor: "#116AD1" }}
          className="rounded-2xl"
          onClick={() => setOpenForm(true)}
        >
          + Thêm Shipper
        </Button>
      </div>

      {/* Bảng danh sách shipper */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead style={{ backgroundColor: "#116AD1" }}>
            <TableRow>
              <TableCell style={{ color: "white" }}>Họ và tên</TableCell>
              <TableCell style={{ color: "white" }}>Số điện thoại</TableCell>
              <TableCell style={{ color: "white" }}>Email</TableCell>
              <TableCell style={{ color: "white" }}>Trạng thái</TableCell>
              <TableCell style={{ color: "white" }}>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shippers.map((shipper) => (
              <TableRow key={shipper.id}>
                <TableCell>{shipper.fullname}</TableCell>
                <TableCell>{shipper.phone}</TableCell>
                <TableCell>{shipper.email}</TableCell>
                <TableCell>{shipper.status}</TableCell>
                <TableCell>
                  <IconButton onClick={(e) => handleMenuClick(e, shipper)}>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Menu hành động */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleDetail}>Xem chi tiết</MenuItem>
        <MenuItem onClick={handleUpdate}>Cập nhật</MenuItem>
        <MenuItem onClick={handleDelete}>Xóa</MenuItem>
      </Menu>

      {/* Popup thêm shipper */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="md" fullWidth>
        <DialogTitle style={{ color: "#116AD1", fontWeight: "bold" }}>
          Thêm Shipper mới
        </DialogTitle>
        <DialogContent dividers>
          <Typography>Form thêm shipper sẽ đặt ở đây...</Typography>
          <div className="flex justify-end mt-6">
            <Button onClick={() => setOpenForm(false)} color="error">
              Hủy
            </Button>
            <Button
              variant="contained"
              style={{ backgroundColor: "#116AD1", marginLeft: "10px" }}
              onClick={() => setOpenForm(false)}
            >
                Lưu
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Popup xem chi tiết */}
      <Dialog
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle style={{ color: "#116AD1", fontWeight: "bold" }}>
          Chi tiết Shipper
        </DialogTitle>
        <DialogContent dividers>
          {selectedShipper && (
            <>
              <Typography>
                <b>Họ và tên:</b> {selectedShipper.fullname}
              </Typography>
              <Typography>
                <b>Số điện thoại:</b> {selectedShipper.phone}
              </Typography>
              <Typography>
                <b>Email:</b> {selectedShipper.email}
              </Typography>
              <Typography>
                <b>Tên phương tiện:</b> {selectedShipper.vehicle_name}
              </Typography>
              <Typography>
                <b>Biển số xe:</b> {selectedShipper.license_plate}
              </Typography>
              <Typography>
                <b>Thành phố:</b> {selectedShipper.work_area_city}
              </Typography>
              <Typography>
                <b>Xã/Phường:</b> {selectedShipper.work_area_village}
              </Typography>
              <Typography>
                <b>Trạng thái:</b> {selectedShipper.status}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetail(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Popup cập nhật */}
      <Dialog
        open={openUpdate}
        onClose={() => setOpenUpdate(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle style={{ color: "#116AD1", fontWeight: "bold" }}>
          Cập nhật Shipper
        </DialogTitle>
        <DialogContent dividers>
          {selectedShipper && (
            <div className="grid grid-cols-2 gap-4">
              {[
                { key: "fullname", label: "Họ và tên" },
                { key: "phone", label: "Số điện thoại" },
                { key: "email", label: "Email" },
                { key: "vehicle_name", label: "Tên phương tiện" },
                { key: "license_plate", label: "Biển số xe" },
                { key: "work_area_city", label: "Thành phố" },
                { key: "work_area_village", label: "Xã/Phường" },
              ].map((field) => (
                <TextField
                  key={field.key}
                  fullWidth
                  label={field.label}
                  value={selectedShipper[field.key] || ""}
                  onChange={(e) =>
                    setSelectedShipper({
                      ...selectedShipper,
                      [field.key]: e.target.value,
                    })
                  }
                />
              ))}
            </div>
          )}
          <div className="flex justify-end mt-6">
            <Button onClick={() => setOpenUpdate(false)} color="error">
              Hủy
            </Button>
            <Button
              variant="contained"
              style={{ backgroundColor: "#116AD1", marginLeft: "10px" }}
              onClick={() => handleUpdateSubmit(selectedShipper)}
            >
              Lưu
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Popup xác nhận xóa */}
      <Dialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle style={{ color: "red", fontWeight: "bold" }}>
          Xác nhận xóa
        </DialogTitle>
        <DialogContent dividers>
          <Typography>
            Bạn có chắc chắn muốn xóa shipper{" "}
            <b>{selectedShipper?.fullname}</b> không?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Hủy</Button>
          <Button variant="contained" color="error" onClick={confirmDelete}>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
      {/* Form thêm shipper */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="md" fullWidth>
        <DialogTitle style={{ color: "#116AD1", fontWeight: "bold" }}>
          Thêm Shipper mới
        </DialogTitle>
        <DialogContent dividers>
          <div className="grid grid-cols-2 gap-4">
            <TextField fullWidth label="Căn cước công dân" variant="outlined" required />
            <TextField fullWidth label="Mặt trước căn cước công dân" type="file" InputLabelProps={{ shrink: true }} required />
            <TextField fullWidth label="Ảnh chân dung" type="file" InputLabelProps={{ shrink: true }} required />
            <TextField fullWidth label="Ảnh đăng ký" type="file" InputLabelProps={{ shrink: true }} required />
            <TextField fullWidth label="Ảnh giấy khám sức khỏe" type="file" InputLabelProps={{ shrink: true }} required />
            <TextField fullWidth label="Số điện thoại" variant="outlined" required />
            <TextField fullWidth label="Email" variant="outlined" required />
            <TextField fullWidth label="Mật khẩu" type="password" variant="outlined" required />
            <TextField fullWidth label="Họ và tên" variant="outlined" required />
            <TextField fullWidth label="Tên phương tiện" variant="outlined" required />
            <TextField fullWidth label="Biển số xe" variant="outlined" required />
            <TextField fullWidth label="Khu vực (Thành phố)" variant="outlined" required />
            <TextField fullWidth label="Khu vực (Xã/Phường)" variant="outlined" required />
            <TextField fullWidth label="Ngân hàng" variant="outlined" required />
            <TextField fullWidth label="Số tài khoản" variant="outlined" required />
            <TextField fullWidth label="Chủ tài khoản" variant="outlined" required />
          </div>
          <div className="flex justify-end mt-6">
            <Button onClick={() => setOpenForm(false)} color="error">
              Hủy
            </Button>
            <Button
              variant="contained"
              style={{ backgroundColor: "#116AD1", marginLeft: "10px" }}
              onClick={() => setOpenForm(false)}
            >
                Thêm mới
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShipperManagement;