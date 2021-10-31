import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import ProductSelectionForm from "../../components/ProductSelectionForm";

import Payroll from "./images/payroll.svg";
import Pos from "./images/pos.svg";
import Ecom from "./images/ecom.svg";

import CONSTANTS from "../../constants";
import { getProductsList } from "../../redux/auth/action";

const {
  ROUTES: { REGISTER },
  PRODUCTS: { POS, ECOM, PAYROLL }
} = CONSTANTS;

//hardcoded
const ImageMapping = {
  [POS]: Pos,
  [ECOM]: Ecom,
  [PAYROLL]: Payroll
};

export default function ProductSelection() {
  const history = useHistory();
  const dispatch = useDispatch();

  const [disable, setDisable] = useState(true);
  const [loading, setLoading] = useState(true);
  const [productsCopy, setProductsCopy] = useState([]);

  const products = useSelector(state => state.auth.products);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        await dispatch(getProductsList());
      } catch (err) {
        throw err;
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [dispatch]);

  useEffect(() => {
    if (products) {
      setProductsCopy(
        products.map(product => ({
          ...product,
          status: false,
          image: ImageMapping[product.id]
        }))
      );
    }
  }, [products]);

  useEffect(() => {
    setDisable(
      !productsCopy.reduce((res, { status }) => (res = res || status), false)
    );
  }, [productsCopy]);

  const handleSelect = id => {
    const updatedProducts = [...productsCopy];

    for (let i = 0; i < productsCopy.length; i++) {
      if (productsCopy[i].id === id) {
        updatedProducts[i].status = !updatedProducts[i].status;
        break;
      }
    }
    setProductsCopy(updatedProducts);
  };

  const handleSubmit = e => {
    e.preventDefault();

    history.push({
      pathname: REGISTER,
      state: {
        productId: productsCopy.filter(p => p.status).map(p => p.id)
      }
    });
  };

  return (
    <ProductSelectionForm
      loading={loading}
      products={productsCopy}
      disable={disable}
      handleSelect={handleSelect}
      handleSubmit={handleSubmit}
    />
  );
}
