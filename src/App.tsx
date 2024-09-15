import './App.css'

import {BrowserRouter, Route,  Routes} from "react-router-dom";
import Board from "./views/Board.tsx";
import Thread from "./views/Thread.tsx";
import {useMobileDetect} from "./effects/useMobileDetect.ts";
import {SnackbarProvider} from "notistack";

function App() {
    const isMobile = useMobileDetect();

    return (
      <>
          <SnackbarProvider />
          <BrowserRouter>
              <Routes>
                  <Route path="/" element={<Board isMobile={isMobile}/>}></Route>
                  <Route path="/thread/:id" element={<Thread />} />
              </Routes>
          </BrowserRouter>
      </>

  )
}

export default App