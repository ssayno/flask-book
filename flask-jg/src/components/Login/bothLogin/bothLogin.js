import {useState} from "react";
import {AiOutlineMail} from "react-icons/ai";
import {HiOutlineLockClosed} from "react-icons/hi";


export const BothLogin = ({onHandleSubmit, loginLevel}) => {
    const [account, setAccount] = useState("");
    const [password, setPasswd] = useState("");
    const normalUserHandleSubmit = (e) => {
        console.log(`${loginLevel} try login in`);
        e.preventDefault();
        const formData = new FormData();
        formData.append("account", account);
        formData.append("password", password);
        formData.append("xjy-type", loginLevel);
        onHandleSubmit(formData);
    }
    const handleAccount = (e) => {
        const value = e.target.value;
        setAccount(value);
    }
    const handlePassword = (e) => {
        const value = e.target.value;
        setPasswd(value);
    }
    return(
        <div className="login-content">
            <h4 className="content-header">
                {loginLevel === "admin" ? "管理员登录界面" : "用户登录界面"}
            </h4>
            <form onSubmit={normalUserHandleSubmit}>
                <div className="form-item">
                    <label htmlFor="account">
                        <span className="icon-box">
                            <AiOutlineMail style={{ fontSize: '1em', verticalAlign: 'center' }} />
                        </span>
                    </label>
                    <input type="text" name="account"
                           id="account"
                           placeholder="邮箱"
                           value={account}
                           onChange={handleAccount}
                    />
                </div>
                <div className="form-item">
                    <label htmlFor="passwd">
                        <span className="icon-box">
                            <HiOutlineLockClosed style={{ fontSize: '1em', verticalAlign: 'center' }} />
                        </span>
                    </label>
                    <input type="password"
                           name="passwd"
                           id="passwd"
                           placeholder="密码"
                           autoComplete="true"
                           value={password}
                           onChange={handlePassword}
                    />
                </div>
                <div id="login-item">
                    <input type="submit" value="login"/>
                </div>
                {
                    loginLevel === "normal-user" && <div id="signup-item">
                        <a href="https://www.baidu.com/">
                            没有账号？现在注册
                        </a>
                    </div>
                }
            </form>
        </div>
    )
}