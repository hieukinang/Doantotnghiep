import bwipjs from 'bwip-js';
import fs from 'fs-extra';
import path from 'path';

export const generateQRCodeJPG = async (text, outFolder, fileName = null) => {
    await fs.ensureDir(outFolder);

    if (!fileName) {
        fileName = `qrcode_${Date.now()}.jpg`;
    }
    if (!fileName.toLowerCase().endsWith(".jpg")) {
        fileName += ".jpg";
    }

    const outputPath = path.join(outFolder, fileName);

    // Xuất QR Code dạng JPEG trực tiếp
    const jpgBuffer = await bwipjs.toBuffer({
        bcid: 'qrcode',        // 💥 Đổi sang QR Code
        text,
        scale: 6,              // Độ lớn (QR nên lớn hơn barcode)
        version: 5,            // (Optional) độ phức tạp QR: 1–40
        includetext: false,    // QR không cần text
        imageformat: 'jpeg',   // Xuất ảnh dạng JPG
        // 🎨 MÀU SẮC
        barcolor: 'ffffff',        // QR trắng
        backgroundcolor: '000000', // nền đen
    });

    await fs.writeFile(outputPath, jpgBuffer);

    return outputPath;
};
