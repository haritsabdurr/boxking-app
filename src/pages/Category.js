import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { baseUrl } from '../utils/url';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Table, message, Select } from 'antd';
import DefaultLayout from '../components/DefaultLayout';
import axios from 'axios';

const Category = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [modalVisibility, setModalVisibility] = useState(false);
  const [editedCategory, setEditedCategory] = useState(null);

  const [subcategoryData, setSubcategoryData] = useState([]);
  const [modal2Visibility, setModal2Visibility] = useState(false);
  const [editedSubcategory, setEditedSubcategory] = useState(null);
  const dispatch = useDispatch();

  const getAllCategory = () => {
    dispatch({ type: 'showLoading' });
    try {
      setTimeout(() => {
        axios.get(`${baseUrl}/category`).then((response) => {
          dispatch({ type: 'hideLoading' });
          console.log(response.data);
          setCategoryData(response.data);
        });
      }, 800);
    } catch (error) {
      setTimeout(() => {
        dispatch({ type: 'showLoading' });
      }, 5000);
      console.log(error);
    }
  };

  // const getAllSubcategory = () => {
  //   dispatch({ type: 'showLoading' });
  //   try {
  //     setTimeout(() => {
  //       axios.get(`${baseUrl}/subcategory`).then((response) => {
  //         dispatch({ type: 'hideLoading' });
  //         console.log(response.data);
  //         setSubcategoryData(response.data);
  //       });
  //     }, 800);
  //   } catch (error) {
  //     setTimeout(() => {
  //       dispatch({ type: 'showLoading' });
  //     }, 5000);
  //     console.log(error);
  //   }
  // };

  const deleteCategory = (record) => {
    try {
      axios
        .delete(`${baseUrl}/category/${record.category_id}`, {
          category_id: record.category_id,
        })
        .then((response) => {
          console.log(response.data);
          message.success('Berhasil Menghapus Kategori!');
          setEditedCategory(null);
          setModalVisibility(false);
          getAllCategory();
        });
    } catch (error) {
      console.log(error);
      message.error('Gagal Menghapus Kategori!');
    }
  };

  // const deleteSubcategory = (record) => {
  //   try {
  //     axios
  //       .delete(`${baseUrl}/subcategory/${record.subcategory_id}`, {
  //         subcategory_id: record.subcategory_id,
  //       })
  //       .then((response) => {
  //         console.log(response.data);
  //         message.success('Berhasil Menghapus Sub Kategori!');
  //         setEditedSubcategory(null);
  //         setModal2Visibility(false);
  //         getAllSubcategory();
  //       });
  //   } catch (error) {
  //     console.log(error);
  //     message.error('Gagal Menghapus Sub Kategori!');
  //   }
  // };

  const onFinish = (values) => {
    if (editedCategory === null) {
      try {
        axios.post(`${baseUrl}/category`, values).then((response) => {
          console.log(response.data);
          message.success('Berhasil Menambahkan Kategori!');
          setModalVisibility(false);
          getAllCategory();
        });
      } catch (error) {
        console.log(error);
        message.error('Gagal Menambahkan Kategori!');
      }
    } else {
      try {
        axios
          .put(`${baseUrl}/category/${editedCategory.category_id}`, {
            ...values,
            category_id: editedCategory.category_id,
          })
          .then((response) => {
            console.log(response.data);
            message.success('Berhasil Mengedit Kategori!');
            setEditedCategory(null);
            setModalVisibility(false);
            getAllCategory();
          });
      } catch (error) {
        console.log(error);
        message.error('Gagal Mengedit Kategori!');
      }
    }
  };

  // const onFinish2 = (values) => {
  //   if (editedSubcategory === null) {
  //     try {
  //       axios.post(`${baseUrl}/subcategory`, values).then((response) => {
  //         console.log(response.data);
  //         message.success('Berhasil Menambahkan Sub Kategori!');
  //         setModal2Visibility(false);
  //         getAllSubcategory();
  //       });
  //     } catch (error) {
  //       console.log(error);
  //       message.error('Gagal Menambahkan Sub Kategori!');
  //     }
  //   } else {
  //     try {
  //       axios
  //         .put(`${baseUrl}/subcategory/${editedSubcategory.subcategory_id}`, {
  //           ...values,
  //           subcategory_id: editedSubcategory.subcategory_id,
  //         })
  //         .then((response) => {
  //           console.log(response.data);
  //           message.success('Berhasil Mengedit Sub Kategori!');
  //           setEditedSubcategory(null);
  //           setModal2Visibility(false);
  //           getAllSubcategory();
  //         });
  //     } catch (error) {
  //       console.log(error);
  //       message.error('Gagal Mengedit Sub Kategori!');
  //     }
  //   }
  // };

  // useEffect(() => {
  //   getAllCategory();
  //   getAllSubcategory();
  // }, []);

  const columns = [
    {
      title: 'ID Kategori',
      dataIndex: 'category_id',
    },
    {
      title: 'Nama Kategori',
      dataIndex: 'category_name',
    },
    // {
    //   title: 'Deskripsi',
    //   dataIndex: 'category_desc',
    // },
    {
      title: 'Action',
      dataIndex: '_id',
      render: (id, record) => (
        <div className='d-flex'>
          <EditOutlined
            className='mx-2'
            style={{ fontSize: '20px', color: 'Gold' }}
            onClick={() => {
              setEditedCategory(record);
              setModalVisibility(true);
              console.log(record.category_id);
            }}
          />
          <DeleteOutlined
            className='mx-2'
            style={{ fontSize: '20px', color: 'red' }}
            onClick={() => deleteCategory(record)}
          />
        </div>
      ),
    },
  ];

  // const columns2 = [
  //   {
  //     title: 'ID Sub Kategori',
  //     dataIndex: 'subcategory_id',
  //   },
  //   {
  //     title: 'Nama Sub Kategori',
  //     dataIndex: 'subcategory_name',
  //   },
  //   {
  //     title: 'Deskripsi',
  //     dataIndex: 'subcategory_desc',
  //   },
  //   {
  //     title: 'Kategori',
  //     dataIndex: 'category_name',
  //   },
  //   {
  //     title: 'Action',
  //     dataIndex: '_id',
  //     render: (id, record) => (
  //       <div className='d-flex'>
  //         <EditOutlined
  //           className='mx-2'
  //           style={{ fontSize: '20px', color: 'Gold' }}
  //           onClick={() => {
  //             setEditedSubcategory(record);
  //             setModal2Visibility(true);
  //             console.log(record.subcategory_id);
  //           }}
  //         />
  //         <DeleteOutlined
  //           className='mx-2'
  //           style={{ fontSize: '20px', color: 'red' }}
  //           onClick={() => deleteSubcategory(record)}
  //         />
  //       </div>
  //     ),
  //   },
  // ];

  return (
    <DefaultLayout>
      <div className='d-flex justify-content-between mt-2'>
        <h3 className='mb-4'>Category List</h3>
        <Button type='primary' onClick={() => setModalVisibility(true)}>
          Add Category
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={categoryData}
        pagination={{ pageSize: 6 }}
      />

      {modalVisibility && (
        <Modal
          onCancel={() => {
            setModalVisibility(false);
            setEditedCategory(null);
          }}
          visible={modalVisibility}
          footer={false}
          title={`${
            editedCategory !== null ? 'Edit Kategori' : 'Add Kategori'
          }`}
        >
          <Form
            layout='vertical'
            onFinish={onFinish}
            initialValues={editedCategory}
          >
            <Form.Item name='category_name' label='Category Name'>
              <Input />
            </Form.Item>
            {/* <Form.Item name='category_desc' label='Category Description'>
              <Input />
            </Form.Item> */}

            <div className='d-flex justify-content-end'>
              <Button htmlType='submit' type='primary'>
                Save
              </Button>
            </div>
          </Form>
        </Modal>
      )}

      {/* <hr /> */}

      {/* <div className='d-flex justify-content-between my-2 mt-3'>
        <h3 className='mb-4'>Subcategory List</h3>
        <Button type='primary' onClick={() => setModal2Visibility(true)}>
          Add Subcategory
        </Button>
      </div> */}

      {/* <Table
        columns={columns2}
        dataSource={subcategoryData}
        pagination={{ pageSize: 2 }}
      />

      {modal2Visibility && (
        <Modal
          onCancel={() => {
            setModal2Visibility(false);
            setEditedSubcategory(null);
          }}
          visible={modal2Visibility}
          footer={false}
          title={`${
            editedSubcategory !== null
              ? 'Edit Sub Kategori'
              : 'Add Sub Kategori'
          }`}
        >
          <Form
            layout='vertical'
            onFinish={onFinish2}
            initialValues={editedSubcategory}
          >
            <Form.Item name='subcategory_name' label='Sub Category Name'>
              <Input />
            </Form.Item>
            <Form.Item name='subcategory_desc' label='Sub Category Description'>
              <Input />
            </Form.Item>
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
      )} */}
    </DefaultLayout>
  );
};

export default Category;
