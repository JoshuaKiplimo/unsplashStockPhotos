import React, { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import Photo from "./Photo";
const clientID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`;
const mainUrl = `https://api.unsplash.com/photos/`;
const searchUrl = `https://api.unsplash.com/search/photos/`;

function App() {
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const searchRef = useRef();
  const mounted = useRef(false);
  const [query, setQuery] = useState("");
  const [newImages, setNewImages] = useState(false);
  const fetchData = async () => {
    try {
      setLoading(true);
      let url;
      const urlPage = `&page=${page}`;
      const queryUrl = `&query=`;
      if (query) {
        url = `${searchUrl}${clientID}${queryUrl}${query}`;
      } else {
        url = `${mainUrl}${clientID}${urlPage}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      setPhotos((oldPhotos) => {
        if (query && page === 1) {
          return data.results;
        } else if (query) {
          return [...oldPhotos, ...data.results];
        } else {
          return [...oldPhotos, ...data];
        }
      });
      setNewImages(false); //set switch back to off after getting data
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loading) return;
    fetchData();
  }, [page]);
  useEffect(() => {
    console.log("mounted.current", mounted.current);
    if (!mounted.current) {
      //this means that if we are in the initial render(which the mounted ref sets as false), we
      //set it back to true to know whether the component was rerendered.
      console.log(mounted.current);
      mounted.current = true;
      return;
    }
    //he two if statements below checks for both and when wea re at the point of
    if (!newImages) return;
    if (loading) return;
    setPage((oldPage) => oldPage + 1);
    console.log("initial render");
  }, [newImages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query) return;
    if (page === 1) {
      fetchData();
      return;
    }
    setPage(1);
  };

  const event = () => {
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) {
      setNewImages(true);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", event);

    return () => {
      window.removeEventListener("scroll", event);
    };
  }, []);

  return (
    <main>
      <section className="search">
        <form className="search-form">
          <input
            type="text"
            className="form-input"
            placeholder="search"
            ref={searchRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          ></input>
          <button type="submit" className="submit-btn" onClick={handleSubmit}>
            <FaSearch />
          </button>
        </form>
      </section>
      <section className="photos">
        <div className="photos-center">
          {photos.map((photo) => {
            return <Photo key={photo.id} {...photo}></Photo>;
          })}
        </div>
      </section>
    </main>
  );
}

export default App;
