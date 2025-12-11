// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// Import Shipper screens
import Login from './page/login';
import Register from './page/register';
import MapScreen from './page/map-screen';
import DeliveryHistoryScreen from './page/delivery-history';
import WalletScreen from './page/wallet';
import TakeanOrder from './page/takeanorder';
import OrderDetail from './page/order-detail';
import Profile from './page/profile';
import ChatListScreen from './page/chat-list';
import ChatRoomScreen from './page/chat-room';
import { AuthProvider } from './shipper-context/auth-context';
import { ChatProvider } from './shipper-context/ChatContext';
import PaymentSuccess from './page/paymentsuccess';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ChatProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
              {/* Shipper Screens */}
              <Stack.Screen
                name="Login"
                component={Login}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Register"
                component={Register}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="MapScreen"
                component={MapScreen}
                options={{ headerShown: false }}
              />

              {/* Thêm các màn hình mới */}
              <Stack.Screen
                name="DeliveryHistory"
                component={DeliveryHistoryScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Wallet"
                component={WalletScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="TakeanOrder"
                component={TakeanOrder}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="OrderDetail"
                component={OrderDetail}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Profile"
                component={Profile}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="PaymentSuccess"
                component={PaymentSuccess}
                options={{ headerShown: false }}
              />
              
              {/* Chat Screens */}
              <Stack.Screen
                name="ChatList"
                component={ChatListScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="ChatRoom"
                component={ChatRoomScreen}
                options={{ headerShown: false }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </ChatProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
