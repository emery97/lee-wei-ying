import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/LandingPage.css";

const LandingPage = () => {
  const [data, setData] = useState<DocumentItem[]>([]);
  const [inputValue, setInputValue] = useState<string>("");

  // defining interfaces for the data structure
  interface Highlight {
    BeginOffset: number;
    EndOffset: number;
  }
  
  interface DocumentTitle {
    Text: string;
    Highlights: Highlight[];
  }
  
  interface DocumentExcerpt {
    Text: string;
    Highlights: Highlight[];
  }
  
  interface DocumentItem {
    DocumentId: string;
    DocumentTitle: DocumentTitle;
    DocumentExcerpt: DocumentExcerpt;
    DocumentURI: string;
  }
  
  interface ApiResponse {
    ResultItems: DocumentItem[];
  }
  // fetching data 
  const fetchData = async(input:string)=>{
    try{
      const response = await fetch("https://gist.githubusercontent.com/yuhong90/b5544baebde4bfe9fe2d12e8e5502cbf/raw/44deafab00fc808ed7fa0e59a8bc959d255b9785/queryResult.json")
      if(!response.ok){
        throw new Error("Network response error");
      }
      const result = await response.json();
      
      // filtering the object based on the input
      const newFilteredTexts = result.ResultItems.filter((item: DocumentItem)=>{
        item.DocumentTitle.Text.toLowerCase().includes(input.toLowerCase())
      })
      .map((item:DocumentItem) => item.DocumentTitle.Text);

      // appending the results to filteredData
      setData(prevData => [...prevData, ...newFilteredTexts]);
    }catch(error){
      console.error("Error getting searched data:",error);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) =>{
    setInputValue(event.target.value);
  };
  const searchButtonClick = ()=>{
    fetchData(inputValue);
  };
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') { 
      searchButtonClick();
    }
  };

  // dynamically generate rows based on data
  // const getRows = (data:DocumentItem[])=>{

  // }
  

  return (
    <div className="container">
      <div className="input-group w-75">
        <input type="search" id="form1" className="form-control" placeholder="Search" value={inputValue} onChange={handleInputChange} onKeyDown={handleKeyPress}/>
        <button type="button" className="btn btn-primary" onClick={searchButtonClick}>
          <i className="fas fa-search"></i>
          <label className="form-label" form="form1" id="input">
            Search
          </label>
        </button>
      </div>
      <table className="result">
        <tr>result1</tr>
        <tr>result3</tr>
      </table>
    </div>
  );
};

export default LandingPage;
