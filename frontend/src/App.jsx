import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import LoginPage from "./pages/LoginPage";
import GeneralCategoriesPage from "./pages/GeneralCategoriesPage";
import SpecificPlantsPage from "./pages/SpecificPlantsPage";
import UserListPage from "./pages/UserListPage";
import DashboardPage from "./pages/DashboardPage";
import SuggestionsPage from "./pages/SuggestionPage";
import TaxonomyFormPage from "./pages/TaxonomyFormPage";
import TaxonomyViewPage from "./pages/TaxonomyViewPage";
import AddSpecificPlantPage from "./pages/AddSpecificPlantPage";
import EditSpecificPlantPage from "./pages/EditSpecificPlantPage";
import AddGeneralPlantPage from "./pages/AddGeneralPlantPage";
import EditGeneralPlantPage from "./pages/EditGeneralPlantPage";
import AddChemicalPage from "./pages/AddChemicalPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/specific-plants"
            element={
              <PrivateRoute>
                <SpecificPlantsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/specific-plants/add"
            element={
              <PrivateRoute>
                <AddSpecificPlantPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/specific-plants/edit/:id"
            element={
              <PrivateRoute>
                <EditSpecificPlantPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/taxonomy"
            element={
              <PrivateRoute>
                <TaxonomyViewPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/taxonomy/add"
            element={
              <PrivateRoute>
                <TaxonomyFormPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/general-categories"
            element={
              <PrivateRoute>
                <GeneralCategoriesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/suggestions"
            element={
              <PrivateRoute>
                <SuggestionsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/users"
            element={
              <PrivateRoute>
                <UserListPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/general-categories/add"
            element={
              <PrivateRoute>
                <AddGeneralPlantPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/general-categories/edit/:id"
            element={
              <PrivateRoute>
                <EditGeneralPlantPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/chemical-comp"
            element={
              <PrivateRoute>
                <AddChemicalPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
