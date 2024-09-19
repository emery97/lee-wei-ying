import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ResultsPage.css";

const ResultsPage = () =>{
    const [data, setData] = useState<DocumentItem[]>([]);
    const [inputValue, setInputValue] = useState<string>("");
    const [selectedIndex, setSelectedIndex] = useState<number |null>(null);
    const[showResults, setShowResults] = useState<boolean>(true);  

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
    const fetchResultsData = async(input:DocumentItem[]) =>{
        try{
            setData([]);
            const response = await fetch("https://gist.githubusercontent.com/yuhong90/b5544baebde4bfe9fe2d12e8e5502cbf/raw/44deafab00fc808ed7fa0e59a8bc959d255b9785/queryResult.json");
            if(!response.ok){
                throw new Error("Network response error");
            }
            const result = await response.json();
            console.log(result);

        }catch(error){
            console.log('Error getting searched results: ',error);
        }
    }
    return(
        <div></div>
    )
};

export default ResultsPage;