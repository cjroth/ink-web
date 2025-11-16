import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { type SearchResult, searchDocs } from "../docs/search";

function SearchAPI() {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setLoading(true);
      searchDocs(query)
        .then(setResults)
        .finally(() => setLoading(false));
    }
  }, [searchParams]);

  return (
    <main className="container">
      <h1>Search Results</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {results.map((result) => (
            <li key={result.url}>
              <h3>{result.title}</h3>
              <p>{result.excerpt}</p>
              <a href={result.url}>{result.url}</a>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default SearchAPI;
