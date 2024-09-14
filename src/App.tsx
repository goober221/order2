import './App.css'

import {BrowserRouter, Route,  Routes} from "react-router-dom";
import Board from "./views/Board.tsx";
import Thread from "./views/Thread.tsx";

function App() {
  return (
      <>
          <BrowserRouter>
              <Routes>
                  <Route path="/" element={<Board />}></Route>
                  <Route path="/thread/:id" element={<Thread />} />
              </Routes>
          </BrowserRouter>
      </>

  )
}

export default App