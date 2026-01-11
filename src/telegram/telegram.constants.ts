export const TELEGRAM_MESSAGES = {
  WELCOME: (name: string) => `👋 Xin chào <b>${name}</b>!

🛵 <b>Vehicle Maintenance Tracker Bot</b>
━━━━━━━━━━━━━━━━━
Để bắt đầu, hãy liên kết xe của bạn.

📝 <i>Gửi biển số xe</i> (VD: <code>59A1-12345</code>)

📌 <b>Các lệnh có sẵn:</b>
   ├─ /newvehicle - Tạo xe mới
   ├─ /status - Xem trạng thái
   ├─ /odo - Cập nhật ODO
   └─ /help - Xem hướng dẫn`,

  HELP: `📖 <b>HƯỚNG DẪN SỬ DỤNG</b>
━━━━━━━━━━━━━━━━━

<b>Liên kết xe:</b>
Gửi biển số xe (VD: <code>59A1-12345</code>)

<b>Tạo xe mới:</b>
/newvehicle &lt;tên&gt; | &lt;biển số&gt;
VD: <code>/newvehicle Airblade | 59A1-12345</code>

<b>Cập nhật ODO:</b>
/odo &lt;số km&gt;
VD: <code>/odo 5500</code>

<b>Xem trạng thái:</b>
/status
━━━━━━━━━━━━━━━━━
<b>Ý nghĩa trạng thái:</b>
🔴 <b>QUÁ HẠN</b> - Cần bảo dưỡng ngay
🟡 <b>SẮP ĐẾN</b> - Còn dưới 10%
🟢 <b>OK</b> - Chưa cần bảo dưỡng`,

  ERROR_START_REQUIRED: '❌ <b>Lỗi:</b> Vui lòng gửi /start trước',
  ERROR_NO_VEHICLE: '❌ <b>Chưa liên kết xe</b>\n\n💡 <i>Gửi /start để liên kết</i>',
  ERROR_VEHICLE_NOT_FOUND: (plate: string) =>
    `❌ <b>Không tìm thấy xe</b>\n\n` +
    `Biển số: <code>${plate}</code>\n\n` +
    `💡 <i>Kiểm tra lại hoặc dùng</i> /newvehicle <i>để tạo xe mới</i>`,
  ERROR_SYNTAX_ODO: '❌ <b>Cú pháp:</b> /odo &lt;số km&gt;\nVD: <code>/odo 5500</code>',
  ERROR_SYNTAX_NEW_VEHICLE:
    '❌ <b>Cú pháp:</b> /newvehicle &lt;tên xe&gt; | &lt;biển số&gt;\n\nVD: <code>/newvehicle Airblade | 59A1-12345</code>',
  ERROR_CREATE_VEHICLE: '❌ Lỗi khi tạo xe. Có thể biển số đã tồn tại.',
  ERROR_UNKNOWN: '❌ <b>Lỗi:</b> Đã có lỗi xảy ra. Vui lòng thử lại.',
  ERROR_UPDATE_ODO: '❌ <b>Lỗi:</b> Không thể cập nhật ODO. Vui lòng thử lại.',
  ERROR_GET_STATUS: '❌ <b>Lỗi:</b> Không thể lấy trạng thái. Vui lòng thử lại.',
  UNKNOWN_INPUT: '❓ <i>Không hiểu. Gửi</i> /help <i>để xem hướng dẫn.</i>',

  SUCCESS_LINK: (name: string, plate: string, odo: string) =>
    `✅ <b>Liên kết thành công!</b>\n` +
    `━━━━━━━━━━━━━━━━━\n` +
    `🛵 <b>${name}</b>\n` +
    `📍 Biển số: <code>${plate}</code>\n` +
    `📊 ODO: <code>${odo}</code> km`,

  SUCCESS_CREATE: (name: string, plate: string) =>
    `✅ <b>Tạo xe thành công!</b>\n` +
    `━━━━━━━━━━━━━━━━━\n` +
    `🛵 <b>${name}</b>\n` +
    `📍 Biển số: <code>${plate}</code>\n` +
    `📊 ODO: <code>0</code> km\n\n` +
    `👇 <b>Vui lòng chọn loại xe để áp dụng lịch bảo dưỡng chuẩn:</b>`,

  SUCCESS_ODO: (km: string, statusReport: string) =>
    `✅ <b>Cập nhật ODO thành công!</b>\n` +
    `━━━━━━━━━━━━━━━━━\n` +
    `📊 Số km mới: <code>${km}</code> km\n\n` +
    statusReport,

  STATUS_HEADER: (name: string, plate: string, odo: string) =>
    `📊 <b>TRẠNG THÁI BẢO DƯỠNG</b>\n` +
    `━━━━━━━━━━━━━━━━━\n` +
    `🛵 <b>${name}</b>\n` +
    `📍 Biển số: <code>${plate}</code>\n` +
    `⏳ ODO: <code>${odo}</code> km\n` +
    `━━━━━━━━━━━━━━━━━\n\n`,

  STATUS_ALL_OK: '✅ <b>Tất cả đều OK!</b>\n<i>Chưa có mục nào cần bảo dưỡng.</i>',
  STATUS_EMPTY: `📋 <i>Chưa có cấu hình bảo dưỡng</i>\n` + `💡 <i>Thêm qua API để theo dõi</i>`,

  PROFILE_UPDATED: (name: string) => `✅ <b>Đã cập nhật loại xe:</b> ${name}\nLịch bảo dưỡng đã được áp dụng.`,
  PROFILE_NOT_FOUND: '❌ Loại xe không tồn tại.',
  LINK_PROFILE_ERROR_NO_VEHICLE: '❌ Bạn chưa liên kết với xe nào.',
};

export const TELEGRAM_REGEX = {
  LICENSE_PLATE: /^[\dA-Za-z][\dA-Za-z\s-]{4,15}$/,
  ACTION_SET_PROFILE: /SET_PROFILE:(.+)/,
  CMD_ODO: /\/odo\s+(\d+)/,
  CMD_NEW_VEHICLE: /\/newvehicle\s+(.+)\s*\|\s*(.+)/,
};
