import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function PaymentSuccess() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.card}>

                {/* Icon success */}
                <Image
                    source={require("../../assets/icon.png")} // hoặc link ảnh online
                    style={styles.icon}
                />

                <Text style={styles.title}>Thanh toán thành công!</Text>

                <Text style={styles.subtitle}>
                    Cảm ơn bạn! Giao dịch đã được xử lý thành công.
                    Ví của bạn sẽ được cập nhật ngay lập tức.
                </Text>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate("Wallet")}
                >
                    <Text style={styles.buttonText}>Về ví của tôi</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f3f4f6",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    card: {
        backgroundColor: "white",
        width: "100%",
        borderRadius: 20,
        padding: 30,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    icon: {
        width: 120,
        height: 120,
        marginBottom: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#111827",
        marginBottom: 10,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 15,
        color: "#6b7280",
        textAlign: "center",
        lineHeight: 22,
        marginBottom: 25,
    },
    button: {
        backgroundColor: "#22c55e",
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 14,
        width: "100%",
        alignItems: "center",
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
});
