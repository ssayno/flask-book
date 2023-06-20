import {useState} from "react";
import './forLogin.css';
import {BothLogin} from "./bothLogin/bothLogin";

export const LoginComp = ({appHandleLoginSubmit}) => {
    const adminLoginValue="admin";
    const normalUserLoginValue="normal-user";
    const [loginLevel, setLoginLevel] = useState(normalUserLoginValue);
    const handleSubmit = (formData) => {
        console.log("try to submit");
        appHandleLoginSubmit(formData);
    }
    // let loginContent = <NormalUserLogin onHandleSubmit={handleSubmit}/>;
    // if(loginLevel === adminLoginValue){
    //     loginContent = <AdminLogin onHandleSubmit={handleSubmit}/>
    // }

    const handleLoginLevel = (e) => {
        const loginLevelValue = e.target.value;
        console.log(loginLevelValue);
        setLoginLevel((prevState) => {
            if(prevState !== loginLevelValue){
                return loginLevelValue;
            }else{
                return prevState;
            }
        })
    }
    return(
        <div className="login-box">
            <div className="login-header">
                <div className="admin-button">
                    <label htmlFor="admin">
                        <input type="radio"
                               name="login-option"
                               value={adminLoginValue}
                               id="admin"
                               checked={loginLevel === adminLoginValue}
                               onChange={handleLoginLevel}
                        />
                        管理员登录
                    </label>
                </div>
                <div className="normal-user-button">
                    <label htmlFor="normal-user">
                        <input type="radio"
                               name="login-option"
                               value={normalUserLoginValue}
                               checked={loginLevel === normalUserLoginValue}
                               id="normal-user"
                               onChange={handleLoginLevel}
                        />
                        用户登录
                    </label>
                </div>
            </div>
            <hr/>
            <BothLogin onHandleSubmit={handleSubmit} loginLevel={loginLevel}/>
        </div>
    )
}
