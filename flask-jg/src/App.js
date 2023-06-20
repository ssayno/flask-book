import {LoginComp} from './components/Login/forLogin';
import {useCallback, useEffect, useState} from "react";
import {NormalUserMainPage} from "./components/normalUsers/normalUser";
import {AdminPage} from "./components/adminPage/adminPage";

function App() {
    const [loginStatus, setLoginStatus] = useState({
        loginOrNot: false,
        loginLevel: "normal-user"
    });
    useEffect(() => {
        console.log("app update", loginStatus);
    }, [loginStatus])
    const handleLoginSubmit = useCallback(
        (formData) => {
            fetch('/rest/api/admin', {
                method: 'POST',
                body: formData,
            }).then(
                (resp) => resp.json()
            ).then(
                (data) => {
                    console.log("Login response is", data);
                    const statusCode = data['code'];
                    if (statusCode === -1) {
                        setLoginStatus(prevState => {
                            return Object.assign({}, prevState, {loginOrNot: false})
                        })
                    } else {
                        const loginLevel = data["level"];
                        setLoginStatus(prevState => {
                            return Object.assign({}, prevState, {
                                loginOrNot: true,
                                loginLevel: loginLevel
                            })
                        })
                    }
                }
            ).catch((error) => {
                console.log(`Error ${error}`);
            })
        }, []
    )
    const fetchAllNormalUser = useCallback(async () => {
        try {
            const resp = await fetch(
                '/rest/api/users/get?query_type=normal-user', {
                    method: "POST"
                }
            );
            const resp_json = await resp.json();
            const data = resp_json.result;
            for (let item of data) {
                item['modified'] = false;
                item['deleted'] = false;
            }
            console.log("Fetch normal user response json is", data);
            return data;
        } catch (e) {
            console.log("Fetch normal user get error message", e);
            return e;
        }
    }, []);
    const updateUserInfo = async (needUpdatedUsers) => {
        console.log(`App update user is ${needUpdatedUsers}`);
        try {
            const resp = await fetch("/rest/api/users/update", {
                method: "POST",
                body: JSON.stringify({
                    data: needUpdatedUsers
                })
            });
            const resp_json = await resp.json();
            console.log("Update user info result json is", resp_json);
            return resp_json;
        } catch (e) {
            console.log("update user info error", e);
            return e;
        }
    }
    const deleteUserInfo = async (needDeleteUsers) => {
        try {
            const resp = await fetch("/rest/api/users/delete", {
                method: "POST",
                body: JSON.stringify({
                    data: needDeleteUsers
                })
            });
            const resp_json = await resp.json();
            console.log("Delete user info result json is", resp_json);
            return resp_json;
        } catch (e) {
            console.log("delete user info error", e);
            return e;
        }
    }
    const addUser = async (needAddUser) => {
        console.log(`Need added user is ${needAddUser}`);
        try {
            const resp = await fetch('/rest/api/users/add', {
                method: "POST",
                body: JSON.stringify({
                    data: needAddUser
                })
            })
            const resp_json = await resp.json()
            console.log("Add User operation resp json is", resp_json);
            return {
                addedUser: needAddUser,
                respJson: resp_json
            }
        } catch (e) {
            console.log("added user operation is failed");
            return e;
        }
    }
    const fetchCategory = useCallback(async () => {
        try {
            const resp = await fetch('/rest/api/category/get', {
                method: "POST"
            });
            const resp_json = await resp.json();
            console.log("Fetch category is", resp_json);
            return resp_json;
        } catch (e) {
            return e;
        }
    }, [])
    const fetchData = async (postParams) => {
        try {
            const resp = await fetch('/rest/api/data/get?' + postParams, {
                method: "GET"
            });
            const resp_json = await resp.json();
            for (let item of resp_json.data) {
                item['modified'] = false;
                item['deleted'] = false;
            }
            console.log("Fetch data is", resp_json);
            return resp_json;
        } catch (e) {
            return e;
        }
    }
    const deleteData = async (needDeleteData) => {
        console.log(`Need delete data is ${needDeleteData}`);
        try {
            const resp = await fetch('/rest/api/data/delete', {
                method: "POST",
                body: JSON.stringify({
                    data: needDeleteData
                })
            })
            return await resp.json();
        } catch (e) {
            console.log("Update value is fail");
            return e;
        }
    }
    const updateData = async (needModifiedData) => {
        console.log(`Need updated data is ${needModifiedData}`);
        try {
            const resp = await fetch('/rest/api/data/update', {
                method: "POST",
                body: JSON.stringify({
                    data: needModifiedData
                })
            })
            return await resp.json();
        } catch (e) {
            console.log("Update value is failed");
            return e;
        }
    }
    const addData = async (needAddData) => {
        console.log(`Need added data is ${needAddData}`);
        try {
            const resp = await fetch('/rest/api/data/add', {
                method: "POST",
                body: JSON.stringify({
                    data: needAddData
                })
            })
            const resp_json = await resp.json()
            console.log("Add operation resp json is", resp_json);
            return resp_json
        } catch (e) {
            console.log("added value is failed");
            return e;
        }
    }

    if (!loginStatus.loginOrNot) {
        return (
            <LoginComp appHandleLoginSubmit={handleLoginSubmit}/>
        );
    }
    if (loginStatus.loginLevel === "admin") {
        console.log("current status", loginStatus.loginOrNot);
        return <AdminPage
            onHandleGetNormalUserInfo={fetchAllNormalUser}
            onHandleUpdateUser={updateUserInfo}
            onHandleDeleteUser={deleteUserInfo}
            onAddUserFromApp={addUser}
        />
    } else {
        return (
            <NormalUserMainPage
                onHandleFetchData={fetchData}
                onUpdateData={updateData}
                onDeleteData={deleteData}
                onAddData={addData}
                onHandleFetchCategory={fetchCategory}
            />
        )
    }

}

export default App;
