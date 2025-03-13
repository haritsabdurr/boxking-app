import DefaultLayout from '../components/DefaultLayout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, Table, Form, Input, message, Select } from 'antd';
import { useState, useEffect, useRef } from 'react';
import { baseUrl } from '../utils/url';
import { useDispatch, useSelector } from 'react-redux';
import { useReactToPrint } from 'react-to-print';
import {
  DeleteOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
  UserAddOutlined,
} from '@ant-design/icons';

const Cart = () => {
  const { cartItems } = useSelector((state) => state.rootReducer);
  const [subtotal, setSubtotal] = useState(0);

  const [buyerData, setBuyerData] = useState([]);
  const [custData, setCustData] = useState([]);
  const [invoiceData, setInvoiceData] = useState([]);

  const [formCustomer, setFormCustomer] = useState(false);
  const [inputCustomer, setInputCustomer] = useState(false);
  const [formOrder, setFormOrder] = useState(false);
  const [invoiceModal, setInvoiceModal] = useState(false);

  const dispatch = useDispatch();
  const componentRef = useRef();
  const navigate = useNavigate();

  const increaseQuantity = (record) => {
    dispatch({
      type: 'updateCart',
      payload: { ...record, quantity: record.quantity + 1 },
    });
  };

  const decreaseQuantity = (record) => {
    if (record.quantity !== 1) {
      dispatch({
        type: 'updateCart',
        payload: { ...record, quantity: record.quantity + -1 },
      });
    }
  };

  const onFinish = (values1) => {
    console.log(values1);
    axios
      .post(`${baseUrl}/customer/login`, values1)
      .then((response) => {
        localStorage.setItem('customer', JSON.stringify(response.data.data));
        setFormCustomer(false);
        setFormOrder(true);
        setBuyerData(JSON.parse(localStorage.getItem('customer')));
      })
      .catch((error) => {
        message.error('Try Again!');
      });
  };

  const onFinishCust = (values) => {
    axios
      .post(`${baseUrl}/customer`, values)
      .then((response) => {
        message.success(response.data);
        setInputCustomer(false);
        setFormCustomer(true);
      })
      .catch((err) => {
        message.error(err.response.data);
      });
  };

  const onFinishOrder = (valuesOrder) => {
    const reqOrder = {
      customer: JSON.parse(localStorage.getItem('customer')).customer_id,
      total: subtotal,
      customer_name: JSON.parse(localStorage.getItem('customer')).customer_name,
      customer_phone: JSON.parse(localStorage.getItem('customer'))
        .customer_phone,
      user: JSON.parse(localStorage.getItem('pos-user')).user_name,
      order_items: JSON.parse(localStorage.getItem('cartItems')),
    };

    axios
      .post(`${baseUrl}/order`, reqOrder)
      .then((response) => {
        console.log(response);
        message.success(response.data.message);
        setInvoiceModal(true);
        setFormOrder(false);
        localStorage.setItem('invoice', JSON.stringify(response.data.data));
        setInvoiceData(JSON.parse(localStorage.getItem('invoice')));
      })
      .catch((err) => {
        message.error(err.response.data);
        console.log(err.response);
      });

    const reqPayment = {
      ...valuesOrder,
      total: subtotal,
      customer_name: JSON.parse(localStorage.getItem('customer')).customer_name,
    };
  };

  const getCustomerData = () => {
    axios
      .get(`${baseUrl}/customer`)
      .then((response) => {
        setCustData(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const finishOrder = () => {
    localStorage.removeItem('customer');
    localStorage.removeItem('cartItems');
    localStorage.removeItem('invoice');
    setTimeout(() => {
      navigate('/home');
    }, 800);
  };

  useEffect(() => {
    let temp = 0;
    cartItems.forEach((item) => {
      temp = temp + item.product_price * item.quantity;
    });
    setSubtotal(temp);
  }, [cartItems]);

  useEffect(() => {
    getCustomerData();
  }, [onFinishCust]);

  const columns = [
    {
      title: 'Nama',
      dataIndex: 'product_name',
    },
    // {
    //   title: 'Gambar',
    //   dataIndex: 'product_img',
    //   render: (product_name, record) => (
    //     <img src={product_name} alt='gambar' width='70' height='70' />
    //   ),
    // },
    {
      title: 'Harga',
      dataIndex: 'product_price',
    },
    {
      title: 'Jumlah',
      dataIndex: 'product_id',
      render: (id, record) => (
        <div>
          <MinusCircleOutlined
            style={{ fontSize: '20px' }}
            className='mx-3'
            onClick={() => decreaseQuantity(record)}
          />
          <b>{record.quantity}</b>
          <PlusCircleOutlined
            style={{ fontSize: '20px' }}
            className='mx-3'
            onClick={() => increaseQuantity(record)}
          />
        </div>
      ),
    },
    {
      title: 'Hapus',
      dataIndex: 'product_id',
      render: (id, record) => (
        <DeleteOutlined
          style={{ fontSize: '20px', color: 'red' }}
          onClick={() => dispatch({ type: 'deleteFromCart', payload: record })}
        />
      ),
    },
  ];

  const invoiceColumns = [
    {
      title: 'Nama',
      dataIndex: 'product_name',
    },
    {
      title: 'Jumlah',
      dataIndex: 'product_id',
      render: (id, record) => (
        <div>
          <b>{record.quantity}</b>
        </div>
      ),
    },
    {
      title: 'Harga',
      dataIndex: 'product_price',
    },
    {
      title: 'Subtotal',
      dataIndex: 'product_price',
      render: (id, record) => (
        <div>
          <b>{record.quantity * record.product_price}</b>
        </div>
      ),
    },
  ];

  return (
    <DefaultLayout>
      <h4 style={{ fontSize: '20px', marginBottom: '20px' }}>Order List</h4>
      <Table columns={columns} dataSource={cartItems} bordered />
      <hr />
      <div className='d-flex justify-content-end flex-column align-items-end'>
        <h4>
          Subtotal : <b>Rp {subtotal}</b>
        </h4>
        <Button
          type='primary'
          size='medium'
          className='mt-2'
          onClick={() => setFormCustomer(true)}
        >
          Next
        </Button>
      </div>

      <Modal
        title='Find Customer'
        visible={formCustomer}
        footer={false}
        onCancel={() => setFormCustomer(false)}
      >
        <Form layout='vertical' onFinish={onFinish} className='py-2'>
          <Form.Item name='customer_name' label='Customer Name'>
            {/* <div className='d-flex gap-2'> */}
            <Select>
              {custData.map((cust, index) => (
                <Select.Option
                  key={index.customer_id}
                  value={cust.customer_name}
                >
                  {cust.customer_name} - ({cust.customer_phone})
                </Select.Option>
              ))}
            </Select>

            {/* </div> */}
          </Form.Item>
          <Button type='primary' onClick={() => setInputCustomer(true)}>
            <UserAddOutlined />
          </Button>
          <div className='d-flex justify-content-end'>
            <Button htmlType='submit' type='primary'>
              Next
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal
        title='Input New Customer'
        visible={inputCustomer}
        footer={false}
        onCancel={() => setInputCustomer(false)}
      >
        <Form layout='vertical' onFinish={onFinishCust}>
          <Form.Item name='customer_name' label='Customer Name'>
            <Input />
          </Form.Item>
          <Form.Item name='customer_phone' label='Customer Phone'>
            <Input />
          </Form.Item>

          <div className='d-flex justify-content-end'>
            <Button htmlType='submit' type='primary'>
              Save
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal
        title='Form Payment'
        visible={formOrder}
        footer={false}
        onCancel={() => setFormOrder(false)}
      >
        <Form layout='vertical' onFinish={onFinishOrder}>
          <div>
            <h4>
              Customer : {buyerData.customer_name} - ({buyerData.customer_phone}
              )
            </h4>
            {/* <h4>No. Telpon : {custData.customer_phone}</h4> */}
            <h5>Total : Rp.{subtotal}</h5>
          </div>
          <Form.Item
            name='payment_method'
            label='Payment Method'
            className='mt-4'
          >
            <Select>
              <Select.Option value='Cash'>Cash</Select.Option>
              <Select.Option value='Qris'>Qris</Select.Option>
              <Select.Option value='Bank Transfer'>Bank Transfer</Select.Option>
            </Select>
          </Form.Item>
          <div className='d-flex justify-content-end'>
            <Button htmlType='submit' type='primary'>
              Save
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal
        footer={false}
        visible={invoiceModal}
        onCancel={() => setInvoiceModal(false)}
        width={550}
      >
        <div className='card mt-4' ref={componentRef}>
          <div className='card-body'>
            <div className='container mb-1 mt-1'>
              <div className='row d-flex justify-content-center'>
                <div className='col-10 text-center'>
                  <p style={{ color: 'black', fontSize: '20px' }}>
                    <strong>Boxking Ricebox</strong>
                  </p>
                </div>

                <hr />
              </div>

              <div className='container'>
                <div className='row'>
                  <div className='col-6'>
                    <ul className='list-unstyled'>
                      <li className='text-muted'>
                        <i
                          className='fas fa-circle'
                          style={{ color: '#84B0CA' }}
                        ></i>{' '}
                        <span className='fw-bold'>To : </span>
                        {invoiceData.customer_name}
                      </li>
                      <li className='text-muted'>
                        <span className='fw-bold'>Date: </span>
                        {/* {invoiceData.createdAt} */}
                        {invoiceData.createdAt?.toString().substring(0, 10)}
                      </li>
                      <li className='text-muted'>
                        <i
                          className='fas fa-circle'
                          style={{ color: '#84B0CA' }}
                        ></i>{' '}
                        <span className='me-1 fw-bold'>Status:</span>
                        <span className='badge bg-success text-white fw-bold'>
                          Paid
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className='row my-2 justify-content-center'>
                  <Table
                    columns={invoiceColumns}
                    dataSource={cartItems}
                    pagination={false}
                    bordered
                  />
                </div>
                <div className='row'>
                  <div className='col-12'>
                    <p className='text-black float-end mb-0 mt-1'>
                      <span className='text-black me-3'> Total :</span>
                      <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                        Rp. {invoiceData.total}
                      </span>
                    </p>
                  </div>
                </div>
                <hr />
                <div className='row'>
                  <div className='col-12 text-center'>
                    <h5 className='fs-6'>Thank You For Your Purchase!</h5>
                    <h6 className='text-muted fst-italic -mt-3'>
                      OrderID : {invoiceData.order_id} | Collected By:{' '}
                      {invoiceData.user}
                    </h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='d-flex justify-content-center mt-3 gap-3'>
          <Button type='primary' onClick={handlePrint}>
            Print
          </Button>
          <Button
            type='primary'
            style={{ background: 'green', borderColor: 'green' }}
            onClick={finishOrder}
          >
            Finish
          </Button>
        </div>
      </Modal>
    </DefaultLayout>
  );
};

export default Cart;
