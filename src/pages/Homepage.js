import { useState, useEffect } from 'react';
import DefaultLayout from '../components/DefaultLayout';
import { baseUrl } from '../utils/url';
import axios from 'axios';
import { Row, Col, Button } from 'antd';
import ProductCard from '../components/ProductCard';
import '../resources/Card.css';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
  const [productData, setProductData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const categories = [
    {
      name: 'Semua',
    },
    {
      name: 'Makanan',
    },
    {
      name: 'Minuman',
    },
    {
      name: 'Snack',
    },
  ];

  const getAllProduct = () => {
    dispatch({ type: 'showLoading' });
    try {
      setTimeout(() => {
        axios.get(`${baseUrl}/product`).then((response) => {
          dispatch({ type: 'hideLoading' });
          console.log(response.data);
          setProductData(response.data);
        });
      }, 800);
    } catch (error) {
      setTimeout(() => {
        dispatch({ type: 'showLoading' });
      }, 5000);
      console.log(error);
    }
  };

  const filteredProduct = productData.filter((newProduct) => {
    if (selectedCategory === 'Makanan') {
      return newProduct.category_name === 'Makanan';
    } else if (selectedCategory === 'Minuman') {
      return newProduct.category_name === 'Minuman';
    } else if (selectedCategory === 'Snack') {
      return newProduct.category_name === 'Snack';
    } else if (selectedCategory === 'Semua') {
      return newProduct;
    }
  });

  const roleRoute = () => {
    let role = localStorage.getItem('role-user');

    if (role === 'Staff') {
      navigate('/home');
    } else if (role === 'Owner') {
      navigate('/customer');
    }
  };

  useEffect(() => {
    getAllProduct();
    roleRoute();
  }, []);

  return (
    <DefaultLayout>
      <div className='d-flex'>
        {categories.map((category) => {
          return (
            <div className='d-flex category'>
              <Button
                type={`${
                  selectedCategory === category.name ? 'primary' : 'default'
                }`}
                size='large'
                onClick={() => setSelectedCategory(category.name)}
              >
                {category.name}
              </Button>
            </div>
          );
        })}
      </div>
      <hr />
      <Row gutter={25}>
        {filteredProduct?.map((item, index) => (
          <Col span={6}>
            <ProductCard item={item} />
          </Col>
        ))}
      </Row>
    </DefaultLayout>
  );
};

export default Homepage;
