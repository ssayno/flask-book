import {useState} from "react";
import {AiOutlineMail} from "react-icons/ai";
import {HiOutlineLockClosed} from "react-icons/hi";


export const AdminLogin = ({onHandleSubmit}) => {
    const [account, setAccount] = useState("");
    const [password, setPasswd] = useState("");
    const adminHandleSubmit = (e) => {
        console.log('admin login');
        e.preventDefault();
        const formData = new FormData();
        formData.append("account", account);
        formData.append("password", password);
        formData.append("xjy-type", "admin");
        onHandleSubmit(formData);
    }
    const adminHandleAccount = (e) => {
        const value = e.target.value;
        setAccount(value);
    }
    const adminHandlePassword = (e) => {
        const value = e.target.value;
        setPasswd(value);
    }
    return(
        <div className="login-content">
            <h4 className="content-header">管理员登录界面</h4>
            <form onSubmit={adminHandleSubmit}>
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
                           onChange={adminHandleAccount}
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
                           onChange={adminHandlePassword}
                    />
                </div>
                <div id="login-item">
                    <input type="submit" value="login"/>
                </div>
            </form>
        </div>
    )
}