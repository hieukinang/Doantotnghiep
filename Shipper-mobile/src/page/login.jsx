import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import logo from '../../assets/icon.png';
import { useAuth } from '../shipper-context/auth-context'; // sửa đường dẫn cho đúng

const backendUrl = 'http://10.0.2.2:5000/api';

const Login = () => {
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: ''
  });
  const navigation = useNavigation();
  const { signIn } = useAuth(); // dùng signIn để lưu global state + persist

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        `${backendUrl}/shippers/login`,
        {
          emailOrPhone: formData.emailOrPhone,
          password: formData.password,
        },
        {
          headers: { "Content-Type": "application/json" }
        }
      );

      // Nếu backend trả 200, parse id và token theo nhiều cấu trúc khác nhau
      if (res.status === 200) {
        const data = res.data || {};

        // Một số backend trả { id, token }, một số trả { user: { id, ... }, token }, hoặc { shipper: { id } }
        const possibleId =
          data.id ||
          data.user?.id ||
          data.userId ||
          data.shipper?.id ||
          data.data?.id ||
          data.result?.id;

        // token nếu có
        const possibleToken = data.token || data.accessToken || data.jwt;

        // Gọi signIn để lưu vào Context (và AsyncStorage bên trong signIn nếu bạn bật persist)
        await signIn({ id: possibleId, token: possibleToken }, true);

        Alert.alert('Success', 'Đăng nhập thành công!');
        navigation.replace('MapScreen'); // replace để không back về login
      } else {
        Alert.alert('Error', res.data?.message || 'Sai thông tin đăng nhập');
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      const msg = err.response?.data?.message || 'Lỗi server, thử lại sau!';
      Alert.alert('Error', msg);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={logo} style={styles.logo} />
          <Text style={styles.headerTitle}>KOHI MALL</Text>
        </View>
        <Text style={styles.headerSubTitle}>ĐĂNG NHẬP SHIPPER</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Left */}
        <View style={styles.left}>
          <Text style={styles.truck}>🚚</Text>
          <Text style={styles.subtitle}>Giao hàng chuyên nghiệp</Text>
          <Text style={styles.desc}>Tham gia đội ngũ shipper của KOHI MALL</Text>
        </View>

        {/* Right */}
        <View style={styles.right}>
          <Text style={styles.formTitle}>Đăng nhập vào KOHI MALL</Text>
          <Text style={styles.formSubtitle}>Điền thông tin chi tiết bên dưới</Text>

          <TextInput
            placeholder="Email hoặc số điện thoại"
            value={formData.emailOrPhone}
            onChangeText={(text) => handleChange('emailOrPhone', text)}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            placeholder="Mật khẩu"
            value={formData.password}
            onChangeText={(text) => handleChange('password', text)}
            secureTextEntry
            style={styles.input}
          />

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Log In</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('ShipperForgotPassword')}>
            <Text style={styles.forgot}>Quên mật khẩu?</Text>
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Chưa có tài khoản shipper?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLink}> Đăng ký ngay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#f5f5f5', paddingBottom: 20 },
  header: { backgroundColor: '#116AD1', padding: 16, alignItems: 'center' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  logo: { width: 40, height: 40, marginRight: 8 },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  headerSubTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  content: { flexDirection: 'column', padding: 16, alignItems: 'center' },
  left: { alignItems: 'center', marginBottom: 16 },
  truck: { fontSize: 60, marginBottom: 8 },
  subtitle: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  desc: { fontSize: 16, color: '#555', textAlign: 'center' },
  right: { width: '100%', maxWidth: 400, backgroundColor: 'white', padding: 16, borderRadius: 8 },
  formTitle: { fontSize: 20, fontWeight: 'bold', color: '#116AD1', marginBottom: 4 },
  formSubtitle: { fontSize: 14, color: '#666', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 12, marginBottom: 12 },
  button: { backgroundColor: '#116AD1', padding: 12, borderRadius: 6, alignItems: 'center', marginBottom: 8 },
  buttonText: { color: 'white', fontWeight: 'bold' },
  forgot: { color: '#116AD1', textAlign: 'right', marginBottom: 12 },
  registerContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 4 },
  registerText: { color: '#666' },
  registerLink: { color: '#116AD1', fontWeight: 'bold' },
});

export default Login;
