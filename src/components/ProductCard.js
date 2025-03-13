import { Button } from 'antd';
import { useDispatch } from 'react-redux';

const ProductCard = ({ item }) => {
  const dispatch = useDispatch();

  const addToCart = () => {
    dispatch({ type: 'addToCart', payload: { ...item, quantity: 1 } });
  };

  return (
    <div className='card' style={{ marginBottom: '25px' }}>
      {/* <img
        src={item.product_img}
        alt='Produk'
        width='160'
        height='160'
        className='mx-auto p-2'
      /> */}
      <div className='card-body'>
        <div className='justify-content-between mb-3'>
          <h2 className='mb-2'>{item.product_name}</h2>
          <h5 className='text-dark mb-0'>Rp{item.product_price}</h5>
        </div>
        <div className='d-flex'>
          <Button type='primary' onClick={() => addToCart()}>
            Add +
          </Button>
        </div>
      </div>
    </div>
    // <div className='product-card'>
    //   <div class='img-box'>
    //     <img src={item.product_img} class='img-fluid' alt='produk' />
    //   </div>
    //   <div class='thumb-content'>
    //     <h4>{item.product_name}</h4>
    //     <p class='item-price'>
    //       <b>Rp{item}</b>
    //     </p>
    //     <div className='d-flex'>
    //       <Button>Add</Button>
    //     </div>
    //   </div>
    //   {/* <h4>{item.product_name}</h4>
    //   <img
    //     src={item.product_img}
    //     alt='gambar produk'
    //     height='140'
    //     width='140'
    //   />
    //   <h4>Rp{item.product_price}</h4>
    //   <div className='d-flex'>
    //     <Button>Add</Button>
    //   </div> */}
    // </div>
  );
};

export default ProductCard;
