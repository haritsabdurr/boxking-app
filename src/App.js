import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Homepage from './pages/Homepage';
import Cart from './pages/Cart';
import Product from './pages/Product';
import Category from './pages/Category';
import Login from './pages/Login';
import Register from './pages/Register';
import Order from './pages/Order';
import Customer from './pages/Customer';
import Payment from './pages/Payment';

function App() {
  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />

          <Route
            path='/home'
            element={
              <ProtectedRoute>
                <Homepage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/cart'
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path='/product'
            element={
              <ProtectedRoute>
                <Product />
              </ProtectedRoute>
            }
          />
          <Route
            path='/category'
            element={
              <ProtectedRoute>
                <Category />
              </ProtectedRoute>
            }
          />
          <Route
            path='/payment'
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />

          <Route
            path='/order'
            element={
              <ProtectedRoute>
                <Order />
              </ProtectedRoute>
            }
          />
          <Route
            path='/customer'
            element={
              <ProtectedRoute>
                <Customer />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

export function ProtectedRoute({ children }) {
  if (localStorage.getItem('pos-user')) {
    return children;
  } else {
    return <Navigate to='/' />;
  }
}

export function userRoute() {
  const user = JSON.parse(localStorage.getItem('pos-user'));

  if (user.user_position === 'Owner') {
    return (
      <>
        <Customer />
        <Order />
      </>
    );
  }
}

export function ownerRoute() {
  const user = JSON.parse(localStorage.getItem('pos-user'));

  if (user.user_position === 'Staff') {
    return (
      <>
        <Homepage />
        <Cart />
        <Category />
        <Product />
      </>
    );
  }
}
