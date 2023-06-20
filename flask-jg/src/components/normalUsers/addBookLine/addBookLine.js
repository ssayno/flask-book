import {useState} from "react";
import {SingleLine} from "../singleLine/singleLine";

export const AddBookLine = ({onHandleAdded, onHandleCancel}) => {
    const [newBook, setNewBook] = useState({
        type: "", name: "",
        now_price: "", previous_price: "",
        publish_date: "", publisher: "",
        discount: "", details: ""
    });
    const addNewBookToDatabase = () => {
        onHandleAdded(newBook);
    }
    const updateNewBookInfo = (uName, uValue) => {
        setNewBook(prevState => {
            return {...prevState, [`${uName}`]: uValue};
        })
    }
    return <SingleLine
        addOrModified={false}
        item={newBook}
        onHandleUpdateFromChild={updateNewBookInfo}
        onHandleCancelOperation={onHandleCancel}
        onAddOperation={addNewBookToDatabase}
    />
}