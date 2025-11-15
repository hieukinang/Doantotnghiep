import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import UploadImage from '../component/upload-image';
import config from '../shipper-context/config';


const Register = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    citizen_id: '',
    work_area_city: '',
    work_area_village: '',
    vehicle_name: 'motorcycle',
    license_plate: '',
    bank_name: '',
    bank_account_number: '',
    bank_account_holder_name: '',
    id_image: null,
    image: null,
    profile_image: null,
    health_image: null,
    password: '',
    confirmPassword: ''
  });


  const cities = [
    'Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ',
    'An Giang', 'Bà Rịa - Vũng Tàu', 'Bắc Giang', 'Bắc Kạn', 'Bạc Liêu',
    'Bắc Ninh', 'Bến Tre', 'Bình Định', 'Bình Dương', 'Bình Phước',
    'Bình Thuận', 'Cà Mau', 'Cao Bằng', 'Đắk Lắk', 'Đắk Nông',
    'Điện Biên', 'Đồng Nai', 'Đồng Tháp', 'Gia Lai', 'Hà Giang',
    'Hà Nam', 'Hà Tĩnh', 'Hải Dương', 'Hậu Giang', 'Hòa Bình',
    'Hưng Yên', 'Khánh Hòa', 'Kiên Giang', 'Kon Tum', 'Lai Châu',
    'Lâm Đồng', 'Lạng Sơn', 'Lào Cai', 'Long An', 'Nam Định',
    'Nghệ An', 'Ninh Bình', 'Ninh Thuận', 'Phú Thọ', 'Phú Yên',
    'Quảng Bình', 'Quảng Nam', 'Quảng Ngãi', 'Quảng Ninh', 'Quảng Trị',
    'Sóc Trăng', 'Sơn La', 'Tây Ninh', 'Thái Bình', 'Thái Nguyên',
    'Thanh Hóa', 'Thừa Thiên Huế', 'Tiền Giang', 'Trà Vinh', 'Tuyên Quang',
    'Vĩnh Long', 'Vĩnh Phúc', 'Yên Bái'
  ];


  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };


  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp!');
      return;
    }

    const data = new FormData();

    // Thêm các field dạng text
    data.append("citizen_id", formData.citizen_id);
    data.append("phone", formData.phone);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("confirmPassword", formData.confirmPassword);
    data.append("fullname", formData.fullname);
    data.append("vehicle_name", formData.vehicle_name);
    data.append("license_plate", formData.license_plate);
    data.append("work_area_city", formData.work_area_city);
    data.append("work_area_village", formData.work_area_village);
    data.append("bank_name", formData.bank_name);
    data.append("bank_account_number", formData.bank_account_number);
    data.append("bank_account_holder_name", formData.bank_account_holder_name);

    // Thêm ảnh (nếu có chọn)
    if (formData.id_image) {
      data.append("id_image", {
        uri: formData.id_image,   // dạng file://...
        type: "image/jpeg",
        name: "id_image.jpg"
      });
    }

    if (formData.image) {
      data.append("image", {
        uri: formData.image,
        type: "image/jpeg",
        name: "vehicle.jpg"
      });
    }

    if (formData.profile_image) {
      data.append("profile_image", {
        uri: formData.profile_image,
        type: "image/jpeg",
        name: "profile.jpg"
      });
    }

    if (formData.health_image) {
      data.append("health_image", {
        uri: formData.health_image,
        type: "image/jpeg",
        name: "health.jpg"
      });
    }

    try {
      const res = await axios.post(`${config.backendUrl}/shippers/register`, data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      Alert.alert("Thành công", "Đăng ký thành công!");
      console.log("Register response:", res.data);
      navigation.navigate("Login");

    } catch (err) {
      console.error(err);
      Alert.alert("Lỗi", err.response?.data?.message || "Đăng ký thất bại, vui lòng thử lại!");
    }
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>ĐĂNG KÝ SHIPPER</Text>

      <View style={styles.form}>
        <TextInput
          placeholder="Họ và tên"
          value={formData.fullname}
          onChangeText={(text) => handleChange('fullname', text)}
          keyboardType="default"
          style={styles.input}
        />
        <TextInput
          placeholder="Email"
          value={formData.email}
          onChangeText={(text) => handleChange('email', text)}
          style={styles.input}
          keyboardType="email-address"
        />
        <TextInput
          placeholder="Số điện thoại"
          value={formData.phone}
          onChangeText={(text) => handleChange('phone', text)}
          style={styles.input}
          keyboardType="phone-pad"
        />
        {/* Password */}
        <TextInput
          placeholder="Mật khẩu"
          value={formData.password}
          onChangeText={(text) => handleChange('password', text)}
          style={styles.input}
          secureTextEntry
        />
        <TextInput
          placeholder="Xác nhận mật khẩu"
          value={formData.confirmPassword}
          onChangeText={(text) => handleChange('confirmPassword', text)}
          style={styles.input}
          secureTextEntry
        />
        <TextInput
          placeholder="Số CMND/CCCD"
          value={formData.citizen_id}
          onChangeText={(text) => handleChange('citizen_id', text)}
          style={styles.input}
        />

        {/* Picker cho tỉnh/thành */}
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.work_area_city}
            onValueChange={(value) => handleChange('work_area_city', value)}
          >
            <Picker.Item label="Chọn tỉnh/thành phố" value="" />
            {cities.map(city => (
              <Picker.Item key={city} label={city} value={city} />
            ))}
          </Picker>
        </View>

        <TextInput
          placeholder="Xã/Phường/Thị trấn"
          value={formData.work_area_village}
          onChangeText={(text) => handleChange('work_area_village', text)}
          keyboardType="default"
          style={styles.input}
        />

        {/* Loại phương tiện */}
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.vehicle_name}
            onValueChange={(value) => handleChange('vehicle_name', value)}
          >
            <Picker.Item label="Xe máy" value="motorcycle" />
            <Picker.Item label="Xe đạp" value="bicycle" />
            <Picker.Item label="Ô tô" value="car" />
          </Picker>
        </View>

        <TextInput
          placeholder="Biển số xe"
          value={formData.license_plate}
          onChangeText={(text) => handleChange('license_plate', text)}
          style={styles.input}
        />

        {/* Bank info */}
        <TextInput
          placeholder="Tên ngân hàng"
          value={formData.bank_name}
          onChangeText={(text) => handleChange('bank_name', text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Số tài khoản ngân hàng"
          value={formData.bank_account_number}
          onChangeText={(text) => handleChange('bank_account_number', text)}
          style={styles.input}
          keyboardType="numeric"
        />
        <TextInput
          placeholder="Chủ tài khoản ngân hàng"
          value={formData.bank_account_holder_name}
          onChangeText={(text) => handleChange('bank_account_holder_name', text)}
          keyboardType="default"
          style={styles.input}
        />

        {/* Upload hình ảnh - bạn có thể dùng ImagePicker */}
        <UploadImage
          label="Ảnh CMND/CCCD"
          value={formData.id_image}
          onChange={(uri) => handleChange('id_image', uri)}
        />

        <UploadImage
          label="Ảnh phương tiện"
          value={formData.image}
          onChange={(uri) => handleChange('image', uri)}
        />

        <UploadImage
          label="Ảnh hồ sơ"
          value={formData.profile_image}
          onChange={(uri) => handleChange('profile_image', uri)}
        />

        <UploadImage
          label="Ảnh giấy khám sức khỏe"
          value={formData.health_image}
          onChange={(uri) => handleChange('health_image', uri)}
        />

        

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Đăng ký Shipper</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Đã có tài khoản?
            <Text style={styles.link} onPress={() => navigation.navigate('Login')}> Đăng nhập</Text>
          </Text>
        </View>
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#f5f5f5' },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 16, color: '#116AD1' },
  form: { backgroundColor: 'white', padding: 16, borderRadius: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 12, marginBottom: 12 },
  pickerContainer: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, marginBottom: 12 },
  button: { backgroundColor: '#116AD1', padding: 14, borderRadius: 6, alignItems: 'center', marginTop: 8 },
  buttonText: { color: 'white', fontWeight: 'bold' },
  footer: { marginTop: 12, alignItems: 'center' },
  footerText: { color: '#666' },
  link: { color: '#116AD1', fontWeight: 'bold' }
});

export default Register;
