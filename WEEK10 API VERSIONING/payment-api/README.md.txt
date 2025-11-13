Deprecation Notice: Payments API v1 → v2

Ngày thông báo: 13/11/2025
API v1: /api/v1/payments (deprecated)
API v2: /api/v2/payments (current)

1. Lý do deprecation

v1 chỉ hỗ trợ credit card và amount.

Thiếu các tính năng hiện đại:

Không hỗ trợ nhiều phương thức thanh toán (PayPal, Crypto, Bank Transfer)

Không hỗ trợ đa tiền tệ

Không có metadata, lịch sử giao dịch hoặc thống kê

V1 sẽ ngừng hỗ trợ trong 3 tháng.

Tất cả request v1 hiện tại sẽ trả thêm header cảnh báo:

Warning: 299 - "API v1 is deprecated. Please migrate to /api/v2/payments"

2. Các cải tiến chính của v2
Tính năng	v1	v2
Phương thức thanh toán	credit_card only	credit_card, paypal, crypto, bank_transfer
Tiền tệ	Không	USD, VND, EUR, BTC
Metadata	Không	Có (ví dụ: order_id, note)
Lịch sử giao dịch	Không	/payments/history
Truy vấn theo ID	Không	/payments/:id
Cập nhật trạng thái	Không	PATCH /payments/:id
Hủy giao dịch	Không	DELETE /payments/:id
Thống kê	Không	/payments/stats
3. Hướng dẫn migrate từ v1 → v2

Ví dụ POST request v1:

POST /api/v1/payments
{
  "amount": 100,
  "card_number": "4111111111111111"
}


Tương ứng v2:

POST /api/v2/payments
{
  "amount": 100,
  "currency": "USD",
  "method": "credit_card",
  "metadata": { "order_id": "ORD001", "note": "VIP" }
}


Lưu ý:

currency là bắt buộc

method phải nằm trong ["credit_card","paypal","crypto","bank_transfer"]

metadata là tùy chọn nhưng khuyến nghị dùng để lưu thông tin bổ sung

4. Endpoint v2 đáng chú ý

POST /payments – Tạo giao dịch mới

GET /payments/history – Xem lịch sử giao dịch

GET /payments/:id – Lấy chi tiết một giao dịch

PATCH /payments/:id – Cập nhật trạng thái hoặc metadata

DELETE /payments/:id – Hủy giao dịch

GET /payments/stats – Thống kê theo phương thức thanh toán