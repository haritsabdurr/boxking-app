import { useState, useEffect } from 'react';
import { baseUrl } from '../utils/url';
import { Button, Table, Modal } from 'antd';
import axios from 'axios';
import OwnerLayout from '../components/OwnerLayout';

const Customer = () => {
  const [customerData, setCustomerData] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [customerOrder, setCustomerOrder] = useState([]);
  const [customer, setCustomer] = useState([]);

  const [ordarModal, setOrderModal] = useState(false);

  const getAllCustomer = () => {
    try {
      axios.get(`${baseUrl}/customer`).then((response) => {
        setCustomerData(response.data);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getOrderData = () => {
    try {
      axios.get(`${baseUrl}/order`).then((response) => {
        setOrderData(response.data);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCustomer();
    getOrderData();
  }, []);

  const columns = [
    {
      title: 'ID Customer',
      dataIndex: 'customer_id',
    },
    {
      title: 'Nama',
      dataIndex: 'customer_name',
    },
    {
      title: 'Nomor Telepon',
      dataIndex: 'customer_phone',
    },
    {
      title: 'Riwayat Order',
      dataIndex: '_id',
      render: (id, record) => (
        <div className='d-flex'>
          <Button
            type='primary'
            onClick={() => {
              setCustomerOrder(
                orderData.filter(
                  (order) => order.customer === record.customer_id
                )
              );
              setCustomer(record);
              setOrderModal(true);
            }}
          >
            Lihat
          </Button>
        </div>
      ),
    },
  ];

  let product = orderData.order_items;

  const columnsOrder = [
    {
      title: 'ID Order',
      dataIndex: 'order_id',
    },

    {
      title: 'Tanggal Belanja',
      dataIndex: 'createdAt',
      render: (id, tanggal) => (
        <p className='mt-1'>{tanggal.createdAt.toString().substring(0, 10)}</p>
      ),
    },
    {
      title: 'Nominal Belanja',
      dataIndex: 'total',
    },
    // {
    //   title: 'Order Item',
    //   dataIndex: 'product_id',
    //   children: product?.map((order) => {
    //     return {
    //       render: (order) => <span>{order.product_name}</span>,
    //     };
    //   }),
    // },
  ];

  return (
    <OwnerLayout>
      <div className='d-flex justify-content-between my-2'>
        <h3 className='mb-4'>Customer List</h3>
      </div>
      <hr />

      <Table columns={columns} dataSource={customerData} />

      <Modal
        title='Riwayat Order'
        onCancel={() => setOrderModal(false)}
        visible={ordarModal}
        footer={false}
        width={700}
        bodyStyle={{ height: 450 }}
      >
        <div className='mt-3'>
          <h6 className='fs-6 mb-0'>Customer : {customer.customer_name}</h6>
          <h6 className='fs-6'>Telepon : {customer.customer_phone}</h6>
        </div>

        <Table
          columns={columnsOrder}
          dataSource={customerOrder}
          pagination={{ pageSize: 4 }}
        />
      </Modal>
    </OwnerLayout>
  );
};

export default Customer;
