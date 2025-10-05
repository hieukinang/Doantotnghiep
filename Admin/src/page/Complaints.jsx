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
  CircularProgress,
  Box
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDetail, setOpenDetail] = useState(false);
  const [openResolve, setOpenResolve] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resolution, setResolution] = useState("");

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/complaints');
      const data = await response.json();
      
      if (response.ok) {
        setComplaints(data.data || []);
      } else {
        throw new Error(data.message || 'Lỗi khi tải dữ liệu');
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
      setError('Không thể tải dữ liệu khiếu nại');
      // Set mock data on error
      setComplaints(Array.from({ length: 8 }).map((_, i) => ({
        id: i + 1,
        orderId: `DH${1000 + i}`,
        buyer: `Buyer ${i + 1}`,
        content: 'Hàng nhận không đúng mô tả',
        status: i % 2 === 0 ? 'new' : 'processing',
        createdAt: new Date().toISOString(),
        order: {
          id: `DH${1000 + i}`,
          totalAmount: (i + 1) * 500000
        }
      })));
    } finally {
      setLoading(false);
    }
  };

  // Menu hành động
  const handleMenuClick = (event, complaint) => {
    setAnchorEl(event.currentTarget);
    setSelectedComplaint(complaint);
  };
  const handleMenuClose = () => setAnchorEl(null);

  // Xem chi tiết
  const handleDetail = () => {
    setOpenDetail(true);
    handleMenuClose();
  };

  // Đánh dấu xử lý
  const handleResolve = () => {
    setOpenResolve(true);
    handleMenuClose();
  };

  const confirmResolve = async () => {
    try {
      // API call to resolve complaint
      const response = await fetch(`http://localhost:5000/api/complaints/${selectedComplaint.id}/resolve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ 
          status: 'resolved',
          resolution: resolution
        })
      });

      if (response.ok) {
        setSuccess("Đánh dấu xử lý thành công!");
        setOpenResolve(false);
        setResolution("");
        fetchComplaints(); // Refresh data
      } else {
        throw new Error('Lỗi khi xử lý khiếu nại');
      }
    } catch (error) {
      setError("Lỗi khi xử lý khiếu nại");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'error';
      case 'processing':
        return 'warning';
      case 'resolved':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'new':
        return 'Mới';
      case 'processing':
        return 'Đang xử lý';
      case 'resolved':
        return 'Đã xử lý';
      default:
        return status;
    }
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
        <h2 className="text-2xl font-semibold text-gray-800">Khiếu nại người mua</h2>
        <Button
          variant="contained"
          style={{ backgroundColor: "#116AD1" }}
          onClick={fetchComplaints}
        >
          Làm mới
        </Button>
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
                <TableCell style={{ color: "white" }}>Mã đơn</TableCell>
                <TableCell style={{ color: "white" }}>Người mua</TableCell>
                <TableCell style={{ color: "white" }}>Nội dung</TableCell>
                <TableCell style={{ color: "white" }}>Trạng thái</TableCell>
                <TableCell style={{ color: "white" }}>Ngày tạo</TableCell>
                <TableCell style={{ color: "white" }}>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {complaints.map((complaint) => (
                <TableRow key={complaint.id}>
                  <TableCell>
                    <Typography variant="subtitle2" className="font-medium">
                      {complaint.orderId || complaint.order?.id || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>{complaint.buyer || 'N/A'}</TableCell>
                  <TableCell>
                    <Typography variant="body2" className="max-w-xs truncate">
                      {complaint.content || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={getStatusLabel(complaint.status)} 
                      color={getStatusColor(complaint.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(complaint.createdAt).toLocaleDateString('vi-VN')}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={(e) => handleMenuClick(e, complaint)}>
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {complaints.length === 0 && !loading && (
        <div className="text-center py-8">
          <Typography variant="h6" color="textSecondary">
            Không có khiếu nại nào
          </Typography>
        </div>
      )}

      {/* Menu hành động */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleDetail}>
          <VisibilityIcon className="mr-2" fontSize="small" />
          Xem chi tiết
        </MenuItem>
        <MenuItem onClick={handleResolve}>
          <CheckCircleIcon className="mr-2" fontSize="small" />
          Đánh dấu xử lý
        </MenuItem>
      </Menu>

      {/* Popup xem chi tiết */}
      <Dialog open={openDetail} onClose={() => setOpenDetail(false)} maxWidth="md" fullWidth>
        <DialogTitle style={{ color: "#116AD1" }}>Chi tiết khiếu nại</DialogTitle>
        <DialogContent dividers>
          {selectedComplaint && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Box>
                  <Typography variant="subtitle2" className="font-semibold mb-1">
                    Mã đơn hàng:
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    {selectedComplaint.orderId || selectedComplaint.order?.id || 'N/A'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" className="font-semibold mb-1">
                    Người mua:
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    {selectedComplaint.buyer || 'N/A'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" className="font-semibold mb-1">
                    Trạng thái:
                  </Typography>
                  <Chip 
                    label={getStatusLabel(selectedComplaint.status)} 
                    color={getStatusColor(selectedComplaint.status)}
                    size="small"
                  />
                </Box>
                <Box>
                  <Typography variant="subtitle2" className="font-semibold mb-1">
                    Ngày tạo:
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    {new Date(selectedComplaint.createdAt).toLocaleString('vi-VN')}
                  </Typography>
                </Box>
              </div>
              <Box>
                <Typography variant="subtitle2" className="font-semibold mb-2">
                  Nội dung khiếu nại:
                </Typography>
                <Typography variant="body2" className="text-gray-700 bg-gray-50 p-3 rounded">
                  {selectedComplaint.content || 'Không có nội dung'}
                </Typography>
              </Box>
              {selectedComplaint.resolution && (
                <Box>
                  <Typography variant="subtitle2" className="font-semibold mb-2">
                    Giải pháp:
                  </Typography>
                  <Typography variant="body2" className="text-gray-700 bg-green-50 p-3 rounded">
                    {selectedComplaint.resolution}
                  </Typography>
                </Box>
              )}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetail(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Popup đánh dấu xử lý */}
      <Dialog open={openResolve} onClose={() => setOpenResolve(false)} maxWidth="sm" fullWidth>
        <DialogTitle style={{ color: "green" }}>Đánh dấu xử lý</DialogTitle>
        <DialogContent dividers>
          <Typography className="mb-4">
            Bạn có chắc chắn muốn đánh dấu khiếu nại <b>{selectedComplaint?.orderId}</b> đã được xử lý không?
          </Typography>
          <TextField
            fullWidth
            label="Giải pháp xử lý"
            multiline
            rows={4}
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            placeholder="Nhập giải pháp xử lý khiếu nại..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenResolve(false)}>Hủy</Button>
          <Button variant="contained" color="success" onClick={confirmResolve}>
            Xác nhận xử lý
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default Complaints


