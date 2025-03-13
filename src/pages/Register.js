import { useEffect } from 'react';
import { Button, Col, Form, Input, Row, Select, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../resources/Auth.css';
import { baseUrl } from '../utils/url';

const Register = () => {
  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log(values);
    try {
      axios.post(`${baseUrl}/user`, values).then((response) => {
        console.log(response);
        message.success('User Registered Successfully!');
        setTimeout(() => {
          navigate('/');
        }, 900);
      });
    } catch (error) {
      message.error(error);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('pos-user')) navigate('/home');
  }, []);

  return (
    <div className='auth'>
      <Row>
        <Col lg={8}>
          <div className='border rounded p-4 bg-white'>
            <h3 className='text-center mb-4'>Create Account</h3>
            <Form layout='vertical' onFinish={onFinish}>
              <Form.Item name='user_name' label='Username'>
                <Input />
              </Form.Item>
              <Form.Item name='user_email' label='Email'>
                <Input />
              </Form.Item>
              <Form.Item name='user_password' label='Password'>
                <Input.Password />
              </Form.Item>
              <Form.Item name='user_position' label='Position'>
                <Select>
                  <Select.Option value='Owner'>Owner</Select.Option>
                  <Select.Option value='Staff'>Staff</Select.Option>
                </Select>
              </Form.Item>
              <div className='d-flex justify-content-center py-2'>
                <Button htmlType='submit' type='primary'>
                  Register
                </Button>
              </div>
            </Form>
            <p className='text-center mt-3'>
              Already Have Account?{' '}
              <span
                className='fw-bold text-decoration-underline'
                onClick={() => navigate('/')}
              >
                <a>Login</a>
              </span>{' '}
            </p>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Register;
