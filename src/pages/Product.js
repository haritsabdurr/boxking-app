import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { baseUrl } from '../utils/url';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Select, Table, message } from 'antd';
import DefaultLayout from '../components/DefaultLayout';
import axios from 'axios';

const Product = () => {
  const [productData, setProductData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  // const [subCategoryData, setSubCategoryData] = useState([]);
  const [modalVisibility, setModalVisibility] = useState(false);
  const [editedProduct, setEditedProduct] = useState(null);
  const dispatch = useDispatch();

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

  const getAllCategory = () => {
    try {
      axios.get(`${baseUrl}/category`).then((response) => {
        setCategoryData(response.data);
      });
    } catch (error) {
      console.log(error);
    }
  };

  // const getAllSubCategory = () => {
  //   try {
  //     axios.get(`${baseUrl}/subcategory`).then((response) => {
  //       setSubCategoryData(response.data);
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const deleteProduct = (record) => {
    try {
      axios
        .delete(`${baseUrl}/product/${record.product_id}`, {
          product_id: record.product_id,
        })
        .then((response) => {
          console.log(response.data);
          message.success('Berhasil Menghapus Produk!');
          setEditedProduct(null);
          setModalVisibility(false);
          getAllProduct();
        });
    } catch (error) {
      console.log(error);
      message.error('Gagal Menghapus Produk!');
    }
  };

  const onFinish = (values) => {
    if (editedProduct === null) {
      try {
        axios.post(`${baseUrl}/product`, values).then((response) => {
          console.log(response.data);
          message.success('Berhasil Menambahkan Produk!');
          setModalVisibility(false);
          getAllProduct();
        });
      } catch (error) {
        console.log(error);
        message.error('Gagal Menambahkan Produk!');
      }
    } else {
      try {
        axios
          .put(`${baseUrl}/product/${editedProduct.product_id}`, {
            ...values,
            product_id: editedProduct.product_id,
          })
          .then((response) => {
            console.log(response.data);
            message.success('Berhasil Mengedit Produk!');
            setEditedProduct(null);
            setModalVisibility(false);
            getAllProduct();
          });
      } catch (error) {
        console.log(error);
        message.error('Gagal Mengedit Produk!');
      }
    }
  };

  useEffect(() => {
    getAllProduct();
    getAllCategory();
    // getAllSubCategory();
  }, []);

  const columns = [
    // {
    //   title: 'Produk',
    //   dataIndex: 'product_img',
    //   render: (product_name, record) => (
    //     <img src={product_name} alt='gambar' width='75' height='75' />
    //   ),
    // },
    {
      title: 'ID Produk',
      dataIndex: 'product_id',
    },
    {
      title: 'Nama',
      dataIndex: 'product_name',
    },
    {
      title: 'Deskripsi',
      dataIndex: 'product_desc',
    },
    {
      title: 'Kategori',
      dataIndex: 'category_name',
    },
    {
      title: 'Harga',
      dataIndex: 'product_price',
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
              setEditedProduct(record);
              setModalVisibility(true);
              console.log(record.product_id);
            }}
          />
          <DeleteOutlined
            className='mx-2'
            style={{ fontSize: '20px', color: 'red' }}
            onClick={() => deleteProduct(record)}
          />
        </div>
      ),
    },
  ];

  return (
    <DefaultLayout>
      <div className='d-flex justify-content-between my-2'>
        <h3 className='mb-4'>Product List</h3>
        <Button type='primary' onClick={() => setModalVisibility(true)}>
          Add Product
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={productData}
        pagination={{ pageSize: 4 }}
      />

      {modalVisibility && (
        <Modal
          onCancel={() => {
            setModalVisibility(false);
            setEditedProduct(null);
          }}
          visible={modalVisibility}
          footer={false}
          title={`${editedProduct !== null ? 'Edit Product' : 'Add Product'}`}
        >
          <Form
            layout='vertical'
            onFinish={onFinish}
            initialValues={editedProduct}
          >
            <Form.Item name='product_name' label='Product Name'>
              <Input />
            </Form.Item>
            <Form.Item name='product_desc' label='Product Description'>
              <Input />
            </Form.Item>
            {/* <Form.Item name='product_img' label='Image URL'>
              <Input />
            </Form.Item> */}
            <Form.Item name='product_price' label='Product Price'>
              <Input />
            </Form.Item>
            {/* <Form.Item name='subcategory_name' label='Product Subcategory'>
              <Select>
                {subCategoryData.map((subcategory, index) => (
                  <Select.Option
                    key={index.subcategory_id}
                    value={subcategory.subcategory_name}
                  >
                    {subcategory.subcategory_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item> */}
            <Form.Item name='category_name' label='Product Category'>
              <Select>
                {categoryData.map((category, index) => (
                  <Select.Option
                    key={index.category_id}
                    value={category.category_name}
                  >
                    {category.category_name}
                  </Select.Option>
                ))}
              </Select>
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

export default Product;
