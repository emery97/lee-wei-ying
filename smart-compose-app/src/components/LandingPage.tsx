import React, { useState, useEffect } from "react";
import "../styles/LandingPage.css";

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
// exporting the functions separately
// fetches suggestions data
export const fetchData = async (input: string, setData: React.Dispatch<React.SetStateAction<string[]>>) => {
  try {
    setData([]);
    const response = await fetch(
      "https://gist.githubusercontent.com/yuhong90/b5544baebde4bfe9fe2d12e8e5502cbf/raw/e026dab444155edf2f52122aefbb80347c68de86/suggestion.json"
    );
    if (!response.ok) {
      throw new Error("Network response error");
    }
    const result = await response.json();
    console.log(result);
    const filteredData = result.suggestions
      .filter((suggestion: string) => suggestion.toLowerCase().includes(input.toLowerCase()))
      .slice(0, 6);
    setData(filteredData);
    if (input.trim() === "" || filteredData.length === 0) {
      setData([]);
    }
  } catch (error) {
    console.error("Error getting searched data:", error);
  }
};

// fetching result data
export const fetchResultsData = async (
  input: string, 
  setResultData: React.Dispatch<React.SetStateAction<DocumentItem[]>>, 
  setTotalResults: React.Dispatch<React.SetStateAction<number>>,
  setresultsPage: React.Dispatch<React.SetStateAction<number>>, 
  setresultsPageSize: React.Dispatch<React.SetStateAction<number>>
) => {
  try {
    if (input.length === 0 ) {
      setResultData([]); 
      return; // exit early
    }
    setResultData([]);
    const response = await fetch("https://gist.githubusercontent.com/yuhong90/b5544baebde4bfe9fe2d12e8e5502cbf/raw/44deafab00fc808ed7fa0e59a8bc959d255b9785/queryResult.json");
    if (!response.ok) {
      throw new Error("Network response error");
    }
    const result = await response.json();
    const filteredResultData: DocumentItem[] = [];
    setTotalResults(result.TotalNumberOfResults);
    setresultsPage(result.Page);
    setresultsPageSize(result.PageSize);
    result.ResultItems.forEach((item: DocumentItem) => {
      if (item.DocumentExcerpt.Text.toLowerCase().includes(input.toLowerCase())) {
        filteredResultData.push(item);
      }else if (item.DocumentTitle.Text.toLowerCase().includes(input.toLowerCase())) {
        filteredResultData.push(item);
      }
    });
    setResultData(filteredResultData);
  } catch (error) {
    console.log('Error getting searched results: ', error);
  }
};

const LandingPage = () => {
  const [data, setData] = useState<string[]>([]);
  const[resultData, setResultData] = useState<DocumentItem[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedIndex, setSelectedIndex] = useState<number |null>(null);
  const[showResults, setShowResults] = useState<boolean>(true);
  const [noResults, setNoResults] = useState<boolean>(false); // this is for "no results found"
  const[totalResults, setTotalResults] = useState<number>(0);
  const[resultsPage, setresultsPage] = useState<number>(0);
  const[resultsPageSize, setresultsPageSize] = useState<number>(0);
  
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) =>{
    setInputValue(event.target.value);
    setSelectedIndex(null);
    setShowResults(true);
  };
  const searchButtonClick = async()=>{
    await fetchData(inputValue,setData);
    setShowResults(false);
    setNoResults(false);
    await fetchResultsData(inputValue,setResultData,setTotalResults,setresultsPage,setresultsPageSize);
    if(resultData.length!==0){
      createResults(resultData,inputValue);
    }

    if (inputValue.trim() !== " " && data.length === 0 && resultData.length===0) {
      alert('Data not found, please re-enter');
      setNoResults(true);
    }
    console.log(`resultsdata : ${resultData.length}\ninput value : ${inputValue}`);
  };
  const handleKeyPress = async (event: React.KeyboardEvent<HTMLInputElement>) => {
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
      
      // Check if a suggestion is selected
      let selectedSuggestion = inputValue;
      if (selectedIndex !== null && data[selectedIndex]) {
        selectedSuggestion = data[selectedIndex]; 
        handleSelectSuggestion(selectedSuggestion); // updates the input with the selected suggestion
      }
      await fetchResultsData(selectedSuggestion, setResultData, setTotalResults, setresultsPage, setresultsPageSize);
      setShowResults(false);
  
      if (selectedSuggestion.trim() !== "" && data.length === 0 && resultData.length === 0) {
        alert('Data not found, please re-enter');
      } else if (resultData.length > 0) {
        createResults(resultData, selectedSuggestion);
      }
    }
  };
  
  const handleSelectSuggestion = (suggestion: string) => {
    setInputValue(suggestion); 
    searchButtonClick();
  };
  
  function highlight(content: string, input: string) {
    if (!input.trim()) return content;
    const regex = new RegExp(`(${input})`, 'gi'); 
    return content.replace(regex, '<strong>$1</strong>');
  }

  // dynamically generate suggestion rows based on data
  const getRows = (data: string[], input: string) => {
    const highlightText = (title: string, input: string) => {
      if (!input) return title; // If input is empty, return the original title
      const regex = new RegExp(`(${input})`, 'gi');
      return title.replace(regex, '<strong>$1</strong>'); 
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

  // for results
  function generateRandomDate() {
    const start = new Date(2024, 0, 1); // start from Jan 1, 2024
    const end = new Date(); // Until the current date
    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  
    // format the date as "1 Sep 2021"
    const options:Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    return randomDate.toLocaleDateString('en-GB', options);
  }
  
   // creating the outlook for results 
   function createResults(data: DocumentItem[], input: string) {
    return (
      <div className="results-container">
        {data.map((item, index) => (
          <div key={index} className="result-block">
            <p className="title text-primary">{item.DocumentTitle.Text}</p>
            <p
              className="excerpt"
              dangerouslySetInnerHTML={{
                __html: `${generateRandomDate()} — ${highlight(item.DocumentExcerpt.Text.replace("...", " "), input)}`
              }}
            />
            <a
              className="uri"
              href={item.DocumentURI}
            >
              {item.DocumentURI}
            </a>
          </div>
        ))}
      </div>  
  );
  }
    
  // for when user types >2 characters in search bar
  useEffect(()=>{
    if(inputValue.length>2){
      fetchData(inputValue, setData);
    }else{
      setData([]);
      setResultData([]);
    }
  }, [inputValue]);
  useEffect(()=>{
    if(resultData.length>0){
      createResults(resultData, inputValue);

    }
  },[resultData]);

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
            <div className="suggestion-container">
              <table className="shadow-sm bg-white suggestion" style={{display: showResults ?'block' :'none'}}>
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
        <div className="result-page pt-5">
          {resultData.length > 0 && (
            <h6>
              Showing {resultsPage}-{resultsPageSize} of {totalResults} results
            </h6>
          )}
          <div id="result-content">
          {noResults==true ? (
              'No results to display'
            ) : (
              resultData.length > 0 ? createResults(resultData, inputValue) : ''
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
