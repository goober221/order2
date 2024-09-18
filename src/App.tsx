import './App.css'

import {BrowserRouter, Route,  Routes} from "react-router-dom";
import Board from "./views/Board.tsx";
import Thread from "./views/Thread.tsx";
import {useMobileDetect} from "./effects/useMobileDetect.ts";
import {SnackbarProvider} from "notistack";
import SideMenu from "./views/SideMenu.tsx";
import {parseFavedThreads} from "./helpers/thread-management.ts";
import {FavedThread} from "./models/Thread.ts";
import {useState} from "react";

function App() {
    const isMobile = useMobileDetect();
    const [favedThreads, setFavedThreads] = useState<FavedThread[]>(parseFavedThreads());

    return (
      <>
          <SnackbarProvider />
          <SideMenu favedThreads={favedThreads} setFavedThreads={setFavedThreads}/>
          <BrowserRouter>
              <Routes>
                  <Route path="/" element={<Board isMobile={isMobile} favedThreads={favedThreads} setFavedThreads={setFavedThreads}/>}></Route>
                  <Route path="/thread/:id" element={<Thread />} />
              </Routes>
          </BrowserRouter>
      </>

  )
}

export default App