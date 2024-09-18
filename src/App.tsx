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
import Header from "./components/Header.tsx";
import {getNsfwMode} from "./services/board-settings.ts";

function App() {
    const isMobile = useMobileDetect();
    const [favedThreads, setFavedThreads] = useState<FavedThread[]>(parseFavedThreads());
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [nsfwMode, setNsfwMode] = useState<boolean>(getNsfwMode());
    const [loading, setLoading] = useState<boolean>(true);

    return (
      <>
          <SnackbarProvider />
          <SideMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} isScrolled={isScrolled} favedThreads={favedThreads} setFavedThreads={setFavedThreads}/>
          <Header loading={loading} setNsfwMode={setNsfwMode} isScrolled={isScrolled} setIsScrolled={setIsScrolled}></Header>
          <BrowserRouter>
              <Routes>
                  <Route path="/" element={<Board loading={loading} isMobile={isMobile} favedThreads={favedThreads} nsfwMode={nsfwMode} setLoading={setLoading} setFavedThreads={setFavedThreads}/>}></Route>
                  <Route path="/thread/:id" element={<Thread />} />
              </Routes>
          </BrowserRouter>
      </>

  )
}

export default App