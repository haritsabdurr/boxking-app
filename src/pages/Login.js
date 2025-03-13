import axios from 'axios';
import { Button, Form, Input, Row, Col, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../utils/url';
import { useEffect } from 'react';

const Login = () => {
  const navigate = useNavigate();

  const onFinish = (values) => {
    axios
      .post(`${baseUrl}/user/login`, values)
      .then((response) => {
        message.success(`Welcome, ${values.user_name}!`);
        localStorage.setItem('pos-user', JSON.stringify(response.data.data));
        localStorage.setItem(
          'role-user',
          JSON.stringify(response.data.data.user_position)
        );
        setTimeout(() => {
          const user = JSON.parse(localStorage.getItem('role-user'));
          if (user === 'Staff') {
            navigate('/home');
          } else if (user === 'Owner') {
            navigate('/order');
          }
        }, 900);
      })
      .catch((error) => {
        message.error(`${error.response.data.message}!, Try again`);
      });
  };

  useEffect(() => {
    onFinish();
  }, []);

  return (
    <div className='auth'>
      <Row>
        <Col lg={8}>
          <div className='border rounded p-4 bg-white'>
            <h3 className='text-center mb-4'>Login To Your Account</h3>
            <Form layout='vertical' onFinish={onFinish}>
              <Form.Item name='user_name' label='Username'>
                <Input />
              </Form.Item>
              <Form.Item name='user_password' label='Password'>
                <Input.Password />
              </Form.Item>

              <div className='d-flex justify-content-center py-2'>
                <Button htmlType='submit' type='primary'>
                  Login
                </Button>
              </div>
            </Form>
            <p className='text-center mt-3'>
              Dont Have an Account?{' '}
              <span
                className='fw-bold text-decoration-underline'
                onClick={() => navigate('/register')}
              >
                <a>Register</a>
              </span>{' '}
            </p>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
