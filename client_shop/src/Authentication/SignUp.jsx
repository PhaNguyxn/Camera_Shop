import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import UserAPI from '../API/UserAPI';
import './Auth.css';

function SignUp(props) {
    const [fullname, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');

    const [errorFullname, setFullnameError] = useState(false);
    const [errorEmail, setEmailError] = useState(false);
    const [emailRegex, setEmailRegex] = useState(false);
    const [errorPassword, setPasswordError] = useState(false);
    const [errorPhone, setPhoneError] = useState(false);

    const [success, setSuccess] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const onChangeName = (e) => setFullName(e.target.value);
    const onChangeEmail = (e) => setEmail(e.target.value);
    const onChangePassword = (e) => setPassword(e.target.value);
    const onChangePhone = (e) => setPhone(e.target.value);

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    const handlerSignUp = async (e) => {
        e.preventDefault();

        // 1. Reset lại tất cả các thông báo lỗi trước khi kiểm tra
        setFullnameError(false);
        setEmailError(false);
        setEmailRegex(false);
        setPasswordError(false);
        setPhoneError(false);

        // 2. Validation (Early Return)
        if (!fullname) return setFullnameError(true);
        if (!email) return setEmailError(true);
        if (!validateEmail(email)) return setEmailRegex(true);
        if (!password) return setPasswordError(true);
        if (!phone) return setPhoneError(true);

        // 3. Nếu đã qua hết validation, tiến hành gọi API
        setSubmitted(true);

        try {
            const params = {
                fullname,
                email,
                password,
                phone
            }

            await UserAPI.postSignUp(params)
            setSuccess(true);
        } catch (error) {
            console.error("Lỗi đăng ký:", error);
            // Quan trọng: Nếu lỗi thì phải cho phép người dùng sửa và nhấn lại
            setSubmitted(false); 
            alert("Đăng ký thất bại, vui lòng thử lại!");
        }
    };

    // Nếu thành công thì chuyển hướng sang trang Sign In
    if (success) {
        return <Redirect to='/signin' />;
    }

    return (
        <div className="limiter">
            <div className="container-login100">
                <div className="wrap-login100 p-l-55 p-r-55 p-t-65 p-b-50">
                    <span className="login100-form-title p-b-33">Sign Up</span>
                    
                    <div className="d-flex justify-content-center pb-5">
                        {errorFullname && <span className="text-danger">* Vui lòng kiểm tra Họ tên!</span>}
                        {errorEmail && <span className="text-danger">* Vui lòng kiểm tra Email!</span>}
                        {emailRegex && <span className="text-danger">* Định dạng Email không đúng</span>}
                        {errorPassword && <span className="text-danger">* Vui lòng kiểm tra Mật khẩu!</span>}
                        {errorPhone && <span className="text-danger">* Vui lòng kiểm tra Số điện thoại!</span>}
                    </div>

                    <div className="wrap-input100 validate-input">
                        <input className="input100" value={fullname} onChange={onChangeName} type="text" placeholder="Full Name" />
                    </div>

                    <div className="wrap-input100 rs1 validate-input">
                        <input className="input100" value={email} onChange={onChangeEmail} type="text" placeholder="Email" />
                    </div>

                    <div className="wrap-input100 rs1 validate-input">
                        <input className="input100" value={password} onChange={onChangePassword} type="password" placeholder="Password" />
                    </div>

                    <div className="wrap-input100 rs1 validate-input">
                        <input className="input100" value={phone} onChange={onChangePhone} type="text" placeholder="Phone" />
                    </div>

                    <div className="container-login100-form-btn m-t-20">
                        <button 
                            className="login100-form-btn" 
                            onClick={handlerSignUp}
                            disabled={submitted} // Vô hiệu hóa nút khi đang gửi dữ liệu
                        >
                            {submitted ? "Loading..." : "Sign Up"}
                        </button>
                    </div>

                    <div className="text-center p-t-45 p-b-4">
                        <span className="txt1">Login?</span>
                        &nbsp;
                        <Link to="/signin" className="txt2 hov1">Click</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUp;