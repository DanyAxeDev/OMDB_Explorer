import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SearchComponent from "./pages/SearchComponent";
import Details from "./pages/Details";
import Favs from "./pages/Favs";
import { FavoritesProvider } from "./context/FavoritesContext";

function App() {
    return (
        <div>
            <FavoritesProvider>
                <Router>
                    <main>
                        <Routes>
                            <Route path="/" element={<SearchComponent />} />
                            <Route path="/details/:title" element={<Details />} />
                            <Route path="/favs" element={<Favs />} />
                        </Routes>
                    </main>
                </Router>
            </FavoritesProvider>
        </div>
    )
}

export default App;