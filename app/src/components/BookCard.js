import React from "react";
import PropTypes from "prop-types";

const BookCard = ({ data, isFav, user, onRemoveRefresh }) => {
  const { volumeInfo, selfLink } = data;
  const { title, description, imageLinks, authors } = volumeInfo;

  const onAdd = (book) => {
    fetch("/api/my-books?userid=" + user.username + "&bookurl=" + book, {
      mode: "cors",
      method: "POST",
    }).then((res) => console.log(res));
  };
  const onRemove = (book) => {
    fetch("/api/my-books/delete?userid=" + user.username + "&bookurl=" + book, {
      mode: "cors",
      method: "POST",
    })
      .then((res) => console.log(res))
      .then(onRemoveRefresh());
  };

  return (
    <div className="book-card">
      <img className="book-img" src={imageLinks?.thumbnail} alt={title} />
      <div className="details">
        <h2>{title}</h2>
        <h3>{description}</h3>
        <div className="keyword" key={authors}>
          {authors}
        </div>
      </div>
      {(isFav === "true" ||
        user.interestedIn?.find((item) => item === selfLink)) && (
        <button
          className="btn small-btn btn-hover"
          onClick={() => onRemove(selfLink)}
        >
          Remove
        </button>
      )}

      {isFav === "false" &&
        !user.interestedIn?.find((item) => item === selfLink) && (
          <button
            className="btn small-btn btn-hover"
            onClick={() => onAdd(selfLink)}
          >
            Add to Fav
          </button>
        )}
    </div>
  );
};
BookCard.defaultProps = {
  data: {},
  isFav: "false",
};
BookCard.propTypes = {
  data: PropTypes.object.isRequired,
  isFav: PropTypes.string.isRequired,
};

export default BookCard;
