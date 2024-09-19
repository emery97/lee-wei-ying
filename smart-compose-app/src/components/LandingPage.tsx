import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/LandingPage.css";

const LandingPage = () => {
  const [data, setData] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedIndex, setSelectedIndex] = useState<number |null>(null);
  const[showResults, setShowResults] = useState<boolean>(true);

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
      ).slice(0,6);
      setData(filteredData);
    }catch(error){
      console.error("Error getting searched data:",error);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) =>{
    setInputValue(event.target.value);
    fetchData(event.target.value);
    setSelectedIndex(null);
    console.log(data);
  };
  const searchButtonClick = ()=>{
    fetchData(inputValue);
    if (inputValue.trim() !== " " && data.length === 0) {
      alert('Data not found, please re-enter');
    }
  };
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setSelectedIndex((prevIndex) => 
        prevIndex === null ? 0 : Math.min(data.length - 1, prevIndex + 1)
      );
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setSelectedIndex((prevIndex) => 
        prevIndex === null ? data.length - 1 : Math.max(0, prevIndex - 1)
      );
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (selectedIndex !== null) {
        handleSelectSuggestion(data[selectedIndex]); 
      }
    }
  };

  const handleSelectSuggestion= (suggestion:string) =>{
    setInputValue(suggestion);
    setData([]);
    setSelectedIndex(null);
  }

  // dynamically generate rows based on data
  const getRows = (data: string[], input: string) => {
    const highlightText = (title: string, input: string) => {
      if (!input) return title; // If input is empty, return the original title
      const regex = new RegExp(`(${input})`, 'gi'); // Create a case-insensitive regex to match the input
      return title.replace(regex, '<strong>$1</strong>'); // Replace matching parts with <strong>
    };

    return data.map((title, index) => (
      <tr
      key={index}
      onClick={() => handleSelectSuggestion(title)}
     >
        <td className={` table-row ${selectedIndex === index ? 'bg-light' : ''}`} dangerouslySetInnerHTML={{ __html: highlightText(title, input) }} />
      </tr>
    ));
  };

  // for when user types >2 characters in search bar
  useEffect(()=>{
    if(inputValue.length>2){
      fetchData(inputValue);
    }else{
      setData([]);
    }
  }, [inputValue]);

  return (
    <div className="landing-page">
      <div className="inner-container shadow-sm p-3 mt-5  bg-white rounded">
        <div className="search-container">
          <div className="search-group w-75 position-relative">
           <input 
              type="search" 
              id="form1" 
              className="form-control" 
              placeholder="Search" 
              value={inputValue} 
              onChange={handleInputChange} 
              onKeyDown={handleKeyPress} 
              autoComplete="off"
            />
            <div className="result-container">
              <table className="shadow-sm bg-white result" style={{display: showResults ?'block' :'none'}}>
                <tbody>{getRows(data, inputValue)}</tbody>
              </table>
            </div>
          </div>
          <button type="button" className="btn btn-primary" id="search-button" onClick={searchButtonClick}>
            <i className="fas fa-search search-icon"></i>
            <label className="form-label" form="form1" id="input">
              Search
            </label>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
