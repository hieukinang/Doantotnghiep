import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  MenuItem,
  Alert,
  Card,
  Divider,
} from "@mui/material";
import {
  AccountCircle,
  Lock,
  Email,
  Phone,
  Person,
  Work,
  CalendarToday,
  AttachMoney,
  LocationOn,
  AccountBalance,
  Image,
  VpnKey,
  AccountBalanceWallet,
} from "@mui/icons-material";

const roles = [
  { value: "staff", label: "Nhân viên" },
  { value: "manager", label: "Quản lý" },
];

function CreateAccount() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    phone: "",
    email: "",
    fullName: "",
    role: "staff",
    job_title: "",
    hire_date: "",
    salary: "",
    address: "",
    image: null,
    bank_name: "",
    bank_account_number: "",
    bank_account_holder_name: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedImageName, setSelectedImageName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, image: file }));
    setSelectedImageName(file ? file.name : "");
  };

  const validate = () => {
    let newErrors = {};
    let isValid = true;
    if (!formData.username) {
      newErrors.username = "Tên đăng nhập bắt buộc.";
      isValid = false;
    }
    if (!formData.password) {
      newErrors.password = "Mật khẩu bắt buộc.";
      isValid = false;
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";
      isValid = false;
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ.";
      isValid = false;
    }
    if (!formData.fullName) {
      newErrors.fullName = "Họ và tên bắt buộc.";
      isValid = false;
    }
    if (!formData.role) {
      newErrors.role = "Vai trò bắt buộc.";
      isValid = false;
    }
    if (!formData.job_title) {
      newErrors.job_title = "Chức danh bắt buộc.";
      isValid = false;
    }
    if (!formData.hire_date) {
      newErrors.hire_date = "Ngày thuê bắt buộc.";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    if (!validate()) return;
    setLoading(true);
    try {
      // Tạo FormData đúng chuẩn cho backend
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "fullName") {
          data.append("fullname", value);
        } else if (value !== undefined && value !== null && value !== "") {
          data.append(key, value);
        }
      });
      const res = await fetch("http://localhost:5000/api/admin/register", {
        method: "POST",
        body: data,
      });
      if (!res.ok) {
        let err;
        try {
          err = await res.json();
        } catch {
          err = {};
        }
        throw new Error(err.message || "Đăng ký thất bại");
      }
      setSuccessMessage(
        `Tài khoản "${formData.username}" đã được tạo thành công.`
      );
      setFormData({
        username: "",
        password: "",
        confirmPassword: "",
        phone: "",
        email: "",
        fullName: "",
        role: "staff",
        job_title: "",
        hire_date: "",
        salary: "",
        address: "",
        image: null,
        bank_name: "",
        bank_account_number: "",
        bank_account_holder_name: "",
      });
      setSelectedImageName("");
      setErrors({});
    } catch (err) {
      setSuccessMessage("");
      setErrors({ api: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, py: 4, overflowX: "hidden" }}>
      <Container maxWidth="md">
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold", color: "primary.main" }}
        >
          Tạo Tài Khoản Quản Lý Mới
        </Typography>
        <Typography align="center" color="text.secondary" sx={{ mb: 3 }}>
          Dùng cho Admin tạo tài khoản nhân viên có vai trò thấp hơn.
        </Typography>

        {successMessage && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {successMessage}
          </Alert>
        )}
        {errors.api && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errors.api}
          </Alert>
        )}

        <Card elevation={4} sx={{ p: 4, borderRadius: 3 }}>
          <form onSubmit={handleSubmit}>
            {/* Thông tin đăng nhập */}
            <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
              1. Thông tin Đăng nhập
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Tên đăng nhập"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  error={!!errors.username}
                  helperText={errors.username}
                  InputProps={{
                    startAdornment: <AccountCircle sx={{ mr: 1 }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="email"
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  InputProps={{ startAdornment: <Email sx={{ mr: 1 }} /> }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="password"
                  label="Mật khẩu"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  InputProps={{ startAdornment: <Lock sx={{ mr: 1 }} /> }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="password"
                  label="Xác nhận mật khẩu"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  InputProps={{ startAdornment: <VpnKey sx={{ mr: 1 }} /> }}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* Cá nhân & công việc */}
            <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
              2. Thông tin Cá nhân & Công việc
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Họ và Tên"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  error={!!errors.fullName}
                  helperText={errors.fullName}
                  InputProps={{ startAdornment: <Person sx={{ mr: 1 }} /> }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Số điện thoại"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  InputProps={{ startAdornment: <Phone sx={{ mr: 1 }} /> }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Vai trò"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  error={!!errors.role}
                  helperText={errors.role}
                >
                  {roles.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Chức danh"
                  name="job_title"
                  value={formData.job_title}
                  onChange={handleChange}
                  error={!!errors.job_title}
                  helperText={errors.job_title}
                  InputProps={{ startAdornment: <Work sx={{ mr: 1 }} /> }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Ngày thuê"
                  name="hire_date"
                  value={formData.hire_date}
                  onChange={handleChange}
                  error={!!errors.hire_date}
                  helperText={errors.hire_date}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: <CalendarToday sx={{ mr: 1 }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Mức lương"
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: <AttachMoney sx={{ mr: 1 }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Địa chỉ"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  multiline
                  rows={2}
                  InputProps={{ startAdornment: <LocationOn sx={{ mr: 1 }} /> }}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* Ngân hàng & ảnh */}
            <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
              3. Ngân hàng & Hình ảnh
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Tên ngân hàng"
                  name="bank_name"
                  value={formData.bank_name}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: <AccountBalance sx={{ mr: 1 }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Số tài khoản"
                  name="bank_account_number"
                  value={formData.bank_account_number}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: <AccountBalanceWallet sx={{ mr: 1 }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Chủ tài khoản"
                  name="bank_account_holder_name"
                  value={formData.bank_account_holder_name}
                  onChange={handleChange}
                  InputProps={{ startAdornment: <Person sx={{ mr: 1 }} /> }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<Image />}
                >
                  Tải lên hình ảnh
                  <input
                    type="file"
                    hidden
                    name="image"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Button>
                <Typography variant="body2" sx={{ ml: 2, display: "inline" }}>
                  {selectedImageName || "Chưa chọn file"}
                </Typography>
              </Grid>
            </Grid>

            <Box sx={{ textAlign: "center", mt: 4 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                sx={{ px: 6, borderRadius: 3 }}
                disabled={loading}
              >
                {loading ? "Đang tạo..." : "TẠO TÀI KHOẢN"}
              </Button>
            </Box>
          </form>
        </Card>
      </Container>
    </Box>
  );
}

export default CreateAccount;
