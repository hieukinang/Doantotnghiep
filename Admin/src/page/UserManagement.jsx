import React, { useState, useEffect } from 'react'
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
  Chip,
  Alert,
  CircularProgress
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

const roles = [
  { key: 'customer', label: 'Khách hàng', color: 'primary' },
  { key: 'vendor', label: 'Người bán', color: 'secondary' },
  { key: 'shipper', label: 'Shipper', color: 'success' },
]

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState('customer');
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userForm, setUserForm] = useState({ 
    name: "", 
    email: "", 
    phone: "", 
    role: "customer" 
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [role]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      let endpoint = 'http://localhost:5000/api/clients';
      
      if (role === 'vendor') {
        endpoint = 'http://localhost:5000/api/stores';
      } else if (role === 'shipper') {
        endpoint = 'http://localhost:5000/api/shippers';
      }

      const response = await fetch(endpoint);
      const data = await response.json();
      
      if (response.ok) {
        setUsers(data.data || []);
      } else {
        throw new Error(data.message || 'Lỗi khi tải dữ liệu');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Không thể tải dữ liệu người dùng');
      // Set mock data on error
      setUsers(Array.from({ length: 8 }).map((_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@mail.com`,
        phone: `090123456${i}`,
        role,
        status: i % 2 === 0 ? 'active' : 'inactive'
      })));
    } finally {
      setLoading(false);
    }
  };

  // Menu hành động
  const handleMenuClick = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };
  const handleMenuClose = () => setAnchorEl(null);

  // Xem chi tiết
  const handleDetail = () => {
    setOpenDetail(true);
    handleMenuClose();
  };

  // Cập nhật
  const handleUpdate = () => {
    setUserForm({ 
      name: selectedUser.name || selectedUser.fullname || "", 
      email: selectedUser.email || "", 
      phone: selectedUser.phone || "",
      role: role
    });
    setOpenUpdate(true);
    handleMenuClose();
  };

  const handleUpdateSubmit = async () => {
    try {
      // API call to update user
      setSuccess("Cập nhật thành công!");
      setOpenUpdate(false);
      fetchUsers(); // Refresh data
    } catch (error) {
      setError("Lỗi khi cập nhật người dùng");
    }
  };

  // Xóa
  const handleDelete = () => {
    setOpenDelete(true);
    handleMenuClose();
  };

  const confirmDelete = async () => {
    try {
      // API call to delete user
      setSuccess("Xóa thành công!");
      setOpenDelete(false);
      fetchUsers(); // Refresh data
    } catch (error) {
      setError("Lỗi khi xóa người dùng");
    }
  };

  const getRoleLabel = (userRole) => {
    const roleObj = roles.find(r => r.key === userRole);
    return roleObj ? roleObj.label : userRole;
  };

  const getRoleColor = (userRole) => {
    const roleObj = roles.find(r => r.key === userRole);
    return roleObj ? roleObj.color : 'default';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">Quản lý người dùng</h2>
        <div className="flex items-center gap-4">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {roles.map((r) => (
              <option key={r.key} value={r.key}>{r.label}</option>
            ))}
          </select>
          <Button
            variant="contained"
            style={{ backgroundColor: "#116AD1" }}
            onClick={() => setOpenForm(true)}
          >
            + Thêm {getRoleLabel(role)}
          </Button>
        </div>
      </div>

      {error && (
        <Alert severity="error" onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}

      <div className="overflow-auto border rounded-lg">
        <TableContainer component={Paper}>
          <Table>
            <TableHead style={{ backgroundColor: "#116AD1" }}>
              <TableRow>
                <TableCell style={{ color: "white" }}>Tên</TableCell>
                <TableCell style={{ color: "white" }}>Email</TableCell>
                <TableCell style={{ color: "white" }}>Số điện thoại</TableCell>
                <TableCell style={{ color: "white" }}>Vai trò</TableCell>
                <TableCell style={{ color: "white" }}>Trạng thái</TableCell>
                <TableCell style={{ color: "white" }}>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name || user.fullname || 'N/A'}</TableCell>
                  <TableCell>{user.email || 'N/A'}</TableCell>
                  <TableCell>{user.phone || 'N/A'}</TableCell>
                  <TableCell>
                    <Chip 
                      label={getRoleLabel(role)} 
                      color={getRoleColor(role)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={user.status === 'active' ? 'Hoạt động' : 'Không hoạt động'} 
                      color={user.status === 'active' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={(e) => handleMenuClick(e, user)}>
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Menu hành động */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleDetail}>
          <VisibilityIcon className="mr-2" fontSize="small" />
          Xem chi tiết
        </MenuItem>
        <MenuItem onClick={handleUpdate}>
          <EditIcon className="mr-2" fontSize="small" />
          Cập nhật
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <DeleteIcon className="mr-2" fontSize="small" />
          Xóa
        </MenuItem>
      </Menu>

      {/* Popup thêm */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle style={{ color: "#116AD1" }}>Thêm {getRoleLabel(role)} mới</DialogTitle>
        <DialogContent dividers>
          <div className="grid grid-cols-1 gap-4">
            <TextField
              fullWidth
              label="Tên"
              value={userForm.name}
              onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={userForm.email}
              onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
            />
            <TextField
              fullWidth
              label="Số điện thoại"
              value={userForm.phone}
              onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
            />
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
              Lưu
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Popup cập nhật */}
      <Dialog open={openUpdate} onClose={() => setOpenUpdate(false)} maxWidth="sm" fullWidth>
        <DialogTitle style={{ color: "#116AD1" }}>Cập nhật {getRoleLabel(role)}</DialogTitle>
        <DialogContent dividers>
          <div className="grid grid-cols-1 gap-4">
            <TextField
              fullWidth
              label="Tên"
              value={userForm.name}
              onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={userForm.email}
              onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
            />
            <TextField
              fullWidth
              label="Số điện thoại"
              value={userForm.phone}
              onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
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
        <DialogTitle style={{ color: "#116AD1" }}>Chi tiết {getRoleLabel(role)}</DialogTitle>
        <DialogContent dividers>
          {selectedUser && (
            <>
              <Typography><b>Tên:</b> {selectedUser.name || selectedUser.fullname || 'N/A'}</Typography>
              <Typography><b>Email:</b> {selectedUser.email || 'N/A'}</Typography>
              <Typography><b>Số điện thoại:</b> {selectedUser.phone || 'N/A'}</Typography>
              <Typography><b>Vai trò:</b> {getRoleLabel(role)}</Typography>
              <Typography><b>Trạng thái:</b> {selectedUser.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}</Typography>
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
            Bạn có chắc chắn muốn xóa {getRoleLabel(role).toLowerCase()} <b>{selectedUser?.name || selectedUser?.fullname}</b> không?
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
  )
}

export default UserManagement