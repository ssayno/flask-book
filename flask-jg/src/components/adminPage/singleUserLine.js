import {VscClose} from "react-icons/vsc";
import {useEffect} from "react";
export const SingleUserLine = ({user, onHandleUpdate,
                                   onHandleDelete, addOrModified,
                                   onHandleCancel}) => {
    const {email, password, privilege} = user;
    const handleChangeUserInfo = (e) => {
        const uName = e.target.name;
        const uValue = e.target.value;
        console.log(uValue);
        onHandleUpdate(email, uName, uValue);
    }
    const handleButton = (e) => {
        e.preventDefault();
        if(addOrModified){
            onHandleDelete();
        }else{
            onHandleCancel();
        }
    }
    return (
        <tr>
            {
                addOrModified ? <td>
                    <input type="text" name="email" defaultValue={email} readOnly={true}/>
                </td>
                    : <td>
                        <input type="text" name="email" value={email} onChange={handleChangeUserInfo}/>
                    </td>
            }
            <td>
                <input type="text" name="password" value={password}
                       onChange={handleChangeUserInfo}
                />
            </td>
            <td>
                <select name="privilege" value={privilege} onChange={handleChangeUserInfo}>
                    <option value="normal-user">normal-user</option>
                    <option value="admin">admin</option>
                </select>
            </td>
            <td className="specifyLine">
                <button onClick={handleButton}>
                    <span className="icon-box">
                        <VscClose style={{fontSize: "1em", verticalAlign: "center"}}/>
                    </span>
                </button>
            </td>
        </tr>
    )
}