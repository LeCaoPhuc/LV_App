export class Config {

    static PARSE_APP_ID = "luan-van-app-id";

    // static PARSE_SERVER_URL = "http://192.168.1.43:3000/parse";
    static PARSE_SERVER_URL = "http://192.168.43.231:3000/parse";
    
    static CALL_CENTER_NUMBER = '1900555568';

    static ERROR_MESSAGE = {
        BARCODE_REQUIRED: 'Vui lòng nhập mã vạch',
        CONTENT_REQUIRED : 'Vui lòng nhập nội dung',
        EMAIL_FORMAT: 'Email không đúng định dạng',
        EMAIL_REQUIRED: 'Vui lòng nhập email',
        FINGERPRINT_DATABASE_CHANGE: 'Dữ liệu vân tay thay đổi!!\nKhông thể đăng nhập bằng vân tay.',
        FIRSTNAME_FORMAT: 'Tên không hợp lệ',
        FIRSTNAME_REQUIRED: 'Vui lòng nhập tên',
        FULLNAME_FORMAT: 'Họ tên không hợp lệ',
        FULLNAME_REQUIRED: 'Vui lòng nhập họ tên',
        FULLNAME_LENGTH: 'Vui lòng nhập họ tên tối đa 20 kí tự',
        LASTNAME_FORMAT: 'Họ không hợp lệ',
        LASTNAME_REQUIRED: 'Vui lòng nhập họ',
        MEMBERCARD_REQUIRED: 'Vui lòng nhập mã khách hàng thân thiết',
        MEMBERCARD_LENGTH: 'Mã khách hàng thân thiết không hợp lệ',
        MEMBERCARD_FORMAT: 'Mã khách hàng thân thiết không hợp lệ',
        NO_INTERNET_CONNECTION: 'Vui lòng kiểm tra kết nối Internet của bạn và thử lại',
        // PASSWORD_FORMAT: 'Vui lòng nhập mật khẩu bao gồm 6 chữ số',
        PASSWORD_LENGTH: 'Mật khẩu không đúng định dạng',
        // PASSWORD_REQUIRED: 'Vui lòng nhập mật khẩu',
        PHONENUMBER_FORMAT: 'Số điện thoại không đúng định dạng. Số điện thoại phải bắt đầu bằng số 0 và từ 10-11 chữ số',
        PHONENUMBER_INVALID: 'Số điện thoại không hợp lệ',
        PHONENUMBER_LENGTH: 'Số điện thoại không đúng định dạng. Số điện thoại phải bắt đầu bằng số 0 và từ 10-11 chữ số',
        PHONENUMBER_REQUIRED: 'Vui lòng nhập số điện thoại',
        // REPASSWORD_FORMAT: 'Nhập lại mật khẩu không chính xác',
        REPASSWORD_LENGTH: 'Nhập lại mật khẩu không chính xác',
        // REPASSWORD_NOMATCH: 'Nhập lại mật khẩu không chính xác',
        // REPASSWORD_REQUIRED: 'Vui lòng nhập lại mật khẩu',
        SIGNIN_ERROR: 'Xảy ra lỗi trong quá trình đăng nhập',
        SIGNIN_FB_FAILDED: 'Đăng ký bằng tài khoản Facebook thất bại',
        SIGNIN_FB_INVALID: 'Tài khoản Facebook này chưa được đăng ký.\nVui lòng tạo mới thông tin tài khoản',
        SIGNIN_GG_FAILDED: 'Đăng ký bằng tài khoản Google thất bại',
        SIGNIN_GG_INVALID: 'Tài khoản Google+ này chưa được đăng ký.\nVui lòng tạo mới thông tin tài khoản',
        SIGNIN_INVALID: 'Số điện thoại hoặc mật khẩu không chính xác',
        SIGNUP_VERIFYCODE_INVALID: 'Mã xác thực không đúng vui lòng kiểm tra lại',
        SIGNUP_VERIFYPHONE_INVALID: 'Số điện thoại đã đăng ký',
        SIGNUP_VERIFYPHONE_ERROR: 'Xảy ra lỗi trong quá trình xác thực số điện thoại.\nVui lòng thử lại.',
        SIGNUP_VERIFYPHONE_FAILED: 'Đăng ký tài khoản thất bại',
        SUPERMARKET_REQUIRED : 'Vui lòng nhập tên siêu thị phản hồi',
        TITLE_REQUIRED : 'Vui lòng nhập tiêu đề',
        VERIFYCODE_INVALID: 'Mã xác thực không chính xác',
        VERIFYCODE_REQUIRED: 'Vui lòng nhập mã xác thực',
        VAT_BILL_COMPANY_NAME_REQUIRED: 'Vui lòng nhập tên công ty',
        VAT_BILL_TAX_NUMBER_REQUIRED: 'Vui lòng nhập mã số thuế',
        VAT_BILL_TAX_NUMBER_FORMAT: 'Mã số thuế không đúng định dạng',
        VAT_BILL_COMPANY_ADDRESS_REQUIRED: 'Vui lòng nhập địa chỉ công ty',
        PRODUCT_NOT_FOUND: 'Lỗi: không tìm thấy sản phẩm',
        SCAN_PRODUCT_NOT_FOUND: 'Sản phẩm bạn vừa quét không bán trên Scan & Go.',
        VERIFYCODE_FORMAT: 'Mã xác thực không đúng định dạng',
        /// New message
        USERNAME_REQUIRED: 'Vui lòng nhập tài khoản',
        USERNAME_FORMAT: 'Tài khoản không đúng định dạng',
        PASSWORD_REQUIRED: 'Vui lòng nhập mật khẩu',
        PASSWORD_FORMAT: 'Mật khẩu không đúng định dạng',
        REPASSWORD_REQUIRED: 'Vui lòng nhập lại mật khẩu',
        REPASSWORD_NOMATCH: 'Mật khẩu không trùng khớp',
        NAME_REQUIRED: 'Vui lòng nhập họ tên',
        NAME_FORMAT: 'Họ tên không hợp lệ',
    }
    static ERROR_MESSAGE_TOAST = {
        HTTP_CATCH : 'Có lỗi khi gửi dữ liệu',
        ERROR_HANDLING : 'Có lỗi trong quá trình xử lý'

    }
    static TITLE = {
        PRIVACY_POLICY_PAGE: 'Điều Khoản và Chính Sách',
        FAQ_PAGE: 'Câu Hỏi Thường Gặp',
        PROMOTION_PAGE: 'Khuyến Mãi',
        WAREHOUSE_INFO_PAGE: 'Thông Tin Cửa Hàng',
        WISH_LIST : 'Sản Phẩm Yêu Thích',
        COMMENT : 'Phản Hồi Ý Kiến',
        ORDER_HISTORY : 'Lịch Sử Đơn Hàng',
        CHECK_ORDER : 'Kiểm Tra Đơn Hàng',
        ORDER_DETAILS: 'Chi Tiết Đơn Hàng',
        PROMOTION_LIST: 'Mua Hàng Khuyến Mãi',
        RELATED_LIST: 'Sản Phẩm Liên Quan',
        SEARCH_LIST: 'Tìm Kiếm',
        CHECK_ORDER_PAGE: 'Kiểm Tra Đơn Hàng',
        ORDER_HISTORY_PAGE: 'Lịch Sử Đơn Hàng',
        CHOOSE_PROMOTION_PRODUCT_LIST: 'Chọn sản phẩm',
        SEARCH_RELATED_PRODUCT: 'Tìm Kiếm',
        NOTIFY : 'Thông Báo',
        PAYMENT: 'Đặt hàng'
    }

    static STATIC_PAGE = {
        PRIVACY_POLICY: 'policy',
        FAQ: 'faq',
        PROMOTION: 'promotion'
    }

}