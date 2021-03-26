import { useEffect, useState, useRef, useReducer } from 'react';

const initialStories = [
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
    }
];

const getAsyncStories = () =>
  new Promise(resolve =>
    setTimeout(
      () => resolve({ data: { stories: initialStories } }),
      2000
    )
  );

const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = useState(
    localStorage.getItem(key) || initialState
  );

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

const storiesReducer = (state, action) => {
  switch (action.type) {
    case 'STORIES_FETCH_INIT':
     return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case 'STORIES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter(
        story => action.payload.objectID !== story.objectID
        ),
      };
    default:
      throw new Error();
  }
};


const App = () => {
  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React');
  
  const [stories, dispatchStories] = useReducer(
    storiesReducer,
    { data: [], isLoading: false, isError: false }
  );

  useEffect(() => {
    dispatchStories({ type: 'STORIES_FETCH_INIT' });

    getAsyncStories()
      .then(result => {
        dispatchStories({
          type: 'STORIES_FETCH_SUCCESS',
          payload: result.data.stories,
        });
      })
      .catch(() =>
        dispatchStories({ type: 'STORIES_FETCH_FAILURE' })
      );
  }, []);

  const handleRemoveStory = item => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  };

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  };
  // Create a simple text component that renders a string and passes it as children to the
  // InputWithLabel component.

  const SimpleText = ({ children }) => (
    <strong>{children}</strong>
  );

  const searchedStories = stories.data.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>My Hacker Stories</h1>
      <InputWithLabel 
        id='search' 
        value={searchTerm} 
        isFocused 
        onInputChange={handleSearch}
      >
        <SimpleText><div>Search:</div></SimpleText>
      </InputWithLabel>
      
      <hr />
      
      {stories.isError && <p>Something went wrong ...</p>}
      
      {stories.isLoading ? (
        <p>Loading ...</p>
      ) : (
        <List
          list={searchedStories}
          onRemoveItem={handleRemoveStory}
        />
      )}
    </div>
  );
}


const InputWithLabel = ({ children, id, value, isFocused, type = 'text', onInputChange }) => {
  const inputRef = useRef();

  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <label htmlFor={id}>{children}</label> &nbsp;
      <input
        ref={inputRef}
        id={id}
        type={type} 
        value={value}
        autoFocus={isFocused} 
        onChange={onInputChange}
      />
    </>
  )
};

const List = ({ list, onRemoveItem }) =>
  list.map(item => <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />);

const Item = ({ item, onRemoveItem }) => (
  <div>
    <span>
      <a href={item.url}>{item.title}</a>
    </span>
    <span>{item.author}</span>
    <span>{item.num_comments}</span>
    <span>{item.points}</span>
    <span>
      <button type="button" onClick={() => onRemoveItem(item)}>
        Dismiss
      </button>
    </span>
  </div>
);

export default App;
