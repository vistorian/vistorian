import './App.css'
// import { createUseStyles } from 'react-jss'
import { 
  createBrowserRouter, 
  RouterProvider,
  HashRouter, Routes, Route
} from "react-router-dom"

import Landing from './components/landing'
import Editor from './components/editor'
import Vis from './components/vis'

// let router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Landing />,
//   },{
//     path: "/editor",
//     element: <Editor />
//   }, {
//     path: "/vis/:visType/network/:network",
//     element: <Vis />,
//   }
// ]);

function App() {
  return (
    <>
      {/* <RouterProvider router={router} /> */}
      {/* <Footer /> */}
      <HashRouter>
        <Routes>
          <Route path="/" element={<Landing />}></Route>
          <Route path="/editor" element={<Editor />}></Route>
          <Route path="/vis/:visType/network/:network" element={<Vis />}></Route>
        </Routes>
      </HashRouter>
    </>
  )
}

function Footer() {
  return (
    <div id='footer'>
      <a href="https://vishub.net/" target="_blank">
        <img src="./logos/logo-vishub.png" className='logo' />
      </a>
      <a href="https://www.ed.ac.uk/" target="_blank">
        <img src="./logos/logo-edinburgh.png" className='logo' />
      </a>
    </div>
  )
}

export default App
