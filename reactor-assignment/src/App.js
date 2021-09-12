import './App.css';
import React from 'react';
import Product from './Product';


function App() {
  const [productType, setProductType] = React.useState("gloves");
  const [productData, setProductData] = React.useState({});
  const [unknownManufacturerData, setUnknownManufacturerData] = React.useState([]);
  const [manufacturerData, setManufacturerData] = React.useState({});

  // processes data gained from the server
  const processProductData = (type, data) => {
    const newProductData = {...productData}
    newProductData[type] = data
    const manufacturerNames = unknownManufacturerData
    data.forEach((element, index) => {
      if (manufacturerNames.indexOf(element.manufacturer) === -1 && !manufacturerData[element.manufacturer]) manufacturerNames.push(element.manufacturer)
    });
    console.log(type, data)
    console.log(newProductData)
    setProductData(newProductData)
    setUnknownManufacturerData(manufacturerNames)
  }

  React.useEffect(() => {
    if (productData[productType] && productData[productType] !== []) {
      return null
    }
    const controller = new AbortController();
    const { signal } = controller;
    let isSubscribed = true
    fetch("/api/?type=products&category=" + productType, { signal })
      .then((res) => res.json())
      .then((res) => {
        console.log("in loading products, isSubscribed is " + isSubscribed)
        if (!isSubscribed) return;
        processProductData(productType, res)
      })
    return ()=>{
      controller.abort();
      isSubscribed = false
    }
  });

  React.useEffect(() => {
    if (unknownManufacturerData.length < 1) {
      return null
    }
    const controller = new AbortController();
    const { signal } = controller;
    let isSubscribed = true
    const promiseArray = []
    unknownManufacturerData.forEach((manufacturer)=>{
      promiseArray.push(fetch("/api/?type=manufacturers&manufacturers=" + manufacturer, { signal })
      .then((res) => res.json()))
      // .then((res) => processManufacturerData(res))
      // setUnknownManufacturerData([])
    })
    Promise.allSettled(promiseArray)
    .then((promiseArrayResolved)=>{
      if (!isSubscribed) return;
      const manufacturerDataNew = {...manufacturerData}
      const unknownManufacturerDataNew = [...unknownManufacturerData]
      unknownManufacturerData.forEach((manufacturer, index)=>{
        // promiseArray.push(fetch("/api/?type=manufacturers&manufacturers=" + JSON.stringify(unknownManufacturerData))
        // .then((res) => res.json()))
        // processManufacturerData(res)
        const responseValue = promiseArrayResolved[index].value.response
        if (Array.isArray(responseValue)){
          manufacturerDataNew[manufacturer] = responseValue
          const index = unknownManufacturerDataNew.indexOf(manufacturer)
          unknownManufacturerDataNew.splice(index, 1)
        }
        // manufacturerDataTemp[manufacturer] = promiseArray
      })
      setUnknownManufacturerData(unknownManufacturerDataNew)
      setManufacturerData(manufacturerDataNew)
    })
    console.log("fetching manufacturer data with ", (unknownManufacturerData))
    return ()=>{
      //cleanup
      console.log("cleanup")
      controller.abort();
      isSubscribed = false
    }
  });

  const listItems = ()=>{
    if(productData[productType]){
      return productData[productType].map((item) => {
          return <Product key={item.id} product={item} manufacturerData={manufacturerData}></Product>
        })
      
    }else{
      return <tr><th>looking for product data</th></tr>
    }
  }

  return (
    <div className="App">
      <div>
        <button onClick={()=>{setProductType("gloves")}}>gloves</button>
        <button onClick={()=>{setProductType("beanies")}}>beanies</button>
        <button onClick={()=>{setProductType("facemasks")}}>facemasks</button>
        <button onClick={()=>{setUnknownManufacturerData([]);setManufacturerData({});setProductData({})}}>reload product data</button>
      </div>
    <table style={{width: '100%'}}>
      <thead>
        <tr>
          <th>category</th>
          <th>name</th>
          <th>color options</th>
          <th>price</th>
          <th>manufacturer</th>
          <th>stock status</th>
        </tr>
      </thead>
      <tbody>
        {listItems()}
      </tbody>
    </table>
    </div>
  );
}

export default App;
