import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import logo from '../../assets/icon.png';
import { useAuth } from '../shipper-context/auth-context'; // sửa đường dẫn cho đúng
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from '../shipper-context/config';
import axiosInstance from '../shipper-context/axiosInstance'; // dùng cho ngrok tunnel
import chatService from '../shipper-context/chatService';
import { MaterialIcons } from "@expo/vector-icons";


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
      // === DÙNG KHI CHẠY LOCAL (IP LAN) ===
      const res = await axios.post(
        `${config.backendUrl}/shippers/login`,
        {
          emailOrPhone: formData.emailOrPhone,
          password: formData.password,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      // === DÙNG KHI CHẠY NGROK TUNNEL ===
      // const res = await axiosInstance.post(
      //   '/shippers/login',
      //   {
      //     emailOrPhone: formData.emailOrPhone,
      //     password: formData.password,
      //   },
      //   { headers: { "Content-Type": "application/json" } }
      // );

      console.log("LOGIN RESPONSE:", res.data);

      if (res.status === 200 && res.data.status === "success") {
        const user = res.data?.data?.user;
        const token = res.data?.token;
        const shipperId = user?.id;

        if (!shipperId) {
          Alert.alert("Error", "Không tìm thấy ID trong phản hồi từ server");
          return;
        }

        // lưu id vào AsyncStorage
        await AsyncStorage.setItem("shipperId", shipperId.toString());
        console.log("Saved shipperId to AsyncStorage:", shipperId);

        // lưu vào context
        await signIn({ id: shipperId, token }, true);
        console.log("SignIn completed");

        // Tạo chat account nếu chưa có (cho user cũ)
        // === TẠM TẮT KHI DÙNG NGROK (chat server chưa expose) ===
        // try {
        //   const chatUserId = shipperId; // shipperId đã có format SHIPPER... rồi
        //   await chatService.createChatAccount(chatUserId, user.fullname || user.name || 'Shipper');
        //   console.log("Chat account ensured:", chatUserId);
        // } catch (chatErr) {
        //   // Ignore nếu đã tồn tại hoặc lỗi khác
        //   console.log("Chat account check:", chatErr.response?.data?.message || chatErr.message);
        // }

        console.log("About to navigate to MapScreen");
        Alert.alert("Success", "Đăng nhập thành công!");
        navigation.replace("MapScreen");
        console.log("Navigation called");
      } else {
        Alert.alert("Error", res.data?.message || "Sai thông tin đăng nhập");
      }
    } catch (err) {
      console.error("LOGIN ERROR:", err.response?.data || err.message);
      const msg = err.response?.data?.message || "Lỗi server, thử lại sau!";
      Alert.alert("Error", msg);
    }
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>KOHI MALL</Text>
        </View>
        <Text style={styles.headerSubTitle}>ĐĂNG NHẬP SHIPPER</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Left */}
        <View style={styles.left}>
          <MaterialIcons name="local-shipping" style={styles.icon} />
          <Text style={styles.subtitle}>Giao hàng chuyên nghiệp</Text>
          <Text style={styles.desc}>Tham gia đội ngũ shipper của KOHI MALL</Text>
        </View>

        {/* Right */}
        <View style={styles.right }>
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
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', marginTop: 10 },
  headerSubTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  content: { flexDirection: 'column', padding: 16, alignItems: 'center' },
  left: { alignItems: 'center', marginBottom: 16 },
  icon: { fontSize: 60, color:"#116AD1", margin:12 },
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
