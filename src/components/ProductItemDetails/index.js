import {Component} from 'react'

import {Link} from 'react-router-dom'

import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'

import SimilarProductItem from '../SimilarProductItem'

import Header from '../Header'

import './index.css'

const status = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failed: 'FAILED',
  loading: 'LOADING',
}

class ProductItemDetails extends Component {
  state = {
    currentStatus: status.initial,
    productItemDetails: [],
    quantityOfProduct: 1,
  }

  componentDidMount() {
    this.getProductDetails()
  }

  getProductDetails = async () => {
    this.setState({currentStatus: status.loading})
    const {match} = this.props
    const {id} = match.params
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)

    if (response.ok === true) {
      const data = await response.json()
      const updatedData = {
        id: data.id,
        imageUrl: data.image_url,
        title: data.title,
        brand: data.brand,
        price: data.price,
        description: data.description,
        totalReviews: data.total_reviews,
        rating: data.rating,
        availability: data.availability,
        similarProducts: data.similar_products,
      }
      this.setState({
        productItemDetails: updatedData,
        currentStatus: status.success,
      })
    }
    if (response.status === 404) {
      this.setState({currentStatus: status.failed})
    }
  }

  renderLoader = () => (
    <div testid="loader" className="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  onClickMinusButton = () => {
    this.setState(prevState => {
      if (prevState.quantityOfProduct === 1) {
        return {quantityOfProduct: 1}
      }
      return {quantityOfProduct: prevState.quantityOfProduct - 1}
    })
  }

  onClickPlusButton = () => {
    this.setState(prevState => ({
      quantityOfProduct: prevState.quantityOfProduct + 1,
    }))
  }

  renderProductDetailsFailureView = () => (
    <div className="product-details-failure-view-container">
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        className="failure-view-image"
      />
      <h1 className="product-not-found-heading">Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderProductDetailsSuccessView = () => {
    const {productItemDetails, quantityOfProduct} = this.state
    const {
      imageUrl,
      title,
      brand,
      price,
      description,
      totalReviews,
      rating,
      availability,
      similarProducts,
    } = productItemDetails

    const updatedSimilarProducts = similarProducts.map(eachItem => ({
      id: eachItem.id,
      imageUrl: eachItem.image_url,
      title: eachItem.title,
      brand: eachItem.brand,
      price: eachItem.price,
      description: eachItem.description,
      totalReviews: eachItem.total_reviews,
      rating: eachItem.rating,
      availability: eachItem.availability,
      eachItem: eachItem.similar_products,
    }))

    return (
      <>
        <div className="product-item-details-section">
          <img
            src={imageUrl}
            className="product-item-details-image"
            alt="product"
          />
          <div className="product-item-details-card">
            <h1 className="product-title"> {title} </h1>
            <p className="product-price">{`Rs ${price}/-`}</p>
            <div className="rating-reviews-container">
              <div className="rating-star-box">
                <p className="rating"> {rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="rating-star-image"
                />
              </div>
              <p className="total-reviews">
                {' '}
                <span className="total-reviews-text">
                  {`${totalReviews} `}
                </span>{' '}
                Reviews
              </p>
            </div>
            <p className="product-description"> {description} </p>
            <p className="bold-text">
              {' '}
              <span className="rs-label"> {`Available: `}</span> {availability}
            </p>
            <p className="bold-text">
              {' '}
              <span className="rs-label"> {`Brand: `}</span>
              {brand}
            </p>
            <hr />
            <div className="product-quantities-container">
              <button
                testid="minus"
                className="plus-minus-button"
                type="button"
                onClick={this.onClickMinusButton}
              >
                <BsDashSquare />
              </button>

              <p className="quantity-product"> {quantityOfProduct} </p>
              <button
                testid="plus"
                className="plus-minus-button"
                type="button"
                onClick={this.onClickPlusButton}
              >
                <BsPlusSquare />
              </button>
            </div>
            <button type="button" className="add-to-cart-button">
              {' '}
              Add To Cart{' '}
            </button>
          </div>
        </div>

        <div className="similar-product-item-container">
          <h1 className="similar-products-heading"> Similar Products </h1>
          <ul className="similar-product-item-section">
            {updatedSimilarProducts.map(item => (
              <SimilarProductItem item={item} key={item.id} />
            ))}
          </ul>
        </div>
      </>
    )
  }

  renderProductDetailsSection = () => {
    const {currentStatus} = this.state
    switch (currentStatus) {
      case status.loading:
        return this.renderLoader()
      case status.success:
        return this.renderProductDetailsSuccessView()
      case 'FAILED':
        return this.renderProductDetailsFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="product-item-details-bcg-container">
          {this.renderProductDetailsSection()}
        </div>
      </>
    )
  }
}

export default ProductItemDetails
