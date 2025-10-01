import React, { useState } from 'react';
import { View, Button, Image, StyleSheet, Text, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function UploadImage({ label, value, onChange }) {
    const [localImage, setLocalImage] = useState(value);

    const pickImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Bạn cần cấp quyền để chọn ảnh!");
                console.log("Permission denied:", status);
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images, // ✅ dùng MediaTypeOptions
                allowsEditing: true,
                quality: 1,
            });

            console.log("Pick result:", result);

            if (!result.canceled && result.assets?.length > 0) {
                const uri = result.assets[0].uri;
                setLocalImage(uri);
                if (onChange) onChange(uri);
            }
        } catch (error) {
            console.error("Image picker error:", error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <Button title="Chọn ảnh" onPress={pickImage} />
            {localImage && (
                <Image source={{ uri: localImage }} style={styles.imagePreview} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { marginVertical: 8 },
    label: { marginBottom: 4, fontWeight: "bold" },
    imagePreview: { width: 120, height: 120, marginTop: 8, borderRadius: 8 },
});
