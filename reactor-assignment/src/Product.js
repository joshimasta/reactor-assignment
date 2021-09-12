import './App.css';
import React from 'react';

function Product({product, manufacturerData}) {
  // const [productType, setProductType] = React.useState("gloves");
  // const [productData, setProductData] = React.useState({});
  // const [unknownManufacturerData, setUnknownManufacturerData] = React.useState([]);
  // const [manufacturerData, setManufacturerData] = React.useState({});
  // const [reset, setreset] = React.useState(0);


  const parseDataPayload = (payload) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(payload,"text/xml");
    return xmlDoc.getElementsByTagName("INSTOCKVALUE")[0].innerHTML
  }

  if(manufacturerData[product.manufacturer]){
    // return <li key={product.id}>{JSON.stringify(product)}, {parseDataPayload(manufacturerData[product.manufacturer][manufacturerData[product.manufacturer].findIndex(
    //     (manufacturerItem)=>{return manufacturerItem.id.toLowerCase() == product.id.toLowerCase()}
    //   )].DATAPAYLOAD)}</li>
    const instockStatus = parseDataPayload(manufacturerData[product.manufacturer][manufacturerData[product.manufacturer].findIndex(
        (manufacturerItem)=>{return manufacturerItem.id.toLowerCase() === product.id.toLowerCase()}
      )].DATAPAYLOAD)
    return <tr key={product.id}>
      <th>{product.type}</th>
      <th>{product.name}</th>
      <th>{product.color}</th>
      <th>{product.price}</th>
      <th>{product.manufacturer}</th>
      <th>{instockStatus}</th>
    </tr>
  }else{
    return <tr key={product.id}>
      <th>{product.type}</th>
      <th>{product.name}</th>
      <th>{product.color}</th>
      <th>{product.price}</th>
      <th>{product.manufacturer}</th>
      <th>fetching availability status...</th>
    </tr>
  }
}

export default Product;
