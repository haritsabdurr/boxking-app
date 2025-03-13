import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { baseUrl } from '../utils/url';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Table, message } from 'antd';
import DefaultLayout from '../components/DefaultLayout';
import axios from 'axios';

const Payment = () => {
  const [paymentData, setPaymentData] = useState([]);
  const [modalVisibility, setModalVisibility] = useState(false);
  const [editedPayment, setEditedPayment] = useState(null);
  const dispatch = useDispatch();

  const getAllPayment = () => {
    dispatch({ type: 'showLoading' });
    try {
      setTimeout(() => {
        axios.get(`${baseUrl}/method`).then((response) => {
          dispatch({ type: 'hideLoading' });
          console.log(response.data);
          setPaymentData(response.data);
        });
      }, 800);
    } catch (error) {
      setTimeout(() => {
        dispatch({ type: 'showLoading' });
      }, 5000);
      console.log(error);
    }
  };

  const deletePayment = (record) => {
    try {
      axios
        .delete(`${baseUrl}/method/${record.method_id}`, {
          method_id: record.method_id,
        })
        .then((response) => {
          console.log(response.data);
          message.success('Berhasil Menghapus Metode Bayar!');
          setEditedPayment(null);
          setModalVisibility(false);
          getAllPayment();
        });
    } catch (error) {
      console.log(error);
      message.error('Gagal Menghapus Metode Bayar!');
    }
  };

  const onFinish = (values) => {
    if (editedPayment === null) {
      try {
        axios.post(`${baseUrl}/method`, values).then((response) => {
          console.log(response.data);
          message.success('Berhasil Menambahkan Metode Pembayaran!');
          setModalVisibility(false);
          getAllPayment();
        });
      } catch (error) {
        console.log(error);
        message.error('Gagal Menambahkan Metode Pembayaran!');
      }
    } else {
      try {
        axios
          .put(`${baseUrl}/method/${editedPayment.method_id}`, {
            ...values,
            method_id: editedPayment.method_id,
          })
          .then((response) => {
            console.log(response.data);
            message.success('Berhasil Mengedit Metode Pembayaran!');
            setEditedPayment(null);
            setModalVisibility(false);
            getAllPayment();
          });
      } catch (error) {
        console.log(error);
        message.error('Gagal Mengedit Produk!');
      }
    }
  };

  useEffect(() => {
    getAllPayment();
  }, []);

  const columns = [
    {
      title: 'ID Metode Bayar',
      dataIndex: 'method_id',
    },
    {
      title: 'Nama Metode Bayar',
      dataIndex: 'payment_method',
    },
    {
      title: 'Deskripsi',
      dataIndex: 'payment_desc',
    },
    {
      title: 'Action',
      dataIndex: '_id',
      render: (id, record) => (
        <div className='d-flex'>
          <EditOutlined
            className='mx-2'
            style={{ fontSize: '20px', color: 'Gold' }}
            onClick={() => {
              setEditedPayment(record);
              setModalVisibility(true);
              console.log(record.method_id);
            }}
          />
          <DeleteOutlined
            className='mx-2'
            style={{ fontSize: '20px', color: 'red' }}
            onClick={() => deletePayment(record)}
          />
        </div>
      ),
    },
  ];

  return (
    <DefaultLayout>
      <div className='d-flex justify-content-between my-2'>
        <h3 className='mb-4'>Payment Method List</h3>
        <Button type='primary' onClick={() => setModalVisibility(true)}>
          Add Payment Method
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={paymentData}
        pagination={{ pageSize: 4 }}
      />

      {modalVisibility && (
        <Modal
          onCancel={() => {
            setModalVisibility(false);
            setEditedPayment(null);
          }}
          visible={modalVisibility}
          footer={false}
          title={`${
            editedPayment !== null
              ? 'Edit Payment Method'
              : 'Add Payment Method'
          }`}
        >
          <Form
            layout='vertical'
            onFinish={onFinish}
            initialValues={editedPayment}
          >
            <Form.Item name='payment_method' label='Payment Method Name'>
              <Input />
            </Form.Item>
            <Form.Item name='payment_desc' label='Payment Method Description'>
              <Input />
            </Form.Item>

            <div className='d-flex justify-content-end'>
              <Button htmlType='submit' type='primary'>
                Save
              </Button>
            </div>
          </Form>
        </Modal>
      )}
    </DefaultLayout>
  );
};

export default Payment;
