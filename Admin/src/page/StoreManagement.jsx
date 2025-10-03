import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const StoreManagement = () => {
  const [stores, setStores] = useState([
    { id: 1, name: "Cửa hàng A", address: "Hà Nội", owner: "Nguyễn Văn A" },
    { id: 2, name: "Cửa hàng B", address: "TP.HCM", owner: "Trần Thị B" },
  ]);

  const [openForm, setOpenForm] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null);
  const [storeForm, setStoreForm] = useState({ name: "", address: "", owner: "" });

  // Menu hành động
  const handleMenuClick = (event, store) => {
    setAnchorEl(event.currentTarget);
    setSelectedStore(store);
  };
  const handleMenuClose = () => setAnchorEl(null);

  // Xem chi tiết
  const handleDetail = () => {
    setOpenDetail(true);
    handleMenuClose();
  };

  // Cập nhật
  const handleUpdate = () => {
    setStoreForm({ ...selectedStore });
    setOpenUpdate(true);
    handleMenuClose();
  };
  const handleUpdateSubmit = () => {
    setStores(stores.map((s) => (s.id === storeForm.id ? storeForm : s)));
    setOpenUpdate(false);
  };

  // Xóa
  const handleDelete = () => {
    setOpenDelete(true);
    handleMenuClose();
  };
  const confirmDelete = () => {
    setStores(stores.filter((s) => s.id !== selectedStore.id));
    setOpenDelete(false);
  };

  // Thêm cửa hàng
  const handleAddStore = () => {
    setStores([...stores, { ...storeForm, id: Date.now() }]);
    setStoreForm({ name: "", address: "", owner: "" });
    setOpenForm(false);
  };

  return (
    <div className="p-6">
      {/* Nút thêm */}
      <div className="flex justify-end mb-4">
        <Button
          variant="contained"
          style={{ backgroundColor: "#116AD1" }}
          onClick={() => setOpenForm(true)}
        >
          + Thêm Cửa hàng
        </Button>
      </div>

      {/* Bảng danh sách */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead style={{ backgroundColor: "#116AD1" }}>
            <TableRow>
              <TableCell style={{ color: "white" }}>Tên cửa hàng</TableCell>
              <TableCell style={{ color: "white" }}>Địa chỉ</TableCell>
              <TableCell style={{ color: "white" }}>Chủ cửa hàng</TableCell>
              <TableCell style={{ color: "white" }}>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stores.map((store) => (
              <TableRow key={store.id}>
                <TableCell>{store.name}</TableCell>
                <TableCell>{store.address}</TableCell>
                <TableCell>{store.owner}</TableCell>
                <TableCell>
                  <IconButton onClick={(e) => handleMenuClick(e, store)}>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Menu hành động */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleDetail}>Xem chi tiết</MenuItem>
        <MenuItem onClick={handleUpdate}>Cập nhật</MenuItem>
        <MenuItem onClick={handleDelete}>Xóa</MenuItem>
      </Menu>

      {/* Popup thêm */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle style={{ color: "#116AD1" }}>Thêm Cửa hàng mới</DialogTitle>
        <DialogContent dividers>
          <div className="grid grid-cols-1 gap-4">
            <TextField
              fullWidth
              label="Tên cửa hàng"
              value={storeForm.name}
              onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
            />
            <TextField
              fullWidth
              label="Địa chỉ"
              value={storeForm.address}
              onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })}
            />
            <TextField
              fullWidth
              label="Chủ cửa hàng"
              value={storeForm.owner}
              onChange={(e) => setStoreForm({ ...storeForm, owner: e.target.value })}
            />
          </div>
          <div className="flex justify-end mt-6">
            <Button onClick={() => setOpenForm(false)} color="error">
              Hủy
            </Button>
            <Button
              variant="contained"
              style={{ backgroundColor: "#116AD1", marginLeft: "10px" }}
              onClick={handleAddStore}
            >
              Lưu
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Popup cập nhật */}
      <Dialog open={openUpdate} onClose={() => setOpenUpdate(false)} maxWidth="sm" fullWidth>
        <DialogTitle style={{ color: "#116AD1" }}>Cập nhật Cửa hàng</DialogTitle>
        <DialogContent dividers>
          <div className="grid grid-cols-1 gap-4">
            <TextField
              fullWidth
              label="Tên cửa hàng"
              value={storeForm.name}
              onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
            />
            <TextField
              fullWidth
              label="Địa chỉ"
              value={storeForm.address}
              onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })}
            />
            <TextField
              fullWidth
              label="Chủ cửa hàng"
              value={storeForm.owner}
              onChange={(e) => setStoreForm({ ...storeForm, owner: e.target.value })}
            />
          </div>
          <div className="flex justify-end mt-6">
            <Button onClick={() => setOpenUpdate(false)} color="error">
              Hủy
            </Button>
            <Button
              variant="contained"
              style={{ backgroundColor: "#116AD1", marginLeft: "10px" }}
              onClick={handleUpdateSubmit}
            >
              Lưu
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Popup xem chi tiết */}
      <Dialog open={openDetail} onClose={() => setOpenDetail(false)} maxWidth="sm" fullWidth>
        <DialogTitle style={{ color: "#116AD1" }}>Chi tiết Cửa hàng</DialogTitle>
        <DialogContent dividers>
          {selectedStore && (
            <>
              <Typography>
                <b>Tên cửa hàng:</b> {selectedStore.name}
              </Typography>
              <Typography>
                <b>Địa chỉ:</b> {selectedStore.address}
              </Typography>
              <Typography>
                <b>Chủ cửa hàng:</b> {selectedStore.owner}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetail(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Popup xóa */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)} maxWidth="xs" fullWidth>
        <DialogTitle style={{ color: "red" }}>Xác nhận xóa</DialogTitle>
        <DialogContent dividers>
          <Typography>
            Bạn có chắc chắn muốn xóa cửa hàng <b>{selectedStore?.name}</b> không?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Hủy</Button>
          <Button variant="contained" color="error" onClick={confirmDelete}>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default StoreManagement;