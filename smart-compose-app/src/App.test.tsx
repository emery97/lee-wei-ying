import { render } from '@testing-library/react';
import { fetchData , fetchResultsData} from "./components/LandingPage"; 

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        suggestions: [
          "child care",
          "child vaccination",
          "child health",
          "child education",
          "child development account",
          "register childcare",
        ],
      }),
  })
) as jest.Mock;

describe('fetchData', () => {
  afterEach(() => {
    jest.clearAllMocks(); 
  });
  it('should handle API errors', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: false })) as jest.Mock;
  
    const consoleSpy = jest.spyOn(console, 'error'); 
    const setData = jest.fn(); 
  
    await fetchData('child care', setData);
  
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error getting searched data:',
      new Error('Network response error')
    );
  });
  
  it('should fetch and filter suggestions', async () => {
    const setData = jest.fn(); 
  
    await fetchData('child care', setData);
  
    expect(fetch).toHaveBeenCalledTimes(1);
  
    expect(setData).toHaveBeenCalledWith([]);
  });
  
  
});

describe('fetchResultsData', () => {
  const mockSetResultData = jest.fn();
  const mockSetTotalResults = jest.fn();
  const mockSetresultsPage = jest.fn();
  const mockSetresultsPageSize = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch and filter results based on input', async () => {
    const mockResponse = {
      TotalNumberOfResults: 100,
      Page: 1,
      PageSize: 10,
      ResultItems: [
        {
          DocumentId: "1",
          DocumentTitle: { Text: "Child Health", Highlights: [] },
          DocumentExcerpt: { Text: "Information about child health.", Highlights: [] },
          DocumentURI: "http://example.com"
        },
        {
          DocumentId: "2",
          DocumentTitle: { Text: "Adult Health", Highlights: [] },
          DocumentExcerpt: { Text: "Information about adult health.", Highlights: [] },
          DocumentURI: "http://example.com"
        }
      ]
    };

    // Mock the fetch function
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })
    ) as jest.Mock;

    await fetchResultsData("child", mockSetResultData, mockSetTotalResults, mockSetresultsPage, mockSetresultsPageSize);

    expect(mockSetTotalResults).toHaveBeenCalledWith(mockResponse.TotalNumberOfResults);
    expect(mockSetresultsPage).toHaveBeenCalledWith(mockResponse.Page);
    expect(mockSetresultsPageSize).toHaveBeenCalledWith(mockResponse.PageSize);
    expect(mockSetResultData).toHaveBeenCalledWith([
      {
        DocumentId: "1",
        DocumentTitle: { Text: "Child Health", Highlights: [] },
        DocumentExcerpt: { Text: "Information about child health.", Highlights: [] },
        DocumentURI: "http://example.com"
      }
    ]);
  });

  it('should handle network response errors', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: false })) as jest.Mock;

    await fetchResultsData("child", mockSetResultData, mockSetTotalResults, mockSetresultsPage, mockSetresultsPageSize);

    expect(mockSetResultData).toHaveBeenCalledWith([]);
    expect(mockSetTotalResults).not.toHaveBeenCalled();
    expect(mockSetresultsPage).not.toHaveBeenCalled();
    expect(mockSetresultsPageSize).not.toHaveBeenCalled();
  });
});
