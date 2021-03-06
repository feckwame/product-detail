/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/sort-comp */
/* eslint-disable camelcase */
/* eslint-disable import/extensions */
/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';
import axios from 'axios';
import '../styles.scss';
import PriceComponent from './PriceComponent.jsx';
import ProductHeader from './ProductHeaderlInfo.jsx';
import AddToCardComponent from './AddToCardComponent.jsx';

class ProductDetail extends React.Component {
  constructor() {
    // eslint-disable-next-line no-unused-expressions
    super();
    this.state = {
      brand: '',
      itemSeller: '',
      itemName: '',
      itemSizes: [],
      currentSize: '0',
      average_stars: '0',
      QA: '17',
      sizes: [],
      sizeButton: 0,
    };
    this.getProductFullData = this.getProductFullData.bind(this);
    this.handleDifferentSizeOptions = this.handleDifferentSizeOptions.bind(this);
  }

  handleDifferentSizeOptions(event) {
    event.preventDefault();
    this.setState({
      currentSize: event.target.id,
    });
  }

  getProductFullData(productId) {
    axios.get(`http://3.218.98.72:3001/productFullData/${productId}`)
      .then((result) => {
        // console.log('\\\\\\\\\\\\\\', result.data);
        const sizes = result.data.size_options.map((option) => option.size);
        const {
          brand,
          seller,
          name,
          size_options,
          review_count,
          average_stars,
        } = result.data;

        this.setState({
          itemBrand: brand,
          itemSeller: seller,
          itemName: name,
          itemSizes: size_options,
          count: review_count,
          average_stars,
          sizes,
          sizeButton: result.data.size_options[0].size,

        });
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  componentDidMount() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('productId');
    this.getProductFullData(id === null ? 'P001' : id);
  }

  render() {
    const { itemSizes } = this.state;
    return (
      <div id="main">
        {
        itemSizes.length
          ? (
            <>
              <section id="right-column">
                <div id="zoom-container" />
                <ProductHeader
                  name={this.state.itemName}
                  seller={this.state.itemSeller}
                  brand={this.state.itemBrand}
                  count={this.state.count}
                  averageStars={this.state.average_stars}
                  answersCount={this.state.QA}
                />
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <PriceComponent
                          price={itemSizes[this.state.currentSize].price}
                          discount={itemSizes[this.state.currentSize].discount}
                          stock={itemSizes[this.state.currentSize].item_stock}
                          csize={itemSizes[this.state.currentSize].size}
                          changeSize={this.handleDifferentSizeOptions}
                          options={this.state.sizes}
                          buttonOption={this.state.sizeButton}
                        />
                      </td>
                      <td id="td1">
                        <AddToCardComponent stock={itemSizes[this.state.currentSize].item_stock} />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </section>
            </>
          )
          : <div>Loading...</div>
        }
      </div>
    );
  }
}

export default ProductDetail;
