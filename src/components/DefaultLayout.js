import { useEffect } from 'react';
import {
  HomeOutlined,
  TeamOutlined,
  WalletOutlined,
  TransactionOutlined,
  ShopOutlined,
  LogoutOutlined,
  ShoppingCartOutlined,
  GoldOutlined,
} from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import '../resources/Layout.css';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
const { Header, Content, Footer, Sider } = Layout;

const DefaultLayout = (props) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const navigate = useNavigate();

  const { cartItems, loading } = useSelector((state) => state.rootReducer);

  const logoutHandler = () => {
    localStorage.removeItem('pos-user');
    localStorage.removeItem('role-user');
    localStorage.removeItem('customer');
    localStorage.removeItem('cartItems');
    localStorage.removeItem('invoice');
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <Layout>
      {loading && (
        <div className='spinner'>
          <div class='spinner-border' role='status' />
        </div>
      )}
      <Sider
        breakpoint='lg'
        collapsedWidth='0'
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <div className='demo-logo-vertical'>
          <h3>Boxking</h3>
        </div>

        <Menu
          theme='dark'
          mode='inline'
          defaultSelectedKeys={window.location.pathname}
        >
          <hr />
          <Menu.Item key='/home' icon={<HomeOutlined />}>
            <Link to='/home' style={{ textDecoration: 'none' }}>
              Home
            </Link>
          </Menu.Item>

          <Menu.Item key='/product' icon={<ShopOutlined />}>
            <Link to='/product' style={{ textDecoration: 'none' }}>
              Product Data
            </Link>
          </Menu.Item>
          <Menu.Item key='/category' icon={<GoldOutlined />}>
            <Link to='/category' style={{ textDecoration: 'none' }}>
              Category Data
            </Link>
          </Menu.Item>
          <Menu.Item key='/payment' icon={<WalletOutlined />}>
            <Link to='/payment' style={{ textDecoration: 'none' }}>
              Payment Data
            </Link>
          </Menu.Item>
          <hr />
          <Menu.Item
            key='logout'
            icon={<LogoutOutlined />}
            onClick={logoutHandler}
          >
            Logout
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            margin: '0 16px 0 16px',
          }}
        >
          <div
            className='cart-count d-flex align-items-center m-3'
            role='button'
            onClick={() => navigate('/cart')}
          >
            <h5 style={{ marginTop: '5px', marginRight: '4px' }}>
              {cartItems.length}
            </h5>
            <ShoppingCartOutlined
              style={{ fontSize: '24px', color: 'royalblue' }}
            />
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px 0',
          }}
        >
          <div
            style={{
              padding: 24,
              minHeight: 672,
              background: colorBgContainer,
            }}
          >
            {props.children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DefaultLayout;
