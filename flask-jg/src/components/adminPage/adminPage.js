import './adminPage.css';
import {useEffect, useState} from "react";
import {AddUserLine} from "./addUserLine/addUserLine";
import {SingleUserLine} from "./singleUserLine";

const AddedUserButton = ({onHandleAddUserFromUserDashboard}) => {
    const [addStatus, setAddStatus] = useState(false);
    const buttonHandleAddedUser = (item) => {
        onHandleAddUserFromUserDashboard(item);
        setAddStatus(false);
    }
    const buttonHandleCancelAddUser = () => {
        setAddStatus(false);
    }
    const handleSetAddStatus = () => {
        setAddStatus(prevState => !prevState)
    }
    if(!addStatus){
        return(
            <tr>
                <td colSpan={4} style={{padding: "0", margin: "0"}} id="add-tr">
                    <button onClick={handleSetAddStatus} id="addButton">
                        <span></span>
                    </button>
                </td>
            </tr>
        )
    }
    return <AddUserLine onHandleCancel={buttonHandleCancelAddUser} onHandleAddUserFromButton={buttonHandleAddedUser}/>
}


const NormalUserDashboard = ({ onHandleGetNormalUserInfo,
                                 onHandleUpdateUser,
                                 onHandleDeleteUser,
                             onHandleAddUserFromAdminPage}) =>{
    const [weNeed, setWeNeed] = useState([]);
    const handleUserDelete = (needDeletedEmail) => {
        setWeNeed(prevState => {
            return prevState.map(n => {
                if(n.email === needDeletedEmail){
                    return Object.assign({}, n, {deleted: true});
                }else{
                    return n;
                }
            })
        })
    }
    const handleUserUpdate = (needUpdatedEmail, nuName, nuValue) => {
        setWeNeed(prevState => {
            return prevState.map(n => {
                if(n.email === needUpdatedEmail){
                    return Object.assign({}, n, {[`${nuName}`]: nuValue, modified: true});
                }else{
                    return n;
                }
            })
        })
    }
    const handleSaveUserInfo = (e) => {
        e.preventDefault();
        const deletedUsers = [];
        const updatedUsers = [];
        for(let item of weNeed){
            if(item['deleted']){
                deletedUsers.push(item);
            }else if(item['modified']){
                updatedUsers.push(item);
            }
        }
        console.log(`need update user is ${updatedUsers}`);
        console.log(`need need user is ${deletedUsers}`);
        // below operation return promise, should solve it.
        // update data
        onHandleUpdateUser(updatedUsers);
        onHandleDeleteUser(deletedUsers);
    }
    const userDashboardAddUser = (item) => {
        onHandleAddUserFromAdminPage(item).then((data => {
            setWeNeed(prevState => {
                const needAddUser = data['addedUser'];
                const code = data['respJson']['code'];
                if(code === -2){
                    return prevState;
                }else{
                    needAddUser['modified'] = false;
                    needAddUser['deleted'] = false
                    return prevState.concat(needAddUser);
                }


            });
        }));
    }
    // useEffect(() => {
    //     console.log(weNeed)
    // }, [weNeed])
    useEffect(() => {
        console.log("normal user dashboard get user data info");
        onHandleGetNormalUserInfo().then((data) => {
            setWeNeed(data);
        });
    }, [onHandleGetNormalUserInfo]);

    return (
        <div className="normal-user-dashboard">
            <h3>Normal User</h3>
            <button id="save-normal-user-modified" onClick={handleSaveUserInfo}>
                <span>Save</span>
            </button>
            <p id="save-result-show">error message will show here</p>
            <table id="nud-table">
                <tbody>
                <tr>
                    <td><input type="text" defaultValue="Name" readOnly={true}/></td>
                    <td><input type="text" defaultValue="PassWord" readOnly={true}/></td>
                    <td><input type="text" defaultValue="Privilege" readOnly={true}/></td>
                    <td className="specifyLine"><span></span></td>
                </tr>
                {weNeed.filter(n => !n.deleted).map((n, i) => {
                    return (
                        <SingleUserLine user={n} key={i}
                                        onHandleUpdate={handleUserUpdate}
                                        onHandleDelete={handleUserDelete}
                                        addOrModified={true}
                        />
                    );
                })}
                <AddedUserButton onHandleAddUserFromUserDashboard={userDashboardAddUser}/>
                </tbody>
            </table>

        </div>
    );
}

export const AdminPage = ({onHandleGetNormalUserInfo,
                              onHandleUpdateUser,
                              onHandleDeleteUser,
                          onAddUserFromApp}) =>{
    return(
        <div id="account-dashboard">
            <h2>User Account and password message</h2>
            <div className="admin-dashboard">
                <h3>Admin</h3>
                <button>
                    <span>点击查询 admin 系列</span>
                </button>
            </div>
            <hr/>
            <NormalUserDashboard
                onHandleGetNormalUserInfo={onHandleGetNormalUserInfo}
                onHandleUpdateUser={onHandleUpdateUser}
                onHandleDeleteUser={onHandleDeleteUser}
                onHandleAddUserFromAdminPage={onAddUserFromApp}
            />
        </div>
    )
}