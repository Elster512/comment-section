import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import Addcomment from './components/Addcomment';
import Comments from './components/Comments';
import { useEffect } from 'react';
import { loadUser } from './store/userSlice';

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);
  return (
    <div className="App">
      <Comments />
      <Addcomment />
    </div>
  );
}

export default App;
