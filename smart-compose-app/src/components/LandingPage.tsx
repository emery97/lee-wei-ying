import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/LandingPage.css";

const LandingPage = () => {
  const [data, setData] = useState<string[]>([]);
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
      setData([]);
      const response = await fetch("https://gist.githubusercontent.com/yuhong90/b5544baebde4bfe9fe2d12e8e5502cbf/raw/e026dab444155edf2f52122aefbb80347c68de86/suggestion.json")
      if(!response.ok){
        throw new Error("Network response error");
      }
      const result = await response.json();
      const filteredData = result.suggestions.filter((suggestions:string) =>
        suggestions.toLowerCase().includes(input.toLowerCase())
      );
      if(filteredData.length === 0){
        alert('Data not found, please re-enter');
      }
      setData(prevData => [...prevData, ...filteredData]);
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
  const getRows = (data: string[], input: string) => {
    const highlightText = (title: string, input: string) => {
      if (!input) return title; // If input is empty, return the original title
      const regex = new RegExp(`(${input})`, 'gi'); // Create a case-insensitive regex to match the input
      return title.replace(regex, '<strong>$1</strong>'); // Replace matching parts with <strong>
    };
  
    return data.map((title, index) => (
      <tr key={index}>
        <td dangerouslySetInnerHTML={{ __html: highlightText(title, input) }} />
      </tr>
    ));
  };
  


  return (
    <div className="landing-page">
      <div className="inner-container shadow-sm p-3 mt-5  bg-white rounded">
        <div className="search-container">
          <div className="search-group w-75 position-relative">
            <input type="search" id="form1" className="form-control" placeholder="Search" value={inputValue} onChange={handleInputChange} onKeyDown={handleKeyPress}/>
            <button type="button" className="btn btn-primary search-button" onClick={searchButtonClick}>
              <i className="fas fa-search search-icon"></i>
              <label className="form-label" form="form1" id="input">
                Search
              </label>
            </button>
            <div className="shadow-sm bg-white result-container ">
              <table className="result">
                <tbody>{getRows(data, inputValue)}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
