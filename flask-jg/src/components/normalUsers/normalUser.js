import {useCallback, useEffect, useState} from "react";
import {SingleLine} from "./singleLine/singleLine";
import './normalUser.css';
import {AddBookButton} from "./addBookButton/addBookButton";
import {SearchBox} from "./searchBox/searchBox";



export const NormalUserMainPage = (
    {onHandleFetchData, onUpdateData, onDeleteData, onAddData, onHandleFetchCategory}
) => {
    const [data, setData] = useState([]);
    useEffect(() => {
        console.log("user update");
    })
    const handleDelete = (needDeleteItemID) => {
        console.log(`Need delete is ${needDeleteItemID}`);
        setData(prevState => {
            return prevState.map(n=> {
                if(n.id === needDeleteItemID){
                    n['deleted'] = true;
                }
                return n;
            })
        })
    }
    const handleUpdateFromChild = (needUpdateID, uName, uValue) => {
        console.log(`Need update Value is ${uName}`);
        setData(prevState => {
            return prevState.map(n => {
                if(n.id === needUpdateID){
                    n['modified'] = true;
                    return Object.assign({}, n, {
                        [`${uName}`]: uValue
                    })
                }else{
                    return n;
                }
            })
        })
    }
    const userHandleFetchCategory = useCallback(async () => {
        const result = await onHandleFetchCategory();
        return result.category;
    }, [onHandleFetchCategory])
    const handleSaveOperation = (e) => {
        e.preventDefault();
        const deletedData = [];
        const updatedData = [];
        for(let item of data){
            if(item['deleted']){
                deletedData.push(item);
            }else if(item['modified']) {
                updatedData.push(item);
            }
        }
        // below operation return promise, should solve it.
        // update data
        if(updatedData.length){
            onUpdateData(updatedData).then(
                (updateResultJson) =>{
                    const code = updateResultJson['code'];
                    if(code === 1){
                        console.log("update successfully");
                        setData(prevState => {
                            return prevState.map(n => {
                                n['modified'] = false;
                                return n;
                            })
                        })
                    }else if(code === -1){
                        console.log("update error");
                    }
                }
            )
        }
        // delete data
        if(deletedData.length){
            onDeleteData(deletedData).then(
                (updateResultJson) =>{
                    const code = updateResultJson['code'];
                    if(code === 1){
                        console.log("delete successfully");
                        setData(prevState => prevState.filter(n => !n.deleted))
                    }else if(code === -1){
                        console.log("delete error");
                    }
                }
            )
        }
    }
    const addDataToTable = (addedData) => {
        onAddData(addedData).then((respJson) => {
            console.log("add result from normal user", respJson);
            const code_ = respJson['code'];
            const cid = respJson['cid'];
            addedData['modified'] = false;
            addedData['deleted'] = false;
            addedData['id'] = cid;
            if(code_ === 1){
                setData(prevState => {
                    return prevState.concat({
                        ...addedData
                    });
                })
            }else{
                alert("added error");
            }
        })
    }
    const normalUserHandleSearch = async (params, showMore) => {
        const result = await onHandleFetchData(params);
        const {data, page, length, offset} = result;
        console.log("all data length is", length);
        if (showMore){
            setData(prevState => prevState.concat(data));
        }else{
            setData(data);
        }

        return {page, length, offset}
    }

    return (
        <div className="data-area">
            <h2>Normal User</h2>
            <SearchBox onHandleSearch={normalUserHandleSearch} onUserHandleFetchCategory={userHandleFetchCategory}/>
            <table id="data-table">
                <thead>
                <tr>
                    <td colSpan={10}>数据展示</td>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>Index</td>
                    <td>Book type</td>
                    <td>Name</td>
                    <td>Price</td>
                    <td>Discount</td>
                    <td>Discount Price</td>
                    <td>Publish date</td>
                    <td>Publisher</td>
                    <td>Details</td>
                    <td>
                        <button id="save-button" onClick={handleSaveOperation}>
                            <span id="save-icon-box">
                                Save
                            </span>
                        </button>
                    </td>
                </tr>
                {
                    // deleted value will reflect the index
                    data.filter(n => !n.deleted).map((n, i) => {
                        return <SingleLine
                            // need change
                            key={n.id}
                            item={n}
                            index={i}
                            addOrModified={true}
                            onHandleDeleteItem={handleDelete}
                            onHandleUpdateFromChild={handleUpdateFromChild}
                        />

                    })
                }
                <AddBookButton onHandleAdd={addDataToTable}/>
                </tbody>
            </table>
        </div>
    )
}