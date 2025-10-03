import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import axios from "axios";

const ShipperDetailScreen = () => {
    const [shipper, setShipper] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchShipper = async () => {
            try {
                const response = await axios.get("http://10.0.2.2:5000/api/shipper/1");
                setShipper(response.data);
            } catch (error) {
                console.error("Lỗi khi gọi API:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchShipper();
    }, []);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (!shipper) {
        return (
            <View style={styles.center}>
                <Text>Không tìm thấy thông tin shipper</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Thông tin Shipper</Text>
            <Text>ID: {shipper.id}</Text>
            <Text>Tên: {shipper.name}</Text>
            <Text>Email: {shipper.email}</Text>
            <Text>Số điện thoại: {shipper.phone}</Text>
            <Text>Địa chỉ: {shipper.address}</Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 15,
    },
});

export default ShipperDetailScreen;
