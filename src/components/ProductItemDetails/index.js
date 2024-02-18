import {Component} from 'react'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Header from '../Header'

import './index.css'

const fetchingDataStatus = {
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class ProductItemDetails extends Component {
  state = {
    selectedProductDetails: {},
    similarProductsDetails: [],
    quantity: 1,
    fetchingStatus: fetchingDataStatus.inProgress,
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    const jwtToken = Cookies.get('jwt_token')
    console.log(jwtToken)

    const {match} = this.props
    const {params} = match
    const {id} = params
    console.log(id)

    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      method: 'GET',
      Authorization: `Bearer ${jwtToken}`,
    }

    const response = await fetch(url, options)
    console.log(response)
    if (response.ok) {
      const data = await response.json()
      console.log(data)
      const similarProducts = data.similar_products
      const updatedSimilarProducts = similarProducts.map(eachItem => ({
        id: eachItem.id,
        imageUrl: eachItem.imageUrl,
        title: eachItem.title,
        style: eachItem.style,
        price: eachItem.price,
        description: eachItem.description,
        brand: eachItem.brand,
        totalReviews: eachItem.total_reviews,
        rating: eachItem.rating,
        availability: eachItem.availability,
      }))
      const selectedProductData = {
        id: data.id,
        imageUrl: data.image_url,
        title: data.title,
        price: data.price,
        description: data.description,
        brand: data.brand,
        totalReviews: data.total_reviews,
        rating: data.rating,
        availability: data.availability,
        similarProducts: updatedSimilarProducts,
      }
      this.setState({
        selectedProductDetails: selectedProductData,
        similarProductsDetails: updatedSimilarProducts,
        fetchingStatus: fetchingDataStatus.success,
      })
    } else {
      this.setState({
        fetchingStatus: fetchingDataStatus.failure,
      })
    }
  }

  renderInProgress = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderAllProductsDetails = () => (
    <>
      {this.renderProductDetails()}
      {this.renderSimilarProducts()}
    </>
  )

  renderAllProducts = () => {
    const {fetchingStatus} = this.state

    switch (fetchingStatus) {
      case fetchingDataStatus.success:
        return this.renderAllProductsDetails()
      case fetchingDataStatus.failure:
        return this.renderProductNotFound()
      case fetchingDataStatus.inProgress:
        return this.renderInProgress()

      default:
        return null
    }
  }

  renderProductDetails = () => {
    const {selectedProductDetails, quantity} = this.state
    const {
      imageUrl,
      title,
      price,
      description,
      brand,
      totalReviews,
      rating,
      availability,
    } = selectedProductDetails

    return (
      <div className="product-details-container">
        <img alt={title} src={imageUrl} className="selected-product-img" />
        <div className="product-text-details-container">
          <h1 className="selected-product-name">{title}</h1>
          <p className="selected-product-cost">Rs {price}/-</p>
          <div className="rating-reviews-container">
            <div className="rating-container">
              <p className="rating-text">{rating}</p>
            </div>
            <p className="selected-product-reviews">{totalReviews} Reviews</p>
          </div>
          <p className="selected-product-description">{description}</p>
          <p className="selected-product-availability">
            <span className="thick-text">Availability:</span> {availability}
          </p>
          <p className="selected-product-availability">
            <span className="thick-text">Brand:</span> {brand}
          </p>
          <hr className="horizontal-line" />
          <div className="product-quantity-container">
            <button type="button" className="quantity-button">
              -
            </button>
            <p className="quantity-text">{quantity}</p>

            <button type="button" className="quantity-button">
              +
            </button>
          </div>
          <button type="button" className="add-cart-button">
            ADD TO CART
          </button>
        </div>
      </div>
    )
  }

  renderSimilarProduct = itemDetails => {
    const {imageUrl, title, brand, price, rating} = itemDetails

    return (
      <div className="similar-product-card">
        <img alt={title} src={imageUrl} className="similar-product-img" />
        <p className="similar-product-title">{title}</p>
        <p className="similar-product-brand">{brand}</p>
        <div className="similar-product-price-rating-container">
          <p className="similar-product-price">Rs {price}/-</p>
          <div className="rating-container">
            <p className="similar-product-rating">{rating}</p>
          </div>
        </div>
      </div>
    )
  }

  renderSimilarProducts = () => {
    const {similarProductsDetails} = this.state

    return (
      <div className="bottom-container">
        <h1 className="similar-products-heading">Similar Products</h1>
        <div className="similar-products-container">
          {similarProductsDetails.map(eachItem =>
            this.renderSimilarProduct(eachItem),
          )}
        </div>
      </div>
    )
  }

  renderProductNotFound = () => (
    <div className="product-not-found-container">
      <img
        alt="error view"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png "
        className="product-not-found-img"
      />
      <h1 className="not-found-heading">Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="continue-shopping-button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  render() {
    const {fetchSuccessful} = this.state
    console.log(fetchSuccessful)
    return (
      <>
        <Header />
        <div className="product-item-details-container">
          {this.renderAllProducts()}
        </div>
      </>
    )
  }
}

export default ProductItemDetails
