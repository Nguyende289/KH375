
import { UserProfile } from '../types';

// URL Google Apps Script CHÍNH XÁC của bạn
export const SCRIPT_URL: string = "https://script.google.com/macros/s/AKfycbzskGFJ3aP0CrNM1O-yjChob0EuyEbmWD36lsT2qt6xz8fY8qJFxskqwdBDKr8E7lMA/exec";

export const uploadProfileToDrive = async (profile: UserProfile): Promise<{ success: boolean; url?: string; message?: string }> => {
  // Kiểm tra URL
  if (!SCRIPT_URL || SCRIPT_URL.includes("HAY_THAY_THE")) {
    return { success: false, message: "Chưa cấu hình URL Google Script!" };
  }

  try {
    // Gửi request POST đến Google Script
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(profile),
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
    });

    const data = await response.json();
    
    if (data.result === "success") {
      return { success: true, url: data.url };
    } else {
      return { success: false, message: data.message || "Lỗi từ Google Script" };
    }
  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, message: "Lỗi kết nối mạng. Vui lòng thử lại." };
  }
};
