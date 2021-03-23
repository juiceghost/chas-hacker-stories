import React, { useEffect, useState } from 'react';

const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = useState(
    localStorage.getItem(key) || initialState
  );

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [value]);

  return [value, setValue];
};


const App = () => {

  const stories = [
    {
      title: 'React',
      url: 'https://reactjs.org/',
      author: 'Jordan Walke',
      num_comments: 3,
      points: 4,
      objectID: 0,
    }, {
      title: 'Redux',
      url: 'https://redux.js.org/',
      author: 'Dan Abramov, Andrew Clark',
      num_comments: 2,
      points: 5,
      objectID: 1,
    }, {
      title: 'Krillframework',
      url: 'https://kfw.org/',
      author: 'Dr Krillzorz',
      num_comments: 0,
      points: 400,
      objectID: 2,
    }];

  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'Redux');

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  };
  // Create a simple text component that renders a string and passes it as children to the
  // InputWithLabel component.

  const SimpleText = ({ children }) => (
    <strong>{children}</strong>
  );
  const searchedStories = stories.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>My Hacker Stories</h1>
      <InputWithLabel id='search' value={searchTerm} onInputChange={handleSearch}>
        <SimpleText><div>Search:</div></SimpleText>
      </InputWithLabel>
      <hr />
      <List list={searchedStories} />
    </div>);
}


const InputWithLabel = ({ children, id, value, type = 'text', onInputChange }) => (
  <>
    <label htmlFor={id}>{children}</label> &nbsp;
    <input
      id={id}
      type={type} value={value} onChange={onInputChange}
    />
  </>
);

const List = ({ list }) =>
  list.map(item => <Item key={item.objectID} item={item} />);

const Item = ({ item }) => (
  <div>
    <span>
      <a href={item.url}>{item.title}</a>
    </span>
    <span>{item.author}</span>
    <span>{item.num_comments}</span>
    <span>{item.points}</span>
  </div>
);

export default App;
