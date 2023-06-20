export const SingleLine = ({item, index, onHandleDeleteItem,
                               onHandleUpdateFromChild, addOrModified,
                               onHandleCancelOperation, onAddOperation}) => {
    const {id, type, name, now_price, previous_price, publish_date, publisher, discount, details} = item;
    const handleChange = (e) => {
        const value = e.target.value;
        const changedName = e.target.name;
        console.log(value);
        // setItemStatus(prevState => {
        //     return Object.assign({}, prevState, {
        //         [`${changedName}`]: value
        //     })
        // })
        if (addOrModified){
            onHandleUpdateFromChild(id, changedName, value);
        }else{
            onHandleUpdateFromChild(changedName, value);
        }
    }
    const addOrDelete = () => {
        if(addOrModified){
            onHandleDeleteItem(id);
        }else{
            onAddOperation();
        }
    }
    return(
        <tr>
            <td>
                {
                    addOrModified ? <span>{index}</span> : <button onClick={onHandleCancelOperation}>
                        Cancel
                    </button>
                }
            </td>
            <td>
                <input type="text" value={type || ""}
                       name="type"
                       onChange={handleChange}
                />
            </td>
            <td>
                <input type="text" value={name || ""}
                       name="name"
                       onChange={handleChange}
                />
            </td>
            <td>
                <input type="text" value={now_price || ""}
                       name="now_price"
                       onChange={handleChange}
                />
            </td>
            <td>
                <input type="text" value={discount || ""}
                       name="discount"
                       onChange={handleChange}
                />
            </td>
            <td>
                <input type="text" value={previous_price || ""}
                       name="previous_price"
                       onChange={handleChange}
                />
            </td>
            <td>
                <input type="text" value={publish_date || ""}
                       name="publish_date"
                       onChange={handleChange}
                />
            </td>
            <td>
                <input type="text" value={publisher || ""}
                       name="publisher"
                       onChange={handleChange}
                />
            </td>
            <td>
                <input type="text" value={details || ""}
                       name="details"
                       onChange={handleChange}
                />
            </td>
            <td>
                <button className="add-or-delete" onClick={addOrDelete}>
                    {
                        addOrModified ? "Delete": "Add"
                    }
                </button>
            </td>
        </tr>
    )
}