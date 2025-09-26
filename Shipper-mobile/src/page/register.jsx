import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

const Register = () => {
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    idCard: '',
    city: '',
    district: '',
    address: '',
    vehicleType: 'motorcycle',
    licensePlate: '',
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

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp!');
      return;
    }
    console.log('Shipper registration:', formData);
    Alert.alert('Success', 'Đăng ký thành công!');
    // navigation.navigate('ShipperLogin'); // chuyển sang login nếu cần
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>ĐĂNG KÝ SHIPPER</Text>

      <View style={styles.form}>
        <TextInput
          placeholder="Họ và tên"
          value={formData.fullName}
          onChangeText={(text) => handleChange('fullName', text)}
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
        <TextInput
          placeholder="Số CMND/CCCD"
          value={formData.idCard}
          onChangeText={(text) => handleChange('idCard', text)}
          style={styles.input}
        />

        {/* Picker cho tỉnh/thành */}
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.city}
            onValueChange={(value) => handleChange('city', value)}
          >
            <Picker.Item label="Chọn tỉnh/thành phố" value="" />
            {cities.map(city => (
              <Picker.Item key={city} label={city} value={city} />
            ))}
          </Picker>
        </View>

        <TextInput
          placeholder="Quận/Huyện"
          value={formData.district}
          onChangeText={(text) => handleChange('district', text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Địa chỉ chi tiết"
          value={formData.address}
          onChangeText={(text) => handleChange('address', text)}
          style={[styles.input, { height: 80 }]}
          multiline
        />

        {/* Picker cho loại phương tiện */}
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.vehicleType}
            onValueChange={(value) => handleChange('vehicleType', value)}
          >
            <Picker.Item label="Xe máy" value="motorcycle" />
            <Picker.Item label="Xe đạp" value="bicycle" />
            <Picker.Item label="Ô tô" value="car" />
          </Picker>
        </View>

        <TextInput
          placeholder="Biển số xe"
          value={formData.licensePlate}
          onChangeText={(text) => handleChange('licensePlate', text)}
          style={styles.input}
        />
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
