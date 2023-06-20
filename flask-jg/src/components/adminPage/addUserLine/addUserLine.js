import {SingleUserLine} from "../singleUserLine";
import {Fragment, useState} from "react";

export const AddUserLine = ({onHandleCancel, onHandleAddUserFromButton}) => {
    const [newUser, setNewUser] = useState({
        email: "",
        password: "",
        privilege: "normal-user"
    });
    const addNewUserToDatabase = () => {
        console.log("Needed add new user is", newUser);
        onHandleAddUserFromButton(newUser);
    }
    const handleNewUserUpdate = (email, nuName, nuValue) => {
        setNewUser(prevState => {
            return {...prevState, [`${nuName}`]: nuValue};
        })
    };
    return(
        <Fragment>
            <SingleUserLine user={newUser}
                            onHandleUpdate={handleNewUserUpdate}
                            addOrModified={false}
                            onHandleCancel={onHandleCancel}
            />
            <SaveAddUserButton onHandleAdd={addNewUserToDatabase}/>
        </Fragment>
    )
}

const SaveAddUserButton = ({onHandleAdd}) => {

    return(
        <tr>
            <td colSpan={4} style={{padding: "0", margin: "0"}}>
                <button onClick={onHandleAdd}>
                    <span>Add</span>
                </button>
            </td>
        </tr>
    )
}