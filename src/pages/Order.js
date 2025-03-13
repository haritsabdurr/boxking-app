import { useState, useEffect } from 'react';
import { baseUrl } from '../utils/url';
import { Table, Row, Col, Statistic, Card } from 'antd';
import axios from 'axios';
import OwnerLayout from '../components/OwnerLayout';

const Order = () => {
  const [orderData, setOrderData] = useState([]);
  const [customerData, setCustomerData] = useState([]);

  const getAllOrder = () => {
    try {
      setTimeout(() => {
        axios.get(`${baseUrl}/order`).then((response) => {
          setOrderData(response.data);
        });
      }, 800);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllCustomer = () => {
    try {
      setTimeout(() => {
        axios.get(`${baseUrl}/customer`).then((response) => {
          setCustomerData(response.data);
        });
      }, 800);
    } catch (error) {
      console.log(error);
    }
  };

  const totalRevenue = orderData.map((order) => order.total);
  const orderItems = orderData.map((order) => order.order_items);

  const flatOrder = orderItems.reduce(
    (accumulator, currentValue) => accumulator.concat(currentValue),
    []
  );

  //Hitung total pendapatan
  const sum = totalRevenue.reduce((accumulator, currentValue) => {
    return accumulator + currentValue;
  }, 0);

  //Split array berdasarkan kategori
  function groupBy(arr, property) {
    return arr.reduce(function (memo, x) {
      if (!memo[x[property]]) {
        memo[x[property]] = [];
      }
      memo[x[property]].push(x);
      return memo;
    }, {});
  }

  var o = groupBy(flatOrder, 'category_name');
  var makanan = o.Makanan;
  var minuman = o.Minuman;

  //Check makanan terlaris
  const foodCounts = new Map();
  makanan?.forEach((element1) => {
    foodCounts.set(element1, (foodCounts.get(element1) || 0) + 1);
  });

  let mostFreqfood;

  foodCounts.forEach((freq1, items1) => {
    mostFreqfood = items1;
  });

  //Check minuman terlaris
  const drinkCounts = new Map();
  minuman?.forEach((element2) => {
    drinkCounts.set(element2, (drinkCounts.get(element2) || 0) + 1);
  });

  let mostFreqdrink;

  drinkCounts.forEach((freq2, items2) => {
    mostFreqdrink = items2;
  });

  useEffect(() => {
    getAllOrder();
    getAllCustomer();
    console.log(orderData);
  }, []);

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'order_id',
    },
    {
      title: 'Nama Customer',
      dataIndex: 'customer_name',
    },
    {
      title: 'Items',
      dataIndex: 'order_items',
      render: (order_items) =>
        order_items.map((items) => items.product_name).join(', '),
      key: 'order_items',
    },
    {
      title: 'Total Belanja',
      dataIndex: 'total',
    },
    {
      title: 'Handler',
      dataIndex: 'user',
    },
    {
      title: 'Tanggal Belanja',
      dataIndex: 'createdAt',
      render: (id, tanggal) => (
        <p className='mt-1'>{tanggal.createdAt.toString().substring(0, 10)}</p>
      ),
    },
  ];

  return (
    <OwnerLayout>
      <Row gutter={16}>
        <Col span={8}>
          <Card bordered={true}>
            <Statistic
              title='Jumlah Order'
              value={orderData.length}
              valueStyle={{
                color: '#3f8600',
                fontWeight: 600,
                fontSize: '32px',
              }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={true}>
            <Statistic
              title='Jumlah Customer'
              value={customerData.length}
              valueStyle={{
                color: '#3124E2',
                fontWeight: 600,
                fontSize: '32px',
              }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={true}>
            <Statistic
              title='Total Pemasukan'
              value={sum}
              precision={2}
              valueStyle={{
                color: '#E61EE1',
                fontWeight: 600,
                fontSize: '32px',
              }}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: '16px' }}>
        <Col span={12}>
          <Card bordered={true}>
            <Statistic
              title='Makanan Terlaris'
              value={mostFreqfood?.product_name}
              valueStyle={{
                color: '#C34A36',
                fontWeight: 600,
                fontSize: '32px',
              }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card bordered={true}>
            <Statistic
              title='Minuman Terlaris'
              value={mostFreqdrink?.product_name}
              valueStyle={{
                color: '#845EC2',
                fontWeight: 600,
                fontSize: '32px',
              }}
            />
          </Card>
        </Col>
      </Row>
      <hr />
      <div className='d-flex justify-content-between my-2 mt-4'>
        <h3 className='mb-4'>Order List</h3>
      </div>
      <Table
        columns={columns}
        dataSource={orderData}
        pagination={{ pageSize: 5 }}
      />
    </OwnerLayout>
  );
};

export default Order;
