import './index.css'

const SimilarProductItem = props => {
  const {item} = props
  const {id, title, brand, imageUrl, rating, price} = item
  console.log(id)
  return (
    <li className="similar-product-item">
      <img src={imageUrl} alt="similar product" className="thumbnail" />
      <h1 className="title">{title}</h1>
      <p className="brand">by {brand}</p>
      <div className="product-details">
        <p className="price">Rs {price}/-</p>
        <div className="rating-container">
          <p className="rating">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
