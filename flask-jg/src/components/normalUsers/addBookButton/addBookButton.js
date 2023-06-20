import {AddBookLine} from "../addBookLine/addBookLine";
import {useState} from "react";

export const AddBookButton = ({onHandleAdd}) => {
    const [addStatus, setAddStatus] = useState(false);
    const buttonHandleAddedData = (item) => {
        setAddStatus(false);
        onHandleAdd(item);
    }
    const buttonHandleCancelAddData = () => {
        setAddStatus(false);
    }
    const handleSetAddStatus = () => {
        setAddStatus(prevState => !prevState)
    }
    if(!addStatus){
        return(
            <tr>
                <td colSpan={10} style={{padding: "0", margin: "0"}} id="add-tr">
                    <button onClick={handleSetAddStatus} id="addButton">
                        <span></span>
                    </button>
                </td>
            </tr>
        )
    }
    return <AddBookLine onHandleAdded={buttonHandleAddedData}
                        onHandleCancel={buttonHandleCancelAddData}/>
}