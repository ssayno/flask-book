import {useEffect, useState} from "react";

export const SearchBox = ({onHandleSearch, onUserHandleFetchCategory}) => {
    const [{searchType, searchYear, searchKeyword, page, length, more: moreOrNot, category}, updateSearchParams] = useState({
        searchType: "python",
        searchYear: "",
        searchKeyword: "",
        page: 1,
        more: false,
        length: 0,
        offset: 0,
        category: []
    });
    const handleUpdateSearchParams = (e) => {
        const changedName = e.target.name;
        const changedValue = e.target.value;
        console.log(changedName, changedValue);
        updateSearchParams(prevState => {
            return {...prevState, [`${changedName}`]: changedValue}
        });
    }
    const handleSubmit = (e, showMore) => {
        e.preventDefault();
        let searchPage = 1;
        if(showMore){
            searchPage = page;
            if(!moreOrNot){
                console.log("No more data for this search")
                return;
            }
        }
        const params = new URLSearchParams();
        params.append("search_type", searchType);
        params.append("search_year", searchYear);
        params.append("search_keyword", searchKeyword);
        params.append("page", searchPage);
        console.log(params);
        onHandleSearch(params, showMore).then(
            (resp) => updateSearchParams(prevState => {
                let more_;
                const page_ = resp.page + 1;
                more_ = resp.length > prevState.offset * page_;
                return {...prevState, ...resp, more: more_, page: page_}
            })
        )
    }
    useEffect(() => {
        onUserHandleFetchCategory().then(
            data => updateSearchParams(prevState => {
                return {...prevState, category: data}
            })
        )
    }, [onUserHandleFetchCategory])

    return(
        <div id="search-box">
            <p>输入搜索条件 书的类目、书的年份、书的大概名字</p>
            <p>当前搜索总共 {length} 数据，如要同时显示更多，点击 <code>show more</code> button</p>
            <div className="search-option">
                <select name="searchType" value={searchType} onChange={handleUpdateSearchParams}>
                    {
                        category.map((n, i) => {
                            return <option value={n} key={i}>{n}</option>
                        })
                    }
                </select>
                <label htmlFor="search-year">
                    <span>year:</span>
                    <input type="text" id="search-year"
                           name="searchYear"
                           value={searchYear}
                           onChange={handleUpdateSearchParams}
                    />
                </label>
                <label htmlFor="search-keyword">
                    <span>keywords</span>
                    <input type="text" id="search-keyword"
                           name="searchKeyword"
                           value={searchKeyword}
                           onChange={handleUpdateSearchParams}
                    />
                </label>
            </div>
            <hr/>
            <div id="search-button">
                <input type="submit" value="Search"
                       onClick={(e) => {handleSubmit(e, false)} }/>
            </div>
            <div id="show-more-button">
                <input type="submit" value="Show more"
                       onClick={(e) => {handleSubmit(e, true)}}/>
            </div>
        </div>
    )
}