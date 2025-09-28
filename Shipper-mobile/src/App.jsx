// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import Shipper screens
import Login from './page/login';
import Register from './page/register';
// import ShipperOrders from './page/ShipperOrders';
// import ShipperUpdateStatus from './page/ShipperUpdateStatus';
// import ShipperOrderDetail from './page/ShipperOrderDetail';
// import ShipperDeliveryHistory from './page/ShipperDeliveryHistory';
// import ShipperProfile from './page/ShipperProfile';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
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
        {/*<Stack.Screen 
          name="ShipperOrders" 
          component={ShipperOrders} 
          options={{ title: 'Orders' }} 
        />
        <Stack.Screen 
          name="ShipperUpdateStatus" 
          component={ShipperUpdateStatus} 
          options={{ title: 'Update Status' }} 
        />
        <Stack.Screen 
          name="ShipperOrderDetail" 
          component={ShipperOrderDetail} 
          options={{ title: 'Order Detail' }} 
        />
        <Stack.Screen 
          name="ShipperDeliveryHistory" 
          component={ShipperDeliveryHistory} 
          options={{ title: 'Delivery History' }} 
        />
        <Stack.Screen 
          name="ShipperProfile" 
          component={ShipperProfile} 
          options={{ title: 'Profile' }} 
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
